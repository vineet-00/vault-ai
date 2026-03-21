// =============================================================================
// UI Data Shapes — Settings
// =============================================================================

export type FolderStatus = "active" | "indexing" | "paused" | "error";
export type ModelStatus =
  | "not-downloaded"
  | "downloading"
  | "downloaded"
  | "active";
export type KeyStrength = "weak" | "moderate" | "strong";
export type SettingsCategory = "watched-folders" | "local-llm" | "encryption";

export interface WatchedFolder {
  id: string;
  path: string;
  status: FolderStatus;
  fileCount: number;
  lastSynced: string | null;
  isPaused: boolean;
}

export interface LLMModel {
  id: string;
  name: string;
  description: string;
  size: string;
  ramRequired: string;
  status: ModelStatus;
  downloadProgress: number | null;
}

export interface EncryptionSettings {
  enabled: boolean;
  keyStrength: KeyStrength;
  lastChanged: string;
  algorithm: string;
}

export interface StorageInfo {
  vaultPath: string;
  totalSize: string;
  documentCount: number;
  embeddingSize: string;
}

// =============================================================================
// Component Props
// =============================================================================

export interface SettingsProps {
  watchedFolders: WatchedFolder[];
  llmModels: LLMModel[];
  encryptionSettings: EncryptionSettings;
  storageInfo: StorageInfo;
  activeCategory?: SettingsCategory;

  /** Called when user switches settings category */
  onSelectCategory?: (category: SettingsCategory) => void;

  /** Watched folder actions */
  onAddFolder?: () => void;
  onRemoveFolder?: (folderId: string) => void;
  onToggleFolderPause?: (folderId: string) => void;

  /** LLM model actions */
  onDownloadModel?: (modelId: string) => void;
  onActivateModel?: (modelId: string) => void;
  onCancelDownload?: (modelId: string) => void;

  /** Encryption actions */
  onToggleEncryption?: (enabled: boolean) => void;
  onChangeKey?: () => void;
}
