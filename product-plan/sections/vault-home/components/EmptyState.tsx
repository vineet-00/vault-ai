import { Upload, StickyNote, FolderOpen } from "lucide-react";

interface EmptyStateProps {
  onUpload?: () => void;
  onCreateNote?: () => void;
  onWatchFolder?: () => void;
}

export function EmptyState({
  onUpload,
  onCreateNote,
  onWatchFolder,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-8">
      <div className="text-center space-y-2">
        <h2 className="text-lg font-semibold text-zinc-100">
          Your vault is empty
        </h2>
        <p className="text-sm text-zinc-500 max-w-xs">
          Add documents, notes, or watch a folder to start building your
          personal knowledge base.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full max-w-lg">
        <ActionCard
          icon={<Upload size={20} className="text-indigo-400" />}
          title="Upload Document"
          description="PDF, markdown, images or code files"
          shortcut="⌘U"
          onClick={onUpload}
        />
        <ActionCard
          icon={<StickyNote size={20} className="text-blue-400" />}
          title="Create Note"
          description="Write a new markdown note"
          shortcut="⌘N"
          onClick={onCreateNote}
        />
        <ActionCard
          icon={<FolderOpen size={20} className="text-emerald-400" />}
          title="Watch Folder"
          description="Auto-ingest files from a folder"
          onClick={onWatchFolder}
        />
      </div>

      <p className="text-xs text-zinc-700">
        You can also drag and drop files anywhere on this screen
      </p>
    </div>
  );
}

function ActionCard({
  icon,
  title,
  description,
  shortcut,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  shortcut?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="
        flex flex-col items-start gap-3 p-4 rounded-xl
        bg-zinc-900 border border-zinc-800
        hover:border-zinc-600 hover:bg-zinc-800/80
        transition-all duration-150 text-left group
      "
    >
      <div className="p-2 rounded-lg bg-zinc-800 group-hover:bg-zinc-700 transition-colors">
        {icon}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-zinc-200">{title}</p>
          {shortcut && (
            <kbd className="text-[10px] font-mono text-zinc-600 bg-zinc-800 px-1 py-0.5 rounded">
              {shortcut}
            </kbd>
          )}
        </div>
        <p className="text-[11px] text-zinc-600 mt-0.5 leading-relaxed">
          {description}
        </p>
      </div>
    </button>
  );
}
