use crate::db::init_db;
use crate::models::{Message, Thread};
use chrono::Utc;
use serde::{Deserialize, Serialize};
use tauri::AppHandle;
use uuid::Uuid;
use tauri::Emitter;
use crate::commands::search::get_relevant_context;

// ── Ollama API shapes ────────────────────────────────────────────────────────

#[derive(Serialize)]
struct OllamaRequest {
    model: String,
    messages: Vec<OllamaMessage>,
    stream: bool,
}

#[derive(Serialize, Deserialize, Clone)]
struct OllamaMessage {
    role: String,
    content: String,
}

#[derive(Deserialize)]
struct OllamaStreamChunk {
    message: Option<OllamaMessage>,
    done: bool,
}

// ── Thread commands ──────────────────────────────────────────────────────────

#[tauri::command]
pub fn get_threads() -> Result<Vec<Thread>, String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare(
            "SELECT id, title, created_at, updated_at
             FROM threads ORDER BY updated_at DESC",
        )
        .map_err(|e| e.to_string())?;

    let threads = stmt
        .query_map([], |row| {
            Ok(Thread {
                id: row.get(0)?,
                title: row.get(1)?,
                created_at: row.get(2)?,
                updated_at: row.get(3)?,
            })
        })
        .map_err(|e| e.to_string())?
        .filter_map(|r| r.ok())
        .collect();

    Ok(threads)
}

#[tauri::command]
pub fn create_thread(title: String) -> Result<Thread, String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    let id = Uuid::new_v4().to_string();
    let now = Utc::now().to_rfc3339();

    conn.execute(
        "INSERT INTO threads (id, title, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?3)",
        rusqlite::params![&id, &title, &now],
    )
    .map_err(|e| e.to_string())?;

    Ok(Thread {
        id,
        title,
        created_at: Some(now.clone()),
        updated_at: Some(now),
    })
}

#[tauri::command]
pub fn get_messages(thread_id: String) -> Result<Vec<Message>, String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare(
            "SELECT id, thread_id, role, content, created_at
             FROM messages WHERE thread_id = ?1 ORDER BY created_at ASC",
        )
        .map_err(|e| e.to_string())?;

    let messages = stmt
        .query_map([&thread_id], |row| {
            Ok(Message {
                id: row.get(0)?,
                thread_id: row.get(1)?,
                role: row.get(2)?,
                content: row.get(3)?,
                created_at: row.get(4)?,
            })
        })
        .map_err(|e| e.to_string())?
        .filter_map(|r| r.ok())
        .collect();

    Ok(messages)
}

// ── Chat command (streams tokens via Tauri events) ───────────────────────────

#[tauri::command]
pub async fn send_message(
    thread_id: String,
    content: String,
    app: AppHandle,
) -> Result<(), String> {
    let now = Utc::now().to_rfc3339();

    // 1. Save user message to SQLite
    {
        let conn = init_db().map_err(|e| e.to_string())?;
        let msg_id = Uuid::new_v4().to_string();
        conn.execute(
            "INSERT INTO messages (id, thread_id, role, content, created_at)
             VALUES (?1, ?2, 'user', ?3, ?4)",
            rusqlite::params![&msg_id, &thread_id, &content, &now],
        )
        .map_err(|e| e.to_string())?;

        conn.execute(
            "UPDATE threads SET updated_at = ?1 WHERE id = ?2",
            rusqlite::params![&now, &thread_id],
        )
        .map_err(|e| e.to_string())?;
    }

    // 2. Fetch message history for context
    let history = {
        let conn = init_db().map_err(|e| e.to_string())?;
        let mut stmt = conn
            .prepare(
                "SELECT role, content FROM messages
                 WHERE thread_id = ?1 ORDER BY created_at ASC",
            )
            .map_err(|e| e.to_string())?;

        let result: Vec<OllamaMessage> = stmt
            .query_map([&thread_id], |row| {
                Ok(OllamaMessage {
                    role: row.get(0)?,
                    content: row.get(1)?,
                })
            })
            .map_err(|e| e.to_string())?
            .filter_map(|r| r.ok())
            .collect();

        result
    };

    // 3. Get relevant context from vault via RAG
    let context = get_relevant_context(&content, 3).unwrap_or_default();

    // 4. Build messages — inject system prompt with context if available
    let mut messages_with_context = history.clone();
    if !context.is_empty() {
        let system_msg = OllamaMessage {
            role: "system".to_string(),
            content: format!(
                "You are VaultAI, a personal knowledge assistant. \
                 Answer using ONLY the context below. \
                 Format your response clearly using markdown: \
                 use bullet points for lists, **bold** for key terms, \
                 headers for sections, and code blocks for code. \
                 Keep responses concise and well-structured. \
                 If the answer is not in the context, say 'I could not find this in your vault.'\n\n\
                 CONTEXT:\n{context}"
            ),
        };
        messages_with_context.insert(0, system_msg);
    } else {
        let system_msg = OllamaMessage {
            role: "system".to_string(),
            content: "You are VaultAI, a personal knowledge assistant. \
                      Format responses using markdown: bullet points, **bold** for key terms, \
                      headers for sections. Keep responses concise and well-structured."
                .to_string(),
        };
        messages_with_context.insert(0, system_msg);
    }

    // 5. Call Ollama with streaming
    let client = reqwest::Client::new();
    let request_body = OllamaRequest {
        model: "llama3.2".to_string(),
        messages: messages_with_context,
        stream: true,
    };

    let mut response = client
        .post("http://127.0.0.1:11434/api/chat")
        .json(&request_body)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    // 6. Stream tokens to frontend
    let mut full_response = String::new();
    let mut done = false;

    while let Some(chunk) = response.chunk().await.map_err(|e| e.to_string())? {
        if done {
            break;
        }
        let text = String::from_utf8_lossy(&chunk);
        for line in text.lines() {
            if line.is_empty() || done {
                continue;
            }
            if let Ok(parsed) = serde_json::from_str::<OllamaStreamChunk>(line) {
                if let Some(msg) = &parsed.message {
                    full_response.push_str(&msg.content);
                    app.emit("token", &msg.content).map_err(|e| e.to_string())?;
                }
                if parsed.done {
                    done = true;

                    // Save assistant response to SQLite
                    let conn = init_db().map_err(|e| e.to_string())?;
                    let msg_id = Uuid::new_v4().to_string();
                    let now = Utc::now().to_rfc3339();
                    conn.execute(
                        "INSERT INTO messages (id, thread_id, role, content, created_at)
                         VALUES (?1, ?2, 'assistant', ?3, ?4)",
                        rusqlite::params![&msg_id, &thread_id, &full_response, &now],
                    )
                    .map_err(|e| e.to_string())?;

                    app.emit("message_complete", &full_response)
                        .map_err(|e| e.to_string())?;
                    break;
                }
            }
        }
    }

    Ok(())
}

#[tauri::command]
pub fn delete_thread(id: String) -> Result<bool, String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM messages WHERE thread_id = ?1", [&id])
        .map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM threads WHERE id = ?1", [&id])
        .map_err(|e| e.to_string())?;
    Ok(true)
}

#[tauri::command]
pub fn rename_thread(id: String, title: String) -> Result<(), String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE threads SET title = ?1 WHERE id = ?2",
        rusqlite::params![&title, &id],
    )
    .map_err(|e| e.to_string())?;
    Ok(())
}
