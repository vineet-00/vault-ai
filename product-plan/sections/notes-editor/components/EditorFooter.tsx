import type { SaveStatus } from "@/../product/sections/notes-editor/types";
import { Check } from "lucide-react";

interface EditorFooterProps {
  wordCount: number;
  readingTime: string;
  saveStatus: SaveStatus;
  cursorLine?: number;
  cursorCol?: number;
}

const saveIndicator: Record<SaveStatus, React.ReactNode> = {
  saved: (
    <span className="flex items-center gap-1 text-emerald-600">
      <Check size={11} />
      Saved
    </span>
  ),
  saving: <span className="text-blue-500 animate-pulse">Saving...</span>,
  unsaved: <span className="text-amber-600">Unsaved changes</span>,
};

export function EditorFooter({
  wordCount,
  readingTime,
  saveStatus,
  cursorLine = 1,
  cursorCol = 1,
}: EditorFooterProps) {
  return (
    <div className="flex items-center gap-4 px-4 py-1.5 border-t border-zinc-800 bg-zinc-950 shrink-0">
      <span className="text-[11px] text-zinc-600 font-mono">
        Ln {cursorLine}, Col {cursorCol}
      </span>
      <span className="text-[11px] text-zinc-600">{wordCount} words</span>
      <span className="text-[11px] text-zinc-600">{readingTime} read</span>
      <div className="flex-1" />
      <span className="text-[11px] font-medium">
        {saveIndicator[saveStatus]}
      </span>
    </div>
  );
}
