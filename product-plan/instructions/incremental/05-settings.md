# Milestone 5: Settings

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestones 1-4 complete

---
## About This Handoff

**What you're receiving:**
- VS Code-style settings layout with left nav + content panels
- Watched Folders panel with pause/resume toggles
- Local LLM model cards with download progress
- Encryption panel with key strength indicator

**Your job:**
- Wire watched folder management to notify crate file watcher
- Implement model download via HTTP with progress events
- Wire encryption toggle to ring crate AES-256-GCM
- Persist all settings in a local config file (TOML or JSON)

---

## Goal
Implement the Settings page — configuration for watched folders,
local LLM model selection, and vault encryption.

## Rust Commands to Implement
```rust
#[tauri::command] get_watched_folders() -> Vec<WatchedFolder>
#[tauri::command] add_watched_folder(path: String) -> WatchedFolder
#[tauri::command] remove_watched_folder(id: String) -> bool
#[tauri::command] toggle_folder_pause(id: String) -> WatchedFolder
#[tauri::command] get_llm_models() -> Vec<LLMModel>
#[tauri::command] download_model(model_id: String)
// Streaming: emit("download_progress", {id, progress}) events
#[tauri::command] activate_model(model_id: String) -> bool
#[tauri::command] get_encryption_settings() -> EncryptionSettings
#[tauri::command] toggle_encryption(enabled: bool) -> bool
#[tauri::command] change_encryption_key(new_key: String) -> bool
```

## Components to Integrate
Copy from `product-plan/sections/settings/components/` to
`src/components/settings/` in your vault-ai project.

## Callback Wiring
| Callback | Tauri Command |
|----------|--------------|
| onAddFolder | dialog::open(directory) then add_watched_folder() |
| onRemoveFolder | remove_watched_folder() |
| onToggleFolderPause | toggle_folder_pause() |
| onDownloadModel | download_model() + listen for progress events |
| onActivateModel | activate_model() |
| onToggleEncryption | toggle_encryption() |
| onChangeKey | open modal then change_encryption_key() |

## Files to Reference
- `product-plan/sections/settings/components/` — React components
- `product-plan/sections/settings/types.ts` — TypeScript interfaces
- `product-plan/sections/settings/sample-data.json` — test data shapes

## Done When
- [ ] Watched folders load, add, remove, and pause correctly
- [ ] File watcher triggers ingestion when new files appear
- [ ] Model cards show correct download/active states
- [ ] Download progress updates in real time
- [ ] Encryption toggle persists across app restarts
- [ ] Storage info shows real vault path and size
