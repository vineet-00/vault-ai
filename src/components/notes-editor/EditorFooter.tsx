interface EditorFooterProps {
  wordCount: number;
  saveStatus: "saved" | "saving" | "unsaved";
}

export const EditorFooter = ({ wordCount, saveStatus }: EditorFooterProps) => {
  return (
    <div className="flex items-center justify-between px-4 py-1.5 border-t border-border">
      <span className="text-[11px] text-muted-foreground">
        {wordCount} words
      </span>
      <span
        className={`text-[11px] ${
          saveStatus === "saved"
            ? "text-green-500"
            : saveStatus === "saving"
              ? "text-muted-foreground"
              : "text-amber-500"
        }`}
      >
        {saveStatus === "saved"
          ? "Saved ✓"
          : saveStatus === "saving"
            ? "Saving..."
            : "Unsaved"}
      </span>
    </div>
  );
};

export default EditorFooter;
