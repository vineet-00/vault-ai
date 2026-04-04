use crate::db::init_db;
use crate::embeddings::embed_text;
use crate::vector_store::search;

pub fn get_relevant_context(query: &str, limit: usize) -> Result<String, String> {
    // 1. Embed the query
    let query_embedding = embed_text(query)?;

    // 2. Search vector store — returns chunk_ids
    let chunk_ids = search(&query_embedding, limit)?;
    println!("RAG: found {} chunks for query: {}", chunk_ids.len(), query);
    if chunk_ids.is_empty() {
        return Ok(String::new());
    }

    // 3. Fetch chunk text from SQLite
    let conn = init_db().map_err(|e| e.to_string())?;
    let mut context_parts = Vec::new();

    for chunk_id in &chunk_ids {
        let result: Result<(String, String), _> = conn.query_row(
            "SELECT c.content, d.title FROM chunks c
             JOIN documents d ON c.document_id = d.id
             WHERE c.id = ?1",
            [chunk_id],
            |row| Ok((row.get(0)?, row.get(1)?)),
        );

        if let Ok((content, title)) = result {
            context_parts.push(format!("From '{title}':\n{content}"));
        }
    }

    Ok(context_parts.join("\n\n---\n\n"))
}
