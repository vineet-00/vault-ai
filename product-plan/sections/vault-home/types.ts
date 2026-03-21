// =============================================================================
// UI Data Shapes — Vault Home
// =============================================================================

export type EmbeddingStatus = "pending" | "processing" | "ready" | "failed";
export type FileType = "pdf" | "markdown" | "image" | "code";

export interface Folder {
  id: string;
  name: string;
  documentCount: number;
  expanded: boolean;
}

export interface Tag {
  id: string;
  name: string;
  documentCount: number;
}

export interface Document {
  id: string;
  title: string;
  fileType: FileType;
  folderId: string;
  tags: string[];
  embeddingStatus: EmbeddingStatus;
  size: string;
  pageCount: number | null;
  createdAt: string;
  summary: string | null;
  preview: string | null;
}

// =============================================================================
// Component Props
// =============================================================================

export interface VaultHomeProps {
  folders: Folder[];
  tags: Tag[];
  documents: Document[];
  selectedDocument?: string | null;

  /** Called when user selects a folder or tag to filter */
  onSelectFolder?: (folderId: string | null) => void;
  onSelectTag?: (tagId: string | null) => void;

  /** Called when user clicks a document row */
  onSelectDocument?: (documentId: string) => void;

  /** Called when user drops files onto the list */
  onDropFiles?: (files: File[]) => void;

  /** Called when user clicks Upload Document button */
  onUpload?: () => void;

  /** Called when user clicks Create Note */
  onCreateNote?: () => void;

  /** Called when user clicks Watch Folder */
  onWatchFolder?: () => void;

  /** Document action callbacks */
  onAskAI?: (documentId: string) => void;
  onGenerateSummary?: (documentId: string) => void;
  onAddTags?: (documentId: string) => void;
  onCopyPath?: (documentId: string) => void;
  onDelete?: (documentId: string) => void;
}
