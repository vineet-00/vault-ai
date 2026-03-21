interface AIPanelProps {
  onClose?: () => void;
}

export function AIPanel({ onClose }: AIPanelProps) {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Panel */}
      <div
        className="
        fixed right-0 top-0 h-full w-[420px] z-50
        bg-zinc-900 border-l border-zinc-800
        shadow-2xl flex flex-col
        animate-in slide-in-from-right duration-200
      "
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
          <span className="text-sm font-medium text-zinc-100">
            AI Assistant
          </span>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 text-xs font-mono bg-zinc-800 px-1.5 py-0.5 rounded"
          >
            ESC
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-sm text-zinc-500">
            Ask anything about your vault...
          </p>
        </div>
        <div className="border-t border-zinc-800 p-3">
          <input
            autoFocus
            placeholder="Ask about your documents..."
            className="w-full bg-zinc-800 text-sm text-zinc-100 placeholder:text-zinc-600 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>
    </>
  );
}
