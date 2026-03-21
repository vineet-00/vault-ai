import type { Folder, Note } from "@/../product/sections/notes-editor/types";
import { FileText, Plus } from "lucide-react";

interface NotesListProps {
  notes: Note[];
  folders: Folder[];
  selectedNoteId?: string | null;
  onSelectNote?: (id: string) => void;
  onCreateNote?: () => void;
}

const saveStatusDot: Record<string, string> = {
  saved: "bg-emerald-500",
  saving: "bg-blue-500 animate-pulse",
  unsaved: "bg-amber-500",
};

export function NotesList({
  notes,
  selectedNoteId,
  onSelectNote,
  onCreateNote,
}: NotesListProps) {
  return (
    <div className="h-full flex flex-col border-r border-zinc-800">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-zinc-800 shrink-0">
        <span className="text-xs font-semibold text-zinc-400">Notes</span>
        <button
          onClick={onCreateNote}
          title="New Note (⌘N)"
          className="p-1 rounded-md text-zinc-600 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Notes */}
      <div className="flex-1 overflow-y-auto py-1">
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 gap-2 px-4">
            <FileText size={20} className="text-zinc-700" />
            <p className="text-xs text-zinc-600 text-center">
              No notes yet. Create your first one.
            </p>
          </div>
        ) : (
          notes.map((note) => (
            <button
              key={note.id}
              onClick={() => onSelectNote?.(note.id)}
              className={`
                w-full text-left px-3 py-2.5 border-b border-zinc-800/50
                transition-colors group
                ${
                  selectedNoteId === note.id
                    ? "bg-zinc-800 border-l-2 border-l-indigo-500"
                    : "hover:bg-zinc-800/50"
                }
              `}
            >
              <div className="flex items-start justify-between gap-2">
                <p
                  className={`
                  text-xs font-medium truncate flex-1
                  ${selectedNoteId === note.id ? "text-zinc-100" : "text-zinc-300"}
                `}
                >
                  {note.title}
                </p>
                <div
                  title={note.saveStatus}
                  className={`
                    w-1.5 h-1.5 rounded-full shrink-0 mt-1
                    ${saveStatusDot[note.saveStatus]}
                  `}
                />
              </div>
              <p className="text-[11px] text-zinc-600 truncate mt-0.5 leading-relaxed">
                {note.content
                  .replace(/[#*`]/g, "")
                  .split("\n")
                  .find((l) => l.trim()) ?? "Empty note"}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-zinc-700 font-mono">
                  {note.updatedAt}
                </span>
                <span className="text-[10px] text-zinc-700">
                  {note.wordCount}w
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
