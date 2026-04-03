import { useState } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim() || disabled) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <div className="border-t border-border p-3">
      <div className="flex items-end gap-2 bg-muted rounded-xl px-3 py-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask anything about your vault..."
          rows={1}
          disabled={disabled}
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none"
        />
        <button
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          className="p-1.5 rounded-lg bg-primary text-primary-foreground disabled:opacity-40 transition-opacity shrink-0"
        >
          <Send size={14} />
        </button>
      </div>
      <p className="text-[10px] text-muted-foreground mt-1.5 px-1">
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
};

export default ChatInput;
