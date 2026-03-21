import { ChevronRight, Folder, Hash } from "lucide-react";

interface FolderItem {
  id: string;
  name: string;
  documentCount: number;
  expanded: boolean;
}

interface TagItem {
  id: string;
  name: string;
  documentCount: number;
}

interface FolderTreeProps {
  folders: FolderItem[];
  tags: TagItem[];
  selectedFolderId?: string | null;
  selectedTagId?: string | null;
  onSelectFolder?: (id: string | null) => void;
  onSelectTag?: (id: string | null) => void;
}

export function FolderTree({
  folders,
  tags,
  selectedFolderId,
  selectedTagId,
  onSelectFolder,
  onSelectTag,
}: FolderTreeProps) {
  return (
    <div className="h-full flex flex-col text-sm overflow-y-auto py-3">
      {/* All Documents */}
      <button
        onClick={() => {
          onSelectFolder?.(null);
          onSelectTag?.(null);
        }}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-md mx-2 mb-1
          transition-colors text-left
          ${
            !selectedFolderId && !selectedTagId
              ? "bg-indigo-600 text-white"
              : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
          }
        `}
      >
        <Folder size={14} className="shrink-0" />
        <span className="flex-1 truncate">All Documents</span>
      </button>

      {/* Folders */}
      <div className="mt-3 mb-1 px-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
          Folders
        </p>
      </div>
      {folders.map((folder) => (
        <button
          key={folder.id}
          onClick={() => onSelectFolder?.(folder.id)}
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded-md mx-2
            transition-colors text-left group
            ${
              selectedFolderId === folder.id
                ? "bg-indigo-600 text-white"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
            }
          `}
        >
          <ChevronRight size={12} className="shrink-0 opacity-50" />
          <Folder size={14} className="shrink-0" />
          <span className="flex-1 truncate">{folder.name}</span>
          <span
            className={`
            text-[10px] font-mono
            ${selectedFolderId === folder.id ? "text-indigo-200" : "text-zinc-600"}
          `}
          >
            {folder.documentCount}
          </span>
        </button>
      ))}

      {/* Tags */}
      <div className="mt-4 mb-1 px-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
          Tags
        </p>
      </div>
      {tags.map((tag) => (
        <button
          key={tag.id}
          onClick={() => onSelectTag?.(tag.id)}
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded-md mx-2
            transition-colors text-left
            ${
              selectedTagId === tag.id
                ? "bg-indigo-600 text-white"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
            }
          `}
        >
          <Hash size={13} className="shrink-0" />
          <span className="flex-1 truncate">{tag.name}</span>
          <span
            className={`
            text-[10px] font-mono
            ${selectedTagId === tag.id ? "text-indigo-200" : "text-zinc-600"}
          `}
          >
            {tag.documentCount}
          </span>
        </button>
      ))}
    </div>
  );
}
