mod db;
mod models;
mod commands {
    pub mod chat;
    pub mod ingest;
    pub mod search;
    pub mod vault;
}

use commands::ingest::ingest_file;
use commands::vault::{add_tag, delete_document, get_documents, get_folders, get_tags};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            get_documents,
            get_folders,
            get_tags,
            delete_document,
            add_tag,
            ingest_file,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application")
}
