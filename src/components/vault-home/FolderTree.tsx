import { Folder } from "@/lib/tauri";
import { Library, Folder as FolderIcon, LayoutList } from "lucide-react";

export const FolderTree = ({
  folders,
  selectedFolderId,
  onSelectFolder,
}: {
  folders: Folder[];
  selectedFolderId: string | null;
  onSelectFolder: (id: string | null) => void;
}) => {
  return (
    <div className="h-full p-2 border-r border-border">
      {/*All Documents Button */}
      <button
        className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors
          ${
            selectedFolderId === null
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          }`}
        onClick={() => onSelectFolder(null)}
      >
        <LayoutList size={15} className="mr-2 shrink-0" />
        All Documents
      </button>
      {/*Folder list */}
      {folders.map((folder) => (
        <button
          className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
            selectedFolderId === folder.id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          }`}
          key={folder.id}
          onClick={() => onSelectFolder(folder.id)}
        >
          <FolderIcon size={15} className="mr-2 shrink-0" /> {folder.name}
        </button>
      ))}
    </div>
  );
};

export default FolderTree;
