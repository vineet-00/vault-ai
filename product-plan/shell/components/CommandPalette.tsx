interface CommandPaletteProps {
  onClose?: () => void;
}

export function CommandPalette({ onClose }: CommandPaletteProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Palette */}
      <div
        className="relative w-full max-w-xl bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
          <span className="text-zinc-500 text-sm">⌘</span>
          <input
            autoFocus
            placeholder="Search vault, ask AI, run command..."
            className="flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-600 outline-none"
          />
          <kbd className="text-xs text-zinc-600 font-mono bg-zinc-800 px-1.5 py-0.5 rounded">
            ESC
          </kbd>
        </div>
        <div className="py-2 px-2 text-xs text-zinc-600 px-4 py-3">
          Start typing to search documents, notes, or ask the AI assistant...
        </div>
      </div>
    </div>
  );
}
