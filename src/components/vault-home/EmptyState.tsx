import { Inbox } from "lucide-react";

interface EmptyStateProps {
  onUpload: () => void;
}

export const EmptyState = ({ onUpload }: EmptyStateProps) => {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-3">
      <Inbox size={48} className="text-muted-foreground" />
      <p className="text-sm font-medium text-foreground">Your vault is empty</p>
      <span className="text-xs text-muted-foreground">
        Upload a file to get started
      </span>
      <button
        className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md hover:opacity-90 transition-opacity"
        onClick={onUpload}
      >
        Upload
      </button>
    </div>
  );
};
