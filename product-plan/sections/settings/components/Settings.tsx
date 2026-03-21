import { useState } from "react";
import { SettingsNav } from "./SettingsNav";
import { WatchedFoldersPanel } from "./WatchedFoldersPanel";
import { LocalLLMPanel } from "./LocalLLMPanel";
import { EncryptionPanel } from "./EncryptionPanel";
import type {
  SettingsProps,
  SettingsCategory,
} from "@/../product/sections/settings/types";

export function Settings({
  watchedFolders,
  llmModels,
  encryptionSettings,
  storageInfo,
  activeCategory: initialCategory = "watched-folders",
  onSelectCategory,
  onAddFolder,
  onRemoveFolder,
  onToggleFolderPause,
  onDownloadModel,
  onActivateModel,
  onCancelDownload,
  onToggleEncryption,
  onChangeKey,
}: SettingsProps) {
  const [activeCategory, setActiveCategory] =
    useState<SettingsCategory>(initialCategory);

  const handleSelectCategory = (category: SettingsCategory) => {
    setActiveCategory(category);
    onSelectCategory?.(category);
  };

  return (
    <div className="flex h-full bg-zinc-950 overflow-hidden">
      {/* Settings Nav */}
      <div className="w-[220px] shrink-0">
        <SettingsNav
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
        />
      </div>

      {/* Content Panel */}
      <div className="flex-1 overflow-hidden">
        {activeCategory === "watched-folders" && (
          <WatchedFoldersPanel
            folders={watchedFolders}
            storageInfo={storageInfo}
            onAddFolder={onAddFolder}
            onRemoveFolder={onRemoveFolder}
            onTogglePause={onToggleFolderPause}
          />
        )}
        {activeCategory === "local-llm" && (
          <LocalLLMPanel
            models={llmModels}
            storageInfo={storageInfo}
            onDownload={onDownloadModel}
            onActivate={onActivateModel}
            onCancelDownload={onCancelDownload}
          />
        )}
        {activeCategory === "encryption" && (
          <EncryptionPanel
            settings={encryptionSettings}
            storageInfo={storageInfo}
            onToggle={onToggleEncryption}
            onChangeKey={onChangeKey}
          />
        )}
      </div>
    </div>
  );
}
