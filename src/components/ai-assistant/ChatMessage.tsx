import { Message } from "@/lib/tauri";
import { User, Bot } from "lucide-react";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 px-4 py-3 ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
          isUser ? "bg-primary" : "bg-muted"
        }`}
      >
        {isUser ? (
          <User size={14} className="text-primary-foreground" />
        ) : (
          <Bot size={14} className="text-muted-foreground" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[75%] rounded-xl px-3 py-2 text-sm ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        }`}
      >
        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
