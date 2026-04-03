mod db;
mod models;
mod commands {
    pub mod ingest;
    pub mod notes;
    pub mod search;
    pub mod vault;
    pub mod chat;
    pub mod settings;
}

use commands::ingest::ingest_file;
use commands::notes::{create_note, delete_note, get_notes, update_note};
use commands::vault::{add_tag, delete_document, get_documents, get_folders, get_tags};
use commands::chat::{create_thread, delete_thread, get_messages, get_threads, send_message, rename_thread};
use commands::settings::{add_watched_folder, get_ollama_models, get_watched_folders, remove_watched_folder, toggle_folder_pause};

async fn ensure_ollama_running() {
    let client = reqwest::Client::new();
    if client
        .get("http://127.0.0.1:11434")
        .send()
        .await
        .is_ok()
    {
        return;
    }

    // Try full path first, fall back to PATH
    let ollama_path = which::which("ollama")
        .unwrap_or_else(|_| std::path::PathBuf::from("/usr/local/bin/ollama"));

    tokio::process::Command::new(ollama_path)
        .arg("serve")
        .stdout(std::process::Stdio::null())
        .stderr(std::process::Stdio::null())
        .spawn()
        .ok();

    tokio::time::sleep(tokio::time::Duration::from_secs(3)).await;
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|_app| {
            tauri::async_runtime::spawn(async move {
                ensure_ollama_running().await;
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_documents,
            get_folders,
            get_tags,
            delete_document,
            add_tag,
            ingest_file,
            get_notes,
            create_note,
            update_note,
            delete_note,
            get_threads,
            create_thread,
            delete_thread,
            get_messages,
            send_message,
            rename_thread,
            get_watched_folders,
            add_watched_folder,
            remove_watched_folder,
            toggle_folder_pause,
            get_ollama_models,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application")
}
