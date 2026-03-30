import { useEffect, useRef, useState } from "react";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  Note,
} from "@/lib/tauri";
import NotesList from "./NotesList";
import EditorToolbar from "./EditorToolbar";
import EditorFooter from "./EditorFooter";
import { FileText } from "lucide-react";

export const NotesEditor = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">(
    "saved",
  );
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load notes on mount
  useEffect(() => {
    getNotes().then(setNotes).catch(console.error);
  }, []);

  // Sync editor when selected note changes
  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title);
      setContent(selectedNote.content);
      setSaveStatus("saved");
    }
  }, [selectedNote]);

  // Auto-save with 1s debounce
  useEffect(() => {
    if (!selectedNote) return;
    if (title === selectedNote.title && content === selectedNote.content)
      return;

    setSaveStatus("unsaved");

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setSaveStatus("saving");
      try {
        await updateNote(selectedNote.id, title, content);
        setSaveStatus("saved");
        // Update note in list
        setNotes((prev) =>
          prev.map((n) =>
            n.id === selectedNote.id ? { ...n, title, content } : n,
          ),
        );
      } catch (err) {
        console.error("Failed to save note:", err);
        setSaveStatus("unsaved");
      }
    }, 1000);
  }, [title, content]);

  const handleCreateNote = async () => {
    try {
      const note = await createNote();
      setNotes((prev) => [note, ...prev]);
      setSelectedNote(note);
    } catch (err) {
      console.error("Failed to create note:", err);
    }
  };

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
  };

  const handleFormat = (syntax: string) => {
    // Simple prepend for block syntax (headings), wrap for inline
    if (syntax.endsWith(" ")) {
      setContent((prev) => syntax + prev);
    } else {
      setContent((prev) => `${syntax}${prev}${syntax}`);
    }
  };
  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (selectedNote?.id === id) setSelectedNote(null);
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  };

  const wordCount =
    content.trim() === "" ? 0 : content.trim().split(/\s+/).length;

  return (
    <div className="h-full flex overflow-hidden">
      {/* Notes list */}
      <div className="w-[260px] shrink-0">
        <NotesList
          notes={notes}
          selectedNoteId={selectedNote?.id ?? null}
          onSelectNote={handleSelectNote}
          onCreateNote={handleCreateNote}
          onDeleteNote={handleDeleteNote}
        />
      </div>

      {/* Editor */}
      {selectedNote ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Title */}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
            className="px-6 pt-5 pb-2 text-xl font-semibold bg-transparent text-foreground placeholder:text-muted-foreground outline-none border-b border-border"
          />

          {/* Toolbar */}
          <EditorToolbar onFormat={handleFormat} />

          {/* Content textarea */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing in markdown..."
            className="flex-1 px-6 py-4 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none font-mono"
          />

          {/* Footer */}
          <EditorFooter wordCount={wordCount} saveStatus={saveStatus} />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center">
          <FileText size={32} className="text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Select or create a note
          </p>
        </div>
      )}

      {/* AI insights panel placeholder */}
      <div className="w-[320px] shrink-0 border-l border-border">
        <div className="flex items-center justify-center h-full">
          <p className="text-xs text-muted-foreground">
            AI Insights — coming soon
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotesEditor;
