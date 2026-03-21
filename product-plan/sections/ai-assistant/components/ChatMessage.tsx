import { useState } from "react";
import {
  Copy,
  FileText,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  NotebookPen,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { Message } from "@/../product/sections/ai-assistant/types";

interface ChatMessageProps {
  message: Message;
  onCopy?: () => void;
  onInsertIntoNote?: () => void;
  onFeedback?: (feedback: "up" | "down") => void;
  onRegenerate?: () => void;
  onFollowUp?: (question: string) => void;
}

export function ChatMessage({
  message,
  onCopy,
  onInsertIntoNote,
  onFeedback,
  onRegenerate,
  onFollowUp,
}: ChatMessageProps) {
  const [citationsOpen, setCitationsOpen] = useState(false);
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end mb-4 px-4">
        <div className="max-w-[75%]">
          {message.attachedDocument && (
            <div className="flex items-center gap-1.5 mb-1.5 justify-end">
              <FileText size={11} className="text-indigo-400" />
              <span className="text-[11px] text-indigo-400">
                {message.attachedDocument}
              </span>
            </div>
          )}
          <div className="bg-indigo-600 text-white text-sm rounded-2xl rounded-tr-sm px-4 py-2.5 leading-relaxed">
            {message.content}
          </div>
          <p className="text-[10px] text-zinc-700 mt-1 text-right font-mono">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 px-4">
      {/* AI Response bubble */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl rounded-tl-sm overflow-hidden">
        {/* Streaming indicator */}
        {message.isStreaming && (
          <div className="flex items-center gap-2 px-4 py-2 border-b border-zinc-800">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <span className="text-[11px] text-zinc-600">Thinking...</span>
          </div>
        )}

        {/* Content */}
        <div className="px-4 py-3">
          {/* Confidence badge */}
          {message.confidence !== undefined && (
            <div className="flex items-center gap-1.5 mb-2">
              <div
                className={`
                text-[10px] font-semibold px-1.5 py-0.5 rounded-full
                ${
                  message.confidence >= 90
                    ? "bg-emerald-500/10 text-emerald-500"
                    : message.confidence >= 70
                      ? "bg-amber-500/10 text-amber-500"
                      : "bg-red-500/10 text-red-500"
                }
              `}
              >
                {message.confidence}% confidence
              </div>
            </div>
          )}

          {/* Markdown content */}
          <div className="text-sm text-zinc-300 leading-relaxed">
            <pre className="whitespace-pre-wrap font-sans text-sm text-zinc-300 leading-relaxed bg-transparent p-0 m-0">
              {message.content}
            </pre>
          </div>
        </div>

        {/* Citations */}
        {message.citations && message.citations.length > 0 && (
          <div className="border-t border-zinc-800">
            <button
              onClick={() => setCitationsOpen(!citationsOpen)}
              className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-zinc-800/50 transition-colors"
            >
              <FileText size={11} className="text-zinc-600" />
              <span className="text-[11px] text-zinc-600 flex-1">
                {message.citations.length} source
                {message.citations.length > 1 ? "s" : ""}
              </span>
              {citationsOpen ? (
                <ChevronUp size={11} className="text-zinc-600" />
              ) : (
                <ChevronDown size={11} className="text-zinc-600" />
              )}
            </button>
            {citationsOpen && (
              <div className="px-4 pb-3 space-y-2">
                {message.citations.map((citation) => (
                  <div
                    key={citation.id}
                    className="bg-zinc-800/60 border border-zinc-700 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <FileText size={11} className="text-red-400 shrink-0" />
                      <span className="text-[11px] font-medium text-zinc-300">
                        {citation.documentTitle}
                      </span>
                      {citation.page && (
                        <span className="text-[10px] text-zinc-600 font-mono ml-auto">
                          p.{citation.page}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-relaxed italic">
                      "{citation.excerpt}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action bar */}
        <div className="flex items-center gap-1 px-3 py-2 border-t border-zinc-800">
          <ActionBtn icon={<Copy size={12} />} label="Copy" onClick={onCopy} />
          <ActionBtn
            icon={<NotebookPen size={12} />}
            label="Insert into Note"
            onClick={onInsertIntoNote}
          />
          <div className="flex-1" />
          <ActionBtn
            icon={<ThumbsUp size={12} />}
            label="Good response"
            onClick={() => onFeedback?.("up")}
            active={message.feedback === "up"}
            activeColor="text-emerald-500"
          />
          <ActionBtn
            icon={<ThumbsDown size={12} />}
            label="Bad response"
            onClick={() => onFeedback?.("down")}
            active={message.feedback === "down"}
            activeColor="text-red-500"
          />
          <ActionBtn
            icon={<RefreshCw size={12} />}
            label="Regenerate"
            onClick={onRegenerate}
          />
        </div>
      </div>

      {/* Follow-up suggestions */}
      {message.followUps && message.followUps.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {message.followUps.map((q, i) => (
            <button
              key={i}
              onClick={() => onFollowUp?.(q)}
              className="text-[11px] text-zinc-400 bg-zinc-900 border border-zinc-800 hover:border-indigo-500/50 hover:text-indigo-400 px-3 py-1.5 rounded-full transition-colors text-left"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <p className="text-[10px] text-zinc-700 mt-2 font-mono">
        {new Date(message.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
}

function ActionBtn({
  icon,
  label,
  onClick,
  active = false,
  activeColor = "text-indigo-400",
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
  activeColor?: string;
}) {
  return (
    <button
      title={label}
      onClick={onClick}
      className={`
        p-1.5 rounded-md transition-colors text-xs
        ${
          active
            ? `${activeColor} bg-zinc-800`
            : "text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800"
        }
      `}
    >
      {icon}
    </button>
  );
}
