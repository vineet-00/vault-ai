# Milestone 4: AI Assistant

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestones 1-3 complete, embedding pipeline working

---
## About This Handoff

**What you're receiving:**
- Full chat UI with thread sidebar, streaming messages, citations
- Follow-up suggestions, quick action chips, voice input button
- Feedback buttons (thumbs up/down), regenerate, copy, insert into note
- TypeScript types for Thread, Message, Citation

**Your job:**
- Build the Rust vector search pipeline (candle-rs + usearch)
- Implement streaming LLM responses via Tauri events
- Wire source citations from search results to UI
- Connect thread persistence to SQLite

---

## Goal
Implement the AI Assistant — a thread-based chat interface grounded
in vault content, with streaming responses and source citations.

## Rust Commands to Implement
```rust
#[tauri::command] get_threads() -> Vec<Thread>
#[tauri::command] create_thread(title: String) -> Thread
#[tauri::command] get_messages(thread_id: String) -> Vec<Message>
#[tauri::command] search_vault(query: String) -> Vec<SearchResult>
#[tauri::command] send_message(thread_id: String, content: String)
// Streaming: emit events instead of returning
// app.emit("token", token) for each LLM token
// app.emit("message_complete", message) when done
```

## Streaming Implementation
```tsx
// Listen for streaming tokens
useEffect(() => {
  const unlisten = listen('token', (event) => {
    setStreamingContent(prev => prev + event.payload)
  })
  return () => { unlisten.then(f => f()) }
}, [])
```

## Components to Integrate
Copy from `product-plan/sections/ai-assistant/components/` to
`src/components/ai-assistant/` in your vault-ai project.

## Callback Wiring
| Callback | Tauri Command / Action |
|----------|----------------------|
| onSendMessage | send_message() + listen for token events |
| onNewThread | create_thread() |
| onSelectThread | get_messages() |
| onCopyResponse | navigator.clipboard.writeText() |
| onInsertIntoNote | update_note() with appended content |
| onFeedback | save_feedback() |
| onRegenerate | send_message() with same query |
| onQuickAction | pre-fill input with action prompt |

## Files to Reference
- `product-plan/sections/ai-assistant/components/` — React components
- `product-plan/sections/ai-assistant/types.ts` — TypeScript interfaces
- `product-plan/sections/ai-assistant/sample-data.json` — test data shapes

## Done When
- [ ] Threads load and persist in SQLite
- [ ] Sending a message triggers vector search + LLM
- [ ] Response streams token by token into the UI
- [ ] Source citations appear below each response
- [ ] Follow-up suggestions appear after each response
- [ ] Feedback buttons save to SQLite
- [ ] Insert into Note appends response to current note
