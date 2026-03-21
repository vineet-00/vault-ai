import { Plus, MessageSquare, FileText } from "lucide-react";
import type { Thread } from "@/../product/sections/ai-assistant/types";

interface ThreadSidebarProps {
  threads: Thread[];
  selectedThreadId?: string | null;
  onSelectThread?: (id: string) => void;
  onNewThread?: () => void;
}

export function ThreadSidebar({
  threads,
  selectedThreadId,
  onSelectThread,
  onNewThread,
}: ThreadSidebarProps) {
  const grouped = threads.reduce<Record<string, Thread[]>>((acc, thread) => {
    const key = thread.documentId ? "By Document" : "General";
    if (!acc[key]) acc[key] = [];
    acc[key].push(thread);
    return acc;
  }, {});

  return (
    <div className="h-full flex flex-col border-r border-zinc-800 bg-zinc-900">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-zinc-800 shrink-0">
        <span className="text-xs font-semibold text-zinc-400">Threads</span>
        <button
          onClick={onNewThread}
          title="New Thread"
          className="p-1 rounded-md text-zinc-600 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Thread groups */}
      <div className="flex-1 overflow-y-auto py-2">
        {Object.entries(grouped).map(([group, groupThreads]) => (
          <div key={group} className="mb-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 px-3 mb-1">
              {group}
            </p>
            {groupThreads.map((thread) => (
              <button
                key={thread.id}
                onClick={() => onSelectThread?.(thread.id)}
                className={`
                  w-full text-left px-3 py-2.5 border-b border-zinc-800/40
                  transition-colors group
                  ${
                    selectedThreadId === thread.id
                      ? "bg-zinc-800 border-l-2 border-l-indigo-500"
                      : "hover:bg-zinc-800/60"
                  }
                `}
              >
                <div className="flex items-start gap-2">
                  {thread.documentId ? (
                    <FileText
                      size={12}
                      className="text-red-400 shrink-0 mt-0.5"
                    />
                  ) : (
                    <MessageSquare
                      size={12}
                      className="text-indigo-400 shrink-0 mt-0.5"
                    />
                  )}
                  <div className="min-w-0">
                    <p
                      className={`
                      text-xs font-medium truncate
                      ${
                        selectedThreadId === thread.id
                          ? "text-zinc-100"
                          : "text-zinc-300"
                      }
                    `}
                    >
                      {thread.title}
                    </p>
                    <p className="text-[11px] text-zinc-600 truncate mt-0.5">
                      {thread.lastMessage}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-zinc-700 font-mono">
                        {thread.updatedAt}
                      </span>
                      <span className="text-[10px] text-zinc-700">
                        {thread.messageCount} msgs
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
