# Milestone 3: Notes Editor

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestones 1-2 complete

---
## About This Handoff

**What you're receiving:**
- Full split markdown editor with live preview
- AI insights panel with flashcards, key insights, related docs
- Auto-save indicator wired via props
- Shared FolderTree component from Vault Home

**Your job:**
- Build Rust commands for note CRUD operations
- Implement auto-save debounce (save 1s after typing stops)
- Wire AI insight generation to local LLM pipeline
- Store notes in SQLite alongside documents

---

## Goal
Implement the Notes Editor — a split markdown editor with AI-powered
insights, flashcards, and related document suggestions.

## Rust Commands to Implement
```rust
#[tauri::command] get_notes() -> Vec<Note>
#[tauri::command] create_note() -> Note
#[tauri::command] update_note(id: String, title: String, content: String)
#[tauri::command] delete_note(id: String) -> bool
#[tauri::command] generate_insights(note_id: String) -> AIGenerated
```

## Auto-save Implementation
```tsx
// Debounce content changes
useEffect(() => {
  const timer = setTimeout(() => {
    invoke('update_note', { id, title, content })
  }, 1000)
  return () => clearTimeout(timer)
}, [content])
```

## Components to Integrate
Copy from `product-plan/sections/notes-editor/components/` to
`src/components/notes-editor/` in your vault-ai project.

Note: `NotesEditor` imports `FolderTree` from vault-home components.
Make sure that import path is updated to match your project structure.

## Callback Wiring
| Callback | Tauri Command |
|----------|--------------|
| onCreateNote | create_note() |
| onUpdateContent | update_note() (debounced) |
| onUpdateTitle | update_note() (debounced) |
| onDeleteNote | delete_note() |
| onGenerateInsights | generate_insights() |
| onOpenRelatedDocument | navigate to vault-home with doc selected |

## Files to Reference
- `product-plan/sections/notes-editor/components/` — React components
- `product-plan/sections/notes-editor/types.ts` — TypeScript interfaces
- `product-plan/sections/notes-editor/sample-data.json` — test data shapes

## Done When
- [ ] Notes list loads from SQLite
- [ ] Creating a note opens it in the editor immediately
- [ ] Typing in editor updates live preview
- [ ] Auto-save triggers after 1s of inactivity, shows "Saved ✓"
- [ ] AI insights panel generates and displays correctly
- [ ] Flashcards flip on click
- [ ] Related documents link back to Vault Home
