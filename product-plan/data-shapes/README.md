# UI Data Shapes

These types define the shape of data that UI components expect as props.
They are a frontend contract — not a database schema. How you model,
store, and fetch this data in Rust/SQLite is your implementation decision.

## Entities

- **Document** — ingested file (PDF, markdown, image, code). Used in: vault-home
- **Note** — user-created markdown note. Used in: notes-editor
- **Embedding** — vector chunk of a Document or Note. Rust-internal only.
- **SearchResult** — ranked result from hybrid search. Used in: ai-assistant
- **ChatMessage** — single turn in AI conversation. Used in: ai-assistant
- **Conversation/Thread** — named session of messages. Used in: ai-assistant
- **WatchedFolder** — auto-ingestion source folder. Used in: settings
- **Tag** — label on a Document or Note. Used in: vault-home, notes-editor
- **LLMModel** — local model available for download/activation. Used in: settings
- **Flashcard** — AI-generated Q&A from a Note. Used in: notes-editor

## Per-Section Types
- `sections/vault-home/types.ts`
- `sections/notes-editor/types.ts`
- `sections/ai-assistant/types.ts`
- `sections/settings/types.ts`
