# Section Implementation Prompt

## Define Section Variables Before Using
- **SECTION_NAME** = e.g. "Vault Home"
- **SECTION_ID** = e.g. "vault-home"
- **NN** = e.g. "02"

---

I need you to implement the **SECTION_NAME** section of VaultAI — a
privacy-first desktop app built with Tauri v2 + React + Rust.

## Instructions

Please carefully read and analyze:

1. **product-plan/product-overview.md** — full product context and tech stack
2. **product-plan/instructions/incremental/NN-SECTION_ID.md** — specific instructions

Also review:
- **product-plan/sections/SECTION_ID/components/** — React components to integrate
- **product-plan/sections/SECTION_ID/types.ts** — TypeScript interfaces
- **product-plan/sections/SECTION_ID/sample-data.json** — data shapes

## Important Context for All Sections

This is a **Tauri v2 desktop app**. Key differences from web apps:

- Use `invoke()` from `@tauri-apps/api/core` instead of fetch/axios
- Use `@tauri-apps/plugin-dialog` for file/folder pickers
- Use `@tauri-apps/plugin-fs` for file system access
- Use Tauri events (`emit`/`listen`) for streaming and real-time updates
- No localStorage — use SQLite via Rust commands for persistence
- All Rust commands must be registered in `src-tauri/src/main.rs`

## Before You Begin

Ask me clarifying questions about:
1. Current state of the Rust backend for this section
2. Which Tauri commands already exist
3. Any existing state management setup (Zustand stores)
4. Anything unclear in the spec or component props

Once I answer, create an implementation plan before writing code.
