import { useRef, useEffect } from "react";
import { ThreadSidebar } from "./ThreadSidebar";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ChatEmptyState } from "./ChatEmptyState";
import type { AIAssistantProps } from "@/../product/sections/ai-assistant/types";

export function AIAssistant({
  threads,
  messages,
  selectedThread: selectedThreadId,
  isStreaming,
  onSelectThread,
  onNewThread,
  onSendMessage,
  onFollowUp,
  onQuickAction,
  onCopyResponse,
  onInsertIntoNote,
  onFeedback,
  onRegenerate,
  onVoiceInput,
  onAttachDocument,
}: AIAssistantProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  const threadMessages = messages.filter(
    (m) => m.threadId === selectedThreadId,
  );

  const selectedThreadData = threads.find((t) => t.id === selectedThreadId);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-full bg-zinc-950 overflow-hidden">
      {/* Thread Sidebar */}
      <div className="w-[260px] shrink-0">
        <ThreadSidebar
          threads={threads}
          selectedThreadId={selectedThreadId}
          onSelectThread={onSelectThread}
          onNewThread={onNewThread}
        />
      </div>

      {/* Chat Area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Thread header */}
        {selectedThreadData && (
          <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800 shrink-0">
            <div>
              <h2 className="text-sm font-semibold text-zinc-100">
                {selectedThreadData.title}
              </h2>
              <p className="text-[11px] text-zinc-600">
                {selectedThreadData.topic} · {selectedThreadData.messageCount}{" "}
                messages
              </p>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-4">
          {threadMessages.length === 0 ? (
            <ChatEmptyState onExampleQuery={(q) => onSendMessage?.(q)} />
          ) : (
            <>
              {threadMessages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  onCopy={() => onCopyResponse?.(message.id)}
                  onInsertIntoNote={() => onInsertIntoNote?.(message.id)}
                  onFeedback={(f) => onFeedback?.(message.id, f)}
                  onRegenerate={() => onRegenerate?.(message.id)}
                  onFollowUp={onFollowUp}
                />
              ))}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* Input */}
        <ChatInput
          isStreaming={isStreaming}
          onSend={onSendMessage}
          onQuickAction={onQuickAction}
          onVoiceInput={onVoiceInput}
          onAttachDocument={onAttachDocument}
        />
      </div>
    </div>
  );
}
