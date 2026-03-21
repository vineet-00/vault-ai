import { useState } from "react";
import { FolderTree } from "../../vault-home/components/FolderTree";
import { NotesList } from "./NotesList";
import { EditorToolbar } from "./EditorToolbar";
import { EditorFooter } from "./EditorFooter";
import { AIInsightsPanel } from "./AIInsightsPanel";
import { StickyNote } from "lucide-react";
import type { NotesEditorProps } from "@/../product/sections/notes-editor/types";

export function NotesEditor({
  folders,
  notes,
  selectedNote: initialSelected = null,
  aiPanelOpen: initialAIPanel = false,
  onSelectFolder,
  onSelectNote,
  onCreateNote,
  onUpdateContent,
  onUpdateTitle,
  onGenerateInsights,
  onOpenRelatedDocument,
  onToggleAIPanel,
}: NotesEditorProps) {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(
    initialSelected ?? null,
  );
  const [aiPanelOpen, setAIPanelOpen] = useState(initialAIPanel);

  const selectedNote = notes.find((n) => n.id === selectedNoteId) ?? null;

  const handleSelectNote = (id: string) => {
    setSelectedNoteId(id);
    onSelectNote?.(id);
  };

  const handleToggleAIPanel = () => {
    setAIPanelOpen(!aiPanelOpen);
    onToggleAIPanel?.();
  };

  return (
    <div className="flex h-full bg-zinc-950 overflow-hidden">
      {/* Column 1: Folder Tree */}
      <div className="w-[200px] shrink-0 border-r border-zinc-800">
        <FolderTree
          folders={folders}
          tags={[]}
          onSelectFolder={onSelectFolder}
        />
      </div>

      {/* Column 2: Notes List */}
      <div className="w-[260px] shrink-0">
        <NotesList
          notes={notes}
          folders={folders}
          selectedNoteId={selectedNoteId}
          onSelectNote={handleSelectNote}
          onCreateNote={onCreateNote}
        />
      </div>

      {/* Column 3: Editor */}
      {selectedNote ? (
        <div className="flex flex-1 min-w-0 overflow-hidden">
          {/* Editor + Preview */}
          <div className="flex flex-col flex-1 min-w-0">
            <EditorToolbar
              noteTitle={selectedNote.title}
              aiPanelOpen={aiPanelOpen}
              onTitleChange={(title) => onUpdateTitle?.(selectedNote.id, title)}
              onGenerateInsights={() => onGenerateInsights?.(selectedNote.id)}
              onToggleAIPanel={handleToggleAIPanel}
            />

            {/* Split editor */}
            <div className="flex flex-1 overflow-hidden">
              {/* Raw markdown */}
              <div className="flex-1 border-r border-zinc-800 overflow-hidden">
                <textarea
                  value={selectedNote.content}
                  onChange={(e) =>
                    onUpdateContent?.(selectedNote.id, e.target.value)
                  }
                  className="w-full h-full bg-zinc-900 text-zinc-300 text-sm font-mono leading-relaxed p-4 resize-none outline-none placeholder:text-zinc-700"
                  placeholder="Start writing in markdown..."
                  spellCheck={false}
                />
              </div>

              {/* Rendered preview */}
              <div className="flex-1 overflow-y-auto p-4 bg-zinc-950">
                <div className="prose prose-sm prose-invert max-w-none">
                  <pre className="text-xs text-zinc-400 whitespace-pre-wrap font-sans leading-relaxed bg-transparent p-0 m-0">
                    {selectedNote.content}
                  </pre>
                </div>
              </div>
            </div>

            <EditorFooter
              wordCount={selectedNote.wordCount}
              readingTime={selectedNote.readingTime}
              saveStatus={selectedNote.saveStatus}
            />
          </div>

          {/* AI Insights Panel */}
          {aiPanelOpen && (
            <AIInsightsPanel
              aiGenerated={selectedNote.aiGenerated}
              onClose={handleToggleAIPanel}
              onOpenRelatedDocument={onOpenRelatedDocument}
              onGenerateInsights={() => onGenerateInsights?.(selectedNote.id)}
            />
          )}
        </div>
      ) : (
        /* No note selected */
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <StickyNote size={32} className="text-zinc-700 mx-auto" />
            <p className="text-sm text-zinc-600">
              Select a note or create a new one
            </p>
            <button
              onClick={onCreateNote}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              + New Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
