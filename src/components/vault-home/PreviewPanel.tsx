import { Document as VaultDocument } from "@/lib/tauri";
import { FileText } from "lucide-react";

interface PreviewPanelProps {
  document: VaultDocument | null;
}

export const PreviewPanel = ({ document }: PreviewPanelProps) => {
  if (!document) {
    return (
      <div className="h-full flex flex-col items-center justify-center border-l border-border">
        <FileText size={32} className="text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          Select a document to preview
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col border-l border-border overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground truncate">
          {document.title}
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">{document.path}</p>
      </div>

      {/* Metadata */}
      <div className="px-4 py-3 space-y-2">
        <MetaRow label="Type" value={document.file_type} />
        <MetaRow
          label="Size"
          value={
            document.size
              ? `${(document.size / 1024).toFixed(1)} KB`
              : "Unknown"
          }
        />
        <MetaRow label="Status" value={document.embedding_status} />
        <MetaRow
          label="Added"
          value={
            document.created_at
              ? new Date(document.created_at).toLocaleDateString()
              : "Unknown"
          }
        />
      </div>

      {/* Tags */}
      {document.tags.length > 0 && (
        <div className="px-4 py-2">
          <p className="text-xs text-muted-foreground mb-1.5">Tags</p>
          <div className="flex flex-wrap gap-1">
            {document.tags.map((tag) => (
              <span
                key={tag.id}
                className="text-xs bg-muted px-2 py-0.5 rounded-full"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs text-foreground font-mono">{value}</span>
    </div>
  );
}

export default PreviewPanel;
