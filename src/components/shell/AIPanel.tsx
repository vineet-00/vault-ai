interface AIPanelProps {
  onClose?: () => void;
}

export const AIPanel = ({ onClose }: AIPanelProps) => {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="
        fixed right-0 top-0 h-full w-[420px] z-50
        bg-popover border-l border-border
        shadow-2xl flex flex-col
      "
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-sm font-medium text-foreground">
            AI Assistant
          </span>
          <button
            onClick={onClose}
            className="text-xs text-muted-foreground hover:text-foreground font-mono bg-muted hover:bg-accent px-1.5 py-0.5 rounded border border-border transition-colors"
          >
            ESC
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-sm text-muted-foreground">
            Ask anything about your vault...
          </p>
        </div>
        <div className="border-t border-border p-3">
          <input
            autoFocus
            placeholder="Ask about your documents..."
            className="
              w-full bg-input text-sm text-foreground
              placeholder:text-muted-foreground rounded-lg px-3 py-2
              outline-none focus:ring-2 focus:ring-ring
              border border-border
            "
          />
        </div>
      </div>
    </>
  );
};
