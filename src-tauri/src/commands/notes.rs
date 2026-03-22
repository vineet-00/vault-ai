use crate::db::init_db;
use crate::models::{Note, Tag};
use chrono::Utc;
use uuid::Uuid;

#[tauri::command]
pub fn get_notes() -> Result<Vec<Note>, String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare(
            "SELECT id, title, content, folder_id, created_at, updated_at
             FROM notes ORDER BY updated_at DESC",
        )
        .map_err(|e| e.to_string())?;

    let notes: Vec<Note> = stmt
        .query_map([], |row| {
            Ok(Note {
                id: row.get(0)?,
                title: row.get(1)?,
                content: row.get(2)?,
                folder_id: row.get(3)?,
                tags: vec![],
                created_at: row.get(4)?,
                updated_at: row.get(5)?,
            })
        })
        .map_err(|e| e.to_string())?
        .filter_map(|r| r.ok())
        .collect();

    // Attach tags to each note
    let mut notes_with_tags = Vec::new();
    for mut note in notes {
        let mut tag_stmt = conn
            .prepare(
                "SELECT t.id, t.name FROM tags t
                 JOIN note_tags nt ON t.id = nt.tag_id
                 WHERE nt.note_id = ?1",
            )
            .map_err(|e| e.to_string())?;

        note.tags = tag_stmt
            .query_map([&note.id], |row| {
                Ok(Tag {
                    id: row.get(0)?,
                    name: row.get(1)?,
                })
            })
            .map_err(|e| e.to_string())?
            .filter_map(|r| r.ok())
            .collect();

        notes_with_tags.push(note);
    }

    Ok(notes_with_tags)
}

#[tauri::command]
pub fn create_note() -> Result<Note, String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    let id = Uuid::new_v4().to_string();
    let now = Utc::now().to_rfc3339();

    conn.execute(
        "INSERT INTO notes (id, title, content, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?4)",
        rusqlite::params![&id, "Untitled Note", "", &now],
    )
    .map_err(|e| e.to_string())?;

    Ok(Note {
        id,
        title: "Untitled Note".to_string(),
        content: "".to_string(),
        folder_id: None,
        tags: vec![],
        created_at: Some(now.clone()),
        updated_at: Some(now),
    })
}

#[tauri::command]
pub fn update_note(id: String, title: String, content: String) -> Result<(), String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    let now = Utc::now().to_rfc3339();

    conn.execute(
        "UPDATE notes SET title = ?1, content = ?2, updated_at = ?3 WHERE id = ?4",
        rusqlite::params![&title, &content, &now, &id],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub fn delete_note(id: String) -> Result<bool, String> {
    let conn = init_db().map_err(|e| e.to_string())?;

    conn.execute("DELETE FROM note_tags WHERE note_id = ?1", [&id])
        .map_err(|e| e.to_string())?;

    conn.execute("DELETE FROM notes WHERE id = ?1", [&id])
        .map_err(|e| e.to_string())?;

    Ok(true)
}
