import { useState } from "react";
import { Send, Mic, Paperclip, X } from "lucide-react";

interface ChatInputProps {
  isStreaming?: boolean;
  attachedDocument?: string | null;
  onSend?: (content: string, attachedDocId?: string) => void;
  onQuickAction?: (action: "summarize" | "explain" | "find-related") => void;
  onVoiceInput?: () => void;
  onAttachDocument?: () => void;
  onDetachDocument?: () => void;
}

const quickActions = [
  { label: "Summarize", action: "summarize" as const },
  { label: "Explain", action: "explain" as const },
  { label: "Find Related", action: "find-related" as const },
];

export function ChatInput({
  isStreaming,
  attachedDocument,
  onSend,
  onQuickAction,
  onVoiceInput,
  onAttachDocument,
  onDetachDocument,
}: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    if (!value.trim() || isStreaming) return;
    onSend?.(value.trim());
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-zinc-800 bg-zinc-950 px-4 py-3 shrink-0">
      {/* Quick action chips */}
      <div className="flex items-center gap-2 mb-3">
        {quickActions.map(({ label, action }) => (
          <button
            key={action}
            onClick={() => onQuickAction?.(action)}
            className="text-[11px] font-medium text-zinc-500 bg-zinc-900 border border-zinc-800 hover:border-indigo-500/40 hover:text-indigo-400 px-2.5 py-1 rounded-full transition-colors"
          >
            {label}
          </button>
        ))}
      </div>

      {/* Attached document */}
      {attachedDocument && (
        <div className="flex items-center gap-2 mb-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
          <Paperclip size={11} className="text-indigo-400 shrink-0" />
          <span className="text-[11px] text-indigo-400 flex-1 truncate">
            {attachedDocument}
          </span>
          <button
            onClick={onDetachDocument}
            className="text-indigo-400/60 hover:text-indigo-400"
          >
            <X size={11} />
          </button>
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end gap-2 bg-zinc-900 border border-zinc-800 focus-within:border-indigo-500/50 rounded-xl px-3 py-2.5 transition-colors">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your vault..."
          rows={1}
          className="flex-1 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 outline-none resize-none leading-relaxed max-h-32"
          style={{ height: "auto" }}
        />
        <div className="flex items-center gap-1 shrink-0 pb-0.5">
          <button
            onClick={onVoiceInput}
            title="Voice input"
            className="p-1.5 text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <Mic size={14} />
          </button>
          <button
            onClick={onAttachDocument}
            title="Attach document"
            className="p-1.5 text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <Paperclip size={14} />
          </button>
          <button
            onClick={handleSend}
            disabled={!value.trim() || isStreaming}
            className="p-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
      <p className="text-[10px] text-zinc-700 mt-1.5 text-center">
        Powered by local LLM · No data leaves your device
      </p>
    </div>
  );
}
