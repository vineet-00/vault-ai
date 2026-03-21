// =============================================================================
// UI Data Shapes — Notes Editor
// =============================================================================

export type SaveStatus = "saved" | "saving" | "unsaved";
export type FileType = "pdf" | "markdown" | "image" | "code";

export interface Folder {
  id: string;
  name: string;
  documentCount: number;
  expanded: boolean;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export interface RelatedDocument {
  id: string;
  title: string;
  fileType: FileType;
}

export interface AIGenerated {
  summary: string;
  insights: string[];
  flashcards: Flashcard[];
  relatedDocuments: RelatedDocument[];
}

export interface Note {
  id: string;
  title: string;
  folderId: string;
  tags: string[];
  content: string;
  wordCount: number;
  readingTime: string;
  createdAt: string;
  updatedAt: string;
  saveStatus: SaveStatus;
  aiGenerated: AIGenerated | null;
}

// =============================================================================
// Component Props
// =============================================================================

export interface NotesEditorProps {
  folders: Folder[];
  notes: Note[];
  selectedNote?: string | null;
  aiPanelOpen?: boolean;

  /** Called when user selects a folder to filter notes */
  onSelectFolder?: (folderId: string | null) => void;

  /** Called when user selects a note from the list */
  onSelectNote?: (noteId: string) => void;

  /** Called when user creates a new note */
  onCreateNote?: () => void;

  /** Called when note content changes (triggers auto-save) */
  onUpdateContent?: (noteId: string, content: string) => void;

  /** Called when note title changes */
  onUpdateTitle?: (noteId: string, title: string) => void;

  /** Called when user deletes a note */
  onDeleteNote?: (noteId: string) => void;

  /** Called when user triggers AI insight generation */
  onGenerateInsights?: (noteId: string) => void;

  /** Called when user clicks a related document */
  onOpenRelatedDocument?: (documentId: string) => void;

  /** Called when user toggles the AI panel */
  onToggleAIPanel?: () => void;
}
