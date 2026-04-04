import ReactMarkdown from "react-markdown";
import { Message } from "@/lib/tauri";
import { User, Bot } from "lucide-react";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 px-4 py-3 ${isUser ? "flex-row-reverse" : ""}`}>
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

      <div
        className={`max-w-[75%] rounded-xl px-3 py-2 text-sm ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>
        ) : (
          <div
            className="prose prose-sm prose-invert max-w-none
            [&>p]:mb-2 [&>p]:leading-relaxed
            [&>ul]:mb-2 [&>ul]:pl-4 [&>ul>li]:mb-1
            [&>ol]:mb-2 [&>ol]:pl-4 [&>ol>li]:mb-1
            [&>h1]:text-base [&>h1]:font-bold [&>h1]:mb-2
            [&>h2]:text-sm [&>h2]:font-semibold [&>h2]:mb-1.5
            [&>h3]:text-sm [&>h3]:font-semibold [&>h3]:mb-1
            [&>code]:bg-background/40 [&>code]:px-1 [&>code]:rounded [&>code]:text-xs [&>code]:font-mono
            [&>pre]:bg-background/40 [&>pre]:p-2 [&>pre]:rounded-lg [&>pre]:mb-2 [&>pre]:overflow-x-auto
            [&>pre>code]:bg-transparent [&>pre>code]:p-0
            [&>blockquote]:border-l-2 [&>blockquote]:border-muted-foreground [&>blockquote]:pl-3 [&>blockquote]:text-muted-foreground
            [&>strong]:font-semibold
          "
          >
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
