use crate::db::init_db;
use crate::models::Document;
use std::path::Path;

fn detect_file_type(path: &str) -> String {
    let ext = Path::new(path)
        .extension()
        .and_then(|e| e.to_str())
        .unwrap_or("")
        .to_lowercase();

    match ext.as_str() {
        "pdf" => "pdf",
        "md" | "markdown" => "markdown",
        "txt" => "text",
        "rs" => "code",
        "ts" | "tsx" | "js" | "jsx" => "code",
        "py" => "code",
        "png" | "jpg" | "jpeg" | "webp" => "image",
        _ => "unknown",
    }
    .to_string()
}

fn get_file_size(path: &str) -> Option<i64> {
    std::fs::metadata(path).ok().map(|m| m.len() as i64)
}

fn extract_title(path: &str) -> String {
    Path::new(path)
        .file_stem()
        .and_then(|s| s.to_str())
        .unwrap_or("Untitled")
        .to_string()
}

#[tauri::command]
pub fn ingest_file(path: String) -> Result<Document, String> {
    let conn = init_db().map_err(|e| e.to_string())?;

    // Check if already ingested
    let existing: Option<String> = conn
        .query_row("SELECT id FROM documents WHERE path = ?1", [&path], |row| {
            row.get(0)
        })
        .ok();

    if let Some(id) = existing {
        // Return existing document
        let doc = conn
            .query_row(
                "SELECT id, title, file_type, folder_id, path, size,
                 page_count, embedding_status, summary, created_at, updated_at
                 FROM documents WHERE id = ?1",
                [&id],
                |row| {
                    Ok(Document {
                        id: row.get(0)?,
                        title: row.get(1)?,
                        file_type: row.get(2)?,
                        folder_id: row.get(3)?,
                        path: row.get(4)?,
                        size: row.get(5)?,
                        page_count: row.get(6)?,
                        embedding_status: row.get(7)?,
                        summary: row.get(8)?,
                        tags: vec![],
                        created_at: row.get(9)?,
                        updated_at: row.get(10)?,
                    })
                },
            )
            .map_err(|e| e.to_string())?;
        return Ok(doc);
    }

    let id = uuid::Uuid::new_v4().to_string();
    let title = extract_title(&path);
    let file_type = detect_file_type(&path);
    let size = get_file_size(&path);
    let now = chrono::Utc::now().to_rfc3339();

    conn.execute(
        "INSERT INTO documents
         (id, title, file_type, path, size, embedding_status, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, 'pending', ?6, ?6)",
        rusqlite::params![&id, &title, &file_type, &path, size, &now],
    )
    .map_err(|e| e.to_string())?;

    Ok(Document {
        id,
        title,
        file_type,
        folder_id: None,
        path,
        size,
        page_count: None,
        embedding_status: "pending".to_string(),
        summary: None,
        tags: vec![],
        created_at: Some(now.clone()),
        updated_at: Some(now),
    })
}
