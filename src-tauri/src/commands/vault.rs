use crate::db::init_db;
use crate::models::{Document, Folder, Tag};

#[tauri::command]
pub fn get_folders() -> Result<Vec<Folder>, String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT id, name, parent_id FROM folders")
        .map_err(|e| e.to_string())?;

    let folders = stmt
        .query_map([], |row| {
            Ok(Folder {
                id: row.get(0)?,
                name: row.get(1)?,
                parent_id: row.get(2)?,
            })
        })
        .map_err(|e| e.to_string())?
        .filter_map(|r| r.ok())
        .collect();

    Ok(folders)
}

#[tauri::command]
pub fn get_tags() -> Result<Vec<Tag>, String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT id, name FROM tags")
        .map_err(|e| e.to_string())?;

    let tags = stmt
        .query_map([], |row| {
            Ok(Tag {
                id: row.get(0)?,
                name: row.get(1)?,
            })
        })
        .map_err(|e| e.to_string())?
        .filter_map(|r| r.ok())
        .collect();

    Ok(tags)
}

#[tauri::command]
pub fn get_documents() -> Result<Vec<Document>, String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare(
            "SELECT id, title, file_type, folder_id, path, size,
             page_count, embedding_status, summary, created_at, updated_at
             FROM documents ORDER BY created_at DESC",
        )
        .map_err(|e| e.to_string())?;

    let docs: Vec<Document> = stmt
        .query_map([], |row| {
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
        })
        .map_err(|e| e.to_string())?
        .filter_map(|r| r.ok())
        .collect();

    // Attach tags to each document
    let mut docs_with_tags = Vec::new();
    for mut doc in docs {
        let mut tag_stmt = conn
            .prepare(
                "SELECT t.id, t.name FROM tags t
                 JOIN document_tags dt ON t.id = dt.tag_id
                 WHERE dt.document_id = ?1",
            )
            .map_err(|e| e.to_string())?;

        doc.tags = tag_stmt
            .query_map([&doc.id], |row| {
                Ok(Tag {
                    id: row.get(0)?,
                    name: row.get(1)?,
                })
            })
            .map_err(|e| e.to_string())?
            .filter_map(|r| r.ok())
            .collect();

        docs_with_tags.push(doc);
    }

    Ok(docs_with_tags)
}

#[tauri::command]
pub fn delete_document(id: String) -> Result<bool, String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM document_tags WHERE document_id = ?1", [&id])
        .map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM documents WHERE id = ?1", [&id])
        .map_err(|e| e.to_string())?;
    Ok(true)
}

#[tauri::command]
pub fn add_tag(document_id: String, tag_name: String) -> Result<(), String> {
    let conn = init_db().map_err(|e| e.to_string())?;

    // Get or create tag
    let tag_id: Option<String> = conn
        .query_row("SELECT id FROM tags WHERE name = ?1", [&tag_name], |row| {
            row.get(0)
        })
        .ok();

    let tag_id = match tag_id {
        Some(id) => id,
        None => {
            let id = uuid::Uuid::new_v4().to_string();
            conn.execute(
                "INSERT INTO tags (id, name) VALUES (?1, ?2)",
                [&id, &tag_name],
            )
            .map_err(|e| e.to_string())?;
            id
        }
    };

    conn.execute(
        "INSERT OR IGNORE INTO document_tags (document_id, tag_id) VALUES (?1, ?2)",
        [&document_id, &tag_id],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}
