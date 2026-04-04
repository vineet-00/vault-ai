import {
  Folder,
  getDocuments,
  getFolders,
  ingestFile,
  pickFile,
  Document as VaultDocument,
  deleteDocument,
  embedDocument,
} from "@/lib/tauri";
import { useEffect, useState } from "react";
import { DocumentRow } from "./DocumentRow";
import { EmptyState } from "./EmptyState";
import FolderTree from "./FolderTree";
import PreviewPanel from "./PreviewPanel";
import { Plus } from "lucide-react";
import { listen } from "@tauri-apps/api/event";

export const VaultHome = () => {
  const [documents, setDocuments] = useState<VaultDocument[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] =
    useState<VaultDocument | null>(null);

  const handleUpload = async () => {
    const path = await pickFile();
    if (!path) return;
    try {
      const doc = await ingestFile(path);
      setDocuments((prev) => [...prev, doc]);
      // Trigger embedding in background
      embedDocument(doc.id).catch(console.error);
    } catch (err) {
      console.error("Failed to ingest file:", err);
    }
  };

  useEffect(() => {
    getDocuments()
      .then((docs) => {
        setDocuments(docs);
        // Embed any pending documents
        docs
          .filter((d) => d.embedding_status === "pending")
          .forEach((d) => embedDocument(d.id).catch(console.error));
      })
      .catch(console.error);
    getFolders().then(setFolders).catch(console.error);
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      if (selectedDocument?.id === id) setSelectedDocument(null);
    } catch (err) {
      console.error("Failed to delete document:", err);
    }
  };

  useEffect(() => {
    const unlisten = listen<[string, string]>("embedding_status", (e) => {
      const [docId, status] = e.payload;
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === docId ? { ...d, embedding_status: status } : d,
        ),
      );
    });
    return () => {
      unlisten.then((f) => f());
    };
  }, []);

  return (
    <div className="h-full flex overflow-hidden">
      <div className="w-[200px]">
        <FolderTree
          folders={folders}
          selectedFolderId={selectedFolderId}
          onSelectFolder={setSelectedFolderId}
        />
      </div>
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Header with upload button */}
        <div className="px-3 py-2 border-b border-border flex items-center justify-between shrink-0">
          <span className="text-sm font-medium text-foreground">Documents</span>
          <button
            onClick={handleUpload}
            className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Document list or empty state */}
        <div className="flex-1 overflow-y-auto">
          {documents.length === 0 ? (
            <EmptyState onUpload={handleUpload} />
          ) : (
            documents.map((doc) => (
              <DocumentRow
                key={doc.id}
                document={doc}
                isSelected={selectedDocument?.id === doc.id}
                onSelect={setSelectedDocument}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>
      <div className="w-[420px]">
        <PreviewPanel document={selectedDocument} />
      </div>
    </div>
  );
};
export default VaultHome;
