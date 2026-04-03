import { Plus, MessageSquare, Trash2 } from "lucide-react";
import { Thread } from "@/lib/tauri";

interface ThreadSidebarProps {
  threads: Thread[];
  selectedThreadId: string | null;
  onSelectThread: (thread: Thread) => void;
  onNewThread: () => void;
  onDeleteThread: (id: string) => void;
}

export const ThreadSidebar = ({
  threads,
  selectedThreadId,
  onSelectThread,
  onNewThread,
  onDeleteThread,
}: ThreadSidebarProps) => {
  return (
    <div className="h-full flex flex-col border-r border-border">
      <div className="px-3 py-2 border-b border-border flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Chats</span>
        <button
          onClick={onNewThread}
          className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        {threads.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center mt-8">
            No chats yet
          </p>
        ) : (
          threads.map((thread) => (
            <div
              key={thread.id}
              className={`group flex items-center justify-between px-3 py-2 transition-colors ${
                selectedThreadId === thread.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent text-muted-foreground"
              }`}
            >
              <button
                onClick={() => onSelectThread(thread)}
                className="flex items-center gap-2 flex-1 min-w-0 text-left"
              >
                <MessageSquare size={13} className="shrink-0" />
                <span className="text-xs truncate">{thread.title}</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteThread(thread.id);
                }}
                className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-destructive/20 hover:text-destructive transition-all shrink-0"
              >
                <Trash2 size={11} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ThreadSidebar;
