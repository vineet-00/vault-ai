# Milestone 2: Vault Home

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Shell) complete

---
## About This Handoff

**What you're receiving:**
- Finished UI components for the vault file browser
- TypeScript types defining Document, Folder, Tag shapes
- Sample data showing realistic vault content
- Full spec with user flows and UI requirements

**Your job:**
- Build the Rust backend commands for file ingestion and retrieval
- Set up SQLite schema for documents, folders, tags
- Wire all component callbacks to Tauri invoke() calls
- Implement drag-drop via Tauri file drop events

---

## Goal
Implement the Vault Home — the primary file browser where users ingest,
browse, and preview their documents.

## Rust Commands to Implement
```rust
#[tauri::command] get_documents() -> Vec<Document>
#[tauri::command] get_folders() -> Vec<Folder>
#[tauri::command] get_tags() -> Vec<Tag>
#[tauri::command] ingest_file(path: String) -> Document
#[tauri::command] delete_document(id: String) -> bool
#[tauri::command] add_tag(document_id: String, tag: String)
#[tauri::command] get_document_preview(id: String) -> String
```

## SQLite Schema (Rust side)
```sql
CREATE TABLE documents (
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
CREATE TABLE folders (id TEXT PRIMARY KEY, name TEXT, parent_id TEXT);
CREATE TABLE tags (id TEXT PRIMARY KEY, name TEXT);
CREATE TABLE document_tags (document_id TEXT, tag_id TEXT);
```

## Components to Integrate
Copy from `product-plan/sections/vault-home/components/` to
`src/components/vault-home/` in your vault-ai project.

## Callback Wiring
| Callback | Tauri Command |
|----------|--------------|
| onDropFiles | ingest_file() for each file |
| onUpload | dialog::open() then ingest_file() |
| onSelectDocument | get_document_preview() |
| onDelete | delete_document() |
| onAddTags | add_tag() |
| onAskAI | open AI panel with document context |
| onGenerateSummary | generate_summary() |

## Files to Reference
- `product-plan/sections/vault-home/components/` — React components
- `product-plan/sections/vault-home/types.ts` — TypeScript interfaces
- `product-plan/sections/vault-home/sample-data.json` — test data shapes

## Done When
- [ ] Documents list loads from SQLite via Rust
- [ ] Drag and drop ingests files and shows embedding status
- [ ] Folder tree filters document list
- [ ] Clicking document shows preview in right panel
- [ ] All hover actions work (Ask AI, Summary, Tags, Delete, Copy Path)
- [ ] Empty state shows on first launch
