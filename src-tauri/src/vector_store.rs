use crate::db::init_db;
use usearch::{Index, IndexOptions, MetricKind, ScalarKind};
use std::path::PathBuf;

fn get_index_path() -> PathBuf {
    let home = std::env::var("HOME").unwrap_or_else(|_| ".".to_string());
    PathBuf::from(home).join(".vaultai").join("vectors.usearch")
}

fn create_index() -> Result<Index, String> {
    let options = IndexOptions {
        dimensions: 384,
        metric: MetricKind::Cos,
        quantization: ScalarKind::F32,
        ..Default::default()
    };
    Index::new(&options).map_err(|e| e.to_string())
}

pub fn add_embedding(chunk_id: &str, embedding: &[f32]) -> Result<(), String> {
    let path = get_index_path();
    let mut index = create_index()?;

    if path.exists() {
        index.load(path.to_str().unwrap()).map_err(|e| e.to_string())?;
    }

    let key = hash_id(chunk_id);

    // Store hash → chunk_id mapping in SQLite
    let conn = init_db().map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT OR REPLACE INTO chunk_keys (hash_key, chunk_id) VALUES (?1, ?2)",
        rusqlite::params![key as i64, chunk_id],
    )
    .map_err(|e| e.to_string())?;

    index.reserve(index.size() + 1).map_err(|e| e.to_string())?;
    index.add(key, embedding).map_err(|e| e.to_string())?;
    index.save(path.to_str().unwrap()).map_err(|e| e.to_string())?;

    Ok(())
}

pub fn search(embedding: &[f32], count: usize) -> Result<Vec<String>, String> {
    let path = get_index_path();
    if !path.exists() {
        return Ok(vec![]);
    }

    let mut index = create_index()?;
    index.load(path.to_str().unwrap()).map_err(|e| e.to_string())?;

    let results = index.search(embedding, count).map_err(|e| e.to_string())?;

    // Resolve hash keys back to chunk IDs via SQLite
    let conn = init_db().map_err(|e| e.to_string())?;
    let mut chunk_ids = Vec::new();

    for key in &results.keys {
        let chunk_id: Result<String, _> = conn.query_row(
            "SELECT chunk_id FROM chunk_keys WHERE hash_key = ?1",
            rusqlite::params![*key as i64],
            |row| row.get(0),
        );
        if let Ok(id) = chunk_id {
            chunk_ids.push(id);
        }
    }

    Ok(chunk_ids)
}

fn hash_id(id: &str) -> u64 {
    use std::collections::hash_map::DefaultHasher;
    use std::hash::{Hash, Hasher};
    let mut hasher = DefaultHasher::new();
    id.hash(&mut hasher);
    hasher.finish()
}
