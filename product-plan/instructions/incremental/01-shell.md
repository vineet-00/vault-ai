# Milestone 1: Shell

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** None

---
## About This Handoff

**What you're receiving:**
- Finished shell components (AppShell, MainNav, CommandPalette, AIPanel)
- Design token definitions (colors, typography)
- Navigation structure for all 4 sections

**Your job:**
- Set up Tailwind v4 design tokens in index.css
- Integrate shell components with react-router-dom routing
- Wire keyboard shortcuts (⌘K command palette, ⌘J AI panel)
- Configure Tauri window (no custom titlebar needed)

---

## Goal
Set up the design tokens and application shell — the persistent navigation
chrome that wraps all sections of VaultAI.

## What to Implement

### 1. Design Tokens
Your `src/index.css` already has the shadcn Nova preset. Ensure these
are present in the `:root` and `.dark` blocks:
- See `product-plan/design-system/tokens.css` for the token reference
- Primary: indigo, Secondary: slate, Neutral: zinc
- Font: Geist Variable (already installed via @fontsource-variable/geist)

### 2. Routing Setup
```bash
bun add react-router-dom
```
Create routes for: `/vault`, `/documents`, `/notes`,
`/assistant`, `/timeline`, `/settings`

### 3. Application Shell
Copy shell components from `product-plan/shell/components/` to
`src/components/shell/` in your vault-ai project.

**Wire up navigation:**
- Vault Home → `/vault`
- Documents → `/documents`
- Notes → `/notes`
- AI Assistant → `/assistant`
- Timeline → `/timeline`
- Settings → `/settings`

**Wire keyboard shortcuts:**
```tsx
// In App.tsx
useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      setCommandOpen(true)
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'j') {
      e.preventDefault()
      setAIPanelOpen(true)
    }
  }
  window.addEventListener('keydown', handler)
  return () => window.removeEventListener('keydown', handler)
}, [])
```

### 4. Tauri Window Config
In `src-tauri/tauri.conf.json` set:
```json
{
  "windows": [{
    "title": "VaultAI",
    "width": 1280,
    "height": 800,
    "minWidth": 900,
    "minHeight": 600,
    "decorations": true
  }]
}
```

## Files to Reference
- `product-plan/design-system/` — tokens, colors, fonts
- `product-plan/shell/components/` — shell React components
- `product-plan/product-overview.md` — full context

## Done When
- [ ] App opens with sidebar visible
- [ ] All 6 nav items navigate to correct routes
- [ ] ⌘K opens command palette overlay
- [ ] ⌘J opens AI panel from the right
- [ ] Sidebar expands on hover to show labels
- [ ] Dark mode applied globally
