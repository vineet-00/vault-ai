import { useState } from "react";
import { Upload, Search, SlidersHorizontal } from "lucide-react";
import { FolderTree } from "./FolderTree";
import { DocumentRow } from "./DocumentRow";
import { PreviewPanel } from "./PreviewPanel";
import { EmptyState } from "./EmptyState";
import type { VaultHomeProps } from "@/../product/sections/vault-home/types";

export function VaultHome({
  folders,
  tags,
  documents,
  selectedDocument: initialSelected = null,
  onSelectFolder,
  onSelectTag,
  onSelectDocument,
  onDropFiles,
  onUpload,
  onCreateNote,
  onWatchFolder,
  onAskAI,
  onGenerateSummary,
  onAddTags,
  onCopyPath,
  onDelete,
}: VaultHomeProps) {
  const [selectedDocId, setSelectedDocId] = useState<string | null>(
    initialSelected ?? null,
  );
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedDoc = documents.find((d) => d.id === selectedDocId) ?? null;

  const filteredDocuments = documents.filter((doc) => {
    const matchesFolder =
      !selectedFolderId || doc.folderId === selectedFolderId;
    const matchesTag =
      !selectedTagId ||
      doc.tags.includes(tags.find((t) => t.id === selectedTagId)?.name ?? "");
    const matchesSearch =
      !searchQuery ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesTag && matchesSearch;
  });

  const handleSelectDoc = (id: string) => {
    setSelectedDocId(id);
    onSelectDocument?.(id);
  };

  const handleSelectFolder = (id: string | null) => {
    setSelectedFolderId(id);
    setSelectedTagId(null);
    onSelectFolder?.(id);
  };

  const handleSelectTag = (id: string | null) => {
    setSelectedTagId(id);
    setSelectedFolderId(null);
    onSelectTag?.(id);
  };

  return (
    <div className="flex h-full bg-zinc-950 overflow-hidden">
      {/* Column 1: Folder Tree */}
      <div className="w-[200px] shrink-0 border-r border-zinc-800 overflow-hidden">
        <FolderTree
          folders={folders}
          tags={tags}
          selectedFolderId={selectedFolderId}
          selectedTagId={selectedTagId}
          onSelectFolder={handleSelectFolder}
          onSelectTag={handleSelectTag}
        />
      </div>

      {/* Column 2: Document List */}
      <div
        className={`
          flex flex-col flex-1 min-w-0 border-r border-zinc-800
          transition-colors duration-150
          ${isDragOver ? "bg-indigo-500/5 border-indigo-500/30" : ""}
        `}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          const files = Array.from(e.dataTransfer.files);
          if (files.length) onDropFiles?.(files);
        }}
      >
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-2 flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5">
            <Search size={13} className="text-zinc-600 shrink-0" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter documents..."
              className="flex-1 bg-transparent text-xs text-zinc-300 placeholder:text-zinc-600 outline-none"
            />
          </div>
          <button
            onClick={onUpload}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors shrink-0"
          >
            <Upload size={12} />
            Upload
          </button>
          <button className="p-1.5 text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors">
            <SlidersHorizontal size={14} />
          </button>
        </div>

        {/* Document count */}
        <div className="px-3 py-1.5 border-b border-zinc-800 shrink-0">
          <p className="text-[10px] text-zinc-600 font-mono">
            {filteredDocuments.length} document
            {filteredDocuments.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {documents.length === 0 ? (
            <EmptyState
              onUpload={onUpload}
              onCreateNote={onCreateNote}
              onWatchFolder={onWatchFolder}
            />
          ) : filteredDocuments.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-xs text-zinc-600">
                No documents match your filter
              </p>
            </div>
          ) : (
            filteredDocuments.map((doc) => (
              <DocumentRow
                key={doc.id}
                document={doc}
                isSelected={selectedDocId === doc.id}
                onSelect={() => handleSelectDoc(doc.id)}
                onAskAI={() => onAskAI?.(doc.id)}
                onGenerateSummary={() => onGenerateSummary?.(doc.id)}
                onAddTags={() => onAddTags?.(doc.id)}
                onCopyPath={() => onCopyPath?.(doc.id)}
                onDelete={() => onDelete?.(doc.id)}
              />
            ))
          )}
        </div>

        {/* Drag overlay */}
        {isDragOver && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="border-2 border-dashed border-indigo-500 rounded-xl px-8 py-6 bg-indigo-500/10">
              <p className="text-sm font-medium text-indigo-400">
                Drop files to add to vault
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Column 3: Preview Panel */}
      <div className="w-[420px] shrink-0 overflow-hidden">
        <PreviewPanel
          document={selectedDoc}
          onClose={() => setSelectedDocId(null)}
          onAskAI={onAskAI}
          onGenerateSummary={onGenerateSummary}
          onAddTags={onAddTags}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}
