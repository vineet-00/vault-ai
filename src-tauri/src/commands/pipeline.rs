use crate::db::init_db;
use crate::embeddings::embed_text;
use crate::vector_store::add_embedding;
use tauri::Emitter;
use rusqlite::params;
use tauri::AppHandle;
use uuid::Uuid;

/// Split text into overlapping chunks of ~500 words
fn chunk_text(text: &str, chunk_size: usize, overlap: usize) -> Vec<String> {
    let words: Vec<&str> = text.split_whitespace().collect();
    if words.is_empty() {
        return vec![];
    }

    let mut chunks = Vec::new();
    let mut start = 0;

    while start < words.len() {
        let end = (start + chunk_size).min(words.len());
        let chunk = words[start..end].join(" ");
        chunks.push(chunk);
        if end == words.len() {
            break;
        }
        start += chunk_size - overlap;
    }

    chunks
}

/// Extract text from a file based on its type
fn extract_text(path: &str, file_type: &str) -> Result<String, String> {
    match file_type {
        "pdf" => {
            let bytes = std::fs::read(path).map_err(|e| e.to_string())?;
            pdf_extract::extract_text_from_mem(&bytes).map_err(|e| e.to_string())
        }
        _ => std::fs::read_to_string(path).map_err(|e| e.to_string()),
    }
}

#[tauri::command]
pub async fn embed_document(document_id: String, app: AppHandle) -> Result<(), String> {
    // 1. Get document from SQLite
    let (path, file_type) = {
        let conn = init_db().map_err(|e| e.to_string())?;
        conn.query_row(
            "SELECT path, file_type FROM documents WHERE id = ?1",
            [&document_id],
            |row| Ok((row.get::<_, String>(0)?, row.get::<_, String>(1)?)),
        )
        .map_err(|e| e.to_string())?
    };

    // 2. Update status to processing
    {
        let conn = init_db().map_err(|e| e.to_string())?;
        conn.execute(
            "UPDATE documents SET embedding_status = 'processing' WHERE id = ?1",
            [&document_id],
        )
        .map_err(|e| e.to_string())?;
    }
    app.emit("embedding_status", (&document_id, "processing"))
        .map_err(|e| e.to_string())?;

    // 3. Extract text
    let text = extract_text(&path, &file_type)?;

    // 4. Chunk text
    let chunks = chunk_text(&text, 500, 50);
    if chunks.is_empty() {
        return Err("No text extracted from document".to_string());
    }

    // 5. Embed each chunk and store
    for (i, chunk) in chunks.iter().enumerate() {
        let chunk_id = Uuid::new_v4().to_string();

        // Store chunk text in SQLite
        {
            let conn = init_db().map_err(|e| e.to_string())?;
            conn.execute(
                "INSERT INTO chunks (id, document_id, content, chunk_index)
                 VALUES (?1, ?2, ?3, ?4)",
                params![&chunk_id, &document_id, chunk, i as i32],
            )
            .map_err(|e| e.to_string())?;
        }

        // Embed and store in usearch
        let embedding = embed_text(chunk)?;
        add_embedding(&chunk_id, &embedding)?;
    }

    // 6. Update status to embedded
    {
        let conn = init_db().map_err(|e| e.to_string())?;
        conn.execute(
            "UPDATE documents SET embedding_status = 'embedded' WHERE id = ?1",
            [&document_id],
        )
        .map_err(|e| e.to_string())?;
    }
    app.emit("embedding_status", (&document_id, "embedded"))
        .map_err(|e| e.to_string())?;

    Ok(())
}
