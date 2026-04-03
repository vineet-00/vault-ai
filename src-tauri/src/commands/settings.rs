use crate::db::init_db;
use crate::models::WatchedFolder;
use chrono::Utc;
use uuid::Uuid;

#[tauri::command]
pub fn get_watched_folders() -> Result<Vec<WatchedFolder>, String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT id, path, is_paused, created_at FROM watched_folders")
        .map_err(|e| e.to_string())?;

    let folders = stmt
        .query_map([], |row| {
            Ok(WatchedFolder {
                id: row.get(0)?,
                path: row.get(1)?,
                is_paused: row.get::<_, i32>(2)? != 0,
                created_at: row.get(3)?,
            })
        })
        .map_err(|e| e.to_string())?
        .filter_map(|r| r.ok())
        .collect();

    Ok(folders)
}

#[tauri::command]
pub fn add_watched_folder(path: String) -> Result<WatchedFolder, String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    let id = Uuid::new_v4().to_string();
    let now = Utc::now().to_rfc3339();

    conn.execute(
        "INSERT OR IGNORE INTO watched_folders (id, path, is_paused, created_at)
         VALUES (?1, ?2, 0, ?3)",
        rusqlite::params![&id, &path, &now],
    )
    .map_err(|e| e.to_string())?;

    Ok(WatchedFolder {
        id,
        path,
        is_paused: false,
        created_at: Some(now),
    })
}

#[tauri::command]
pub fn remove_watched_folder(id: String) -> Result<bool, String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM watched_folders WHERE id = ?1", [&id])
        .map_err(|e| e.to_string())?;
    Ok(true)
}

#[tauri::command]
pub fn toggle_folder_pause(id: String) -> Result<WatchedFolder, String> {
    let conn = init_db().map_err(|e| e.to_string())?;

    // Get current state
    let (path, is_paused, created_at): (String, i32, Option<String>) = conn
        .query_row(
            "SELECT path, is_paused, created_at FROM watched_folders WHERE id = ?1",
            [&id],
            |row| Ok((row.get(0)?, row.get(1)?, row.get(2)?)),
        )
        .map_err(|e| e.to_string())?;

    let new_paused = if is_paused == 0 { 1 } else { 0 };

    conn.execute(
        "UPDATE watched_folders SET is_paused = ?1 WHERE id = ?2",
        rusqlite::params![new_paused, &id],
    )
    .map_err(|e| e.to_string())?;

    Ok(WatchedFolder {
        id,
        path,
        is_paused: new_paused != 0,
        created_at,
    })
}

// ── Ollama model management ──────────────────────────────────────────────────

#[derive(serde::Serialize, serde::Deserialize)]
pub struct OllamaModel {
    pub name: String,
    pub size: u64,
}

#[derive(serde::Deserialize)]
struct OllamaTagsResponse {
    models: Vec<OllamaModelRaw>,
}

#[derive(serde::Deserialize)]
struct OllamaModelRaw {
    name: String,
    size: u64,
}

#[tauri::command]
pub async fn get_ollama_models() -> Result<Vec<OllamaModel>, String> {
    let client = reqwest::Client::new();
    let response = client
        .get("http://127.0.0.1:11434/api/tags")
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let tags: OllamaTagsResponse = response
        .json()
        .await
        .map_err(|e| e.to_string())?;

    Ok(tags
        .models
        .into_iter()
        .map(|m| OllamaModel {
            name: m.name,
            size: m.size,
        })
        .collect())
}
