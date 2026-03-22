import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Note } from "@/lib/tauri";

interface NotesListProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (note: Note) => void;
  onCreateNote: () => void;
}

export const NotesList = ({
  notes,
  selectedNoteId,
  onSelectNote,
  onCreateNote,
}: NotesListProps) => {
  const [search, setSearch] = useState("");

  const filtered = notes.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="h-full flex flex-col border-r border-border">
      {/* Header */}
      <div className="px-3 py-2 border-b border-border flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Notes</span>
        <button
          onClick={onCreateNote}
          className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2 border-b border-border">
        <div className="flex items-center gap-2 bg-muted rounded-md px-2 py-1">
          <Search size={13} className="text-muted-foreground shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes..."
            className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto py-1">
        {filtered.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center mt-8">
            {search ? "No notes match your search" : "No notes yet"}
          </p>
        ) : (
          filtered.map((note) => (
            <button
              key={note.id}
              onClick={() => onSelectNote(note)}
              className={`w-full text-left px-3 py-2 transition-colors ${
                selectedNoteId === note.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent text-muted-foreground"
              }`}
            >
              <p className="text-xs font-medium truncate">{note.title}</p>
              <p className="text-[11px] truncate opacity-60 mt-0.5">
                {note.content.split("\n")[0] || "Empty note"}
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default NotesList;
