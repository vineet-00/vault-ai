use rusqlite::{Connection, Result};
use std::path::PathBuf;

pub fn get_db_path() -> PathBuf {
    let home = std::env::var("HOME").unwrap_or_else(|_| ".".to_string());
    PathBuf::from(home).join(".vaultai").join("vault.db")
}

pub fn init_db() -> Result<Connection> {
    let path = get_db_path();
    std::fs::create_dir_all(path.parent().unwrap()).ok();
    let conn = Connection::open(&path)?;

    conn.execute_batch("
        CREATE TABLE IF NOT EXISTS folders (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            parent_id TEXT
        );

        CREATE TABLE IF NOT EXISTS tags (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS documents (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            file_type TEXT NOT NULL,
            folder_id TEXT,
            path TEXT NOT NULL,
            size INTEGER,
            page_count INTEGER,
            embedding_status TEXT DEFAULT 'pending',
            summary TEXT,
            created_at TEXT,
            updated_at TEXT
        );

        CREATE TABLE IF NOT EXISTS document_tags (
            document_id TEXT NOT NULL,
            tag_id TEXT NOT NULL,
            PRIMARY KEY (document_id, tag_id)
        );
    ")?;

    Ok(conn)
}
