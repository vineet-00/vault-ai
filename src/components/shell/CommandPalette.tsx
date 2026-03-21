interface CommandPaletteProps {
  onClose?: () => void;
}

export const CommandPalette = ({ onClose }: CommandPaletteProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-xl bg-popover border border-border rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <span className="text-muted-foreground text-sm">⌘</span>
          <input
            autoFocus
            placeholder="Search vault, ask AI, run command..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <kbd className="text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded border border-border">
            ESC
          </kbd>
        </div>
        <div className="text-xs text-muted-foreground px-4 py-3">
          Start typing to search documents, notes, or ask the AI assistant...
        </div>
      </div>
    </div>
  );
};
