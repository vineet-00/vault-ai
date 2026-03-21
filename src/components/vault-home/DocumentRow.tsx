import { Document as VaultDocument } from "@/lib/tauri";

interface DocumentRowProps {
  document: VaultDocument;
  isSelected: boolean;
  onSelect: (doc: VaultDocument) => void;
}

export const DocumentRow = ({
  document,
  isSelected,
  onSelect,
}: DocumentRowProps) => {
  return (
    <div
      className={`flex items-center px-3 py-2 hover:cursor-pointer rounded-md transition-colors ${isSelected ? "bg-primary text-primary-foreground" : "hover:bg-accent text-muted-foreground"}`}
      onClick={() => onSelect(document)}
    >
      <span
        className={`w-2 h-2 rounded-full mr-2 shrink-0 ${
          document.embedding_status === "embedded"
            ? "bg-green-500"
            : document.embedding_status === "processing"
              ? "bg-blue-500"
              : "bg-muted-foreground/40"
        }`}
      />
      <span className="truncate min-w-0 flex-1">{document.title}</span>
      <span className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">
        {document.file_type}
      </span>
    </div>
  );
};
