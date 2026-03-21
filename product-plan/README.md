# VaultAI — Design Handoff

Complete UI design package for implementing VaultAI.

## What's Included

- `product-overview.md` — always provide this with every implementation prompt
- `prompts/section-prompt.md` — copy-paste prompt for each milestone
- `instructions/incremental/` — 5 milestone instruction files
- `design-system/` — colors, fonts, tokens
- `data-shapes/` — UI data contracts
- `shell/` — app shell components
- `sections/` — all 4 section component packages

## Build Order

| Milestone | Folder | Prerequisite |
|-----------|--------|--------------|
| 01 | shell | none |
| 02 | vault-home | shell done |
| 03 | notes-editor | vault-home done |
| 04 | ai-assistant | embeddings pipeline working |
| 05 | settings | all sections done |

## How to Use

1. Copy this `product-plan/` folder into your `vault-ai/` project root
2. Open `prompts/section-prompt.md`
3. Fill in SECTION_NAME, SECTION_ID, NN at the top
4. Paste into Claude (this chat) with the milestone instruction file
5. Answer clarifying questions
6. Implement, test, move to next milestone

## Tauri-Specific Notes

- Replace all `console.log` callbacks with `invoke()` calls
- Use `@tauri-apps/plugin-dialog` for file/folder pickers
- Use Tauri events for streaming LLM responses
- All data persists in SQLite via Rust — no localStorage
