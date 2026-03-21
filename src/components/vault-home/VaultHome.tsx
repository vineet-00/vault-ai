import {
  Folder,
  getDocuments,
  getFolders,
  ingestFile,
  pickFile,
  Document as VaultDocument,
} from "@/lib/tauri";
import { useEffect, useState } from "react";
import { DocumentRow } from "./DocumentRow";
import { EmptyState } from "./EmptyState";
import FolderTree from "./FolderTree";
import PreviewPanel from "./PreviewPanel";

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
    } catch (err) {
      console.error("Failed to ingest file:" + err);
    }
  };

  useEffect(() => {
    getDocuments().then(setDocuments).catch(console.error);
    getFolders().then(setFolders).catch(console.error);
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
      <div className="flex-1 min-w-0 overflow-hidden overflow-y-auto">
        {documents.length === 0 ? (
          <EmptyState onUpload={handleUpload} />
        ) : (
          documents.map((doc) => (
            <DocumentRow
              key={doc.id}
              document={doc}
              isSelected={selectedDocument?.id === doc.id}
              onSelect={setSelectedDocument}
            />
          ))
        )}
      </div>
      <div className="w-[420px]">
        <PreviewPanel document={selectedDocument} />
      </div>
    </div>
  );
};
export default VaultHome;
