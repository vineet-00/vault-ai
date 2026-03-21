import {
  Bold,
  Italic,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Link,
  Code2,
  Image,
  Sparkles,
  PanelRight,
} from "lucide-react";

interface EditorToolbarProps {
  noteTitle: string;
  aiPanelOpen?: boolean;
  onTitleChange?: (title: string) => void;
  onFormat?: (format: string) => void;
  onGenerateInsights?: () => void;
  onToggleAIPanel?: () => void;
}

export function EditorToolbar({
  noteTitle,
  aiPanelOpen,
  onTitleChange,
  onFormat,
  onGenerateInsights,
  onToggleAIPanel,
}: EditorToolbarProps) {
  const tools = [
    { icon: <Bold size={13} />, label: "Bold (⌘B)", format: "bold" },
    { icon: <Italic size={13} />, label: "Italic (⌘I)", format: "italic" },
    { icon: <Code size={13} />, label: "Inline code", format: "code" },
    { divider: true },
    { icon: <Heading1 size={13} />, label: "Heading 1", format: "h1" },
    { icon: <Heading2 size={13} />, label: "Heading 2", format: "h2" },
    { icon: <Heading3 size={13} />, label: "Heading 3", format: "h3" },
    { divider: true },
    { icon: <Link size={13} />, label: "Insert link", format: "link" },
    { icon: <Code2 size={13} />, label: "Code block", format: "codeblock" },
    { icon: <Image size={13} />, label: "Insert image", format: "image" },
  ];

  return (
    <div className="border-b border-zinc-800 shrink-0">
      {/* Title */}
      <div className="px-4 pt-4 pb-2">
        <input
          value={noteTitle}
          onChange={(e) => onTitleChange?.(e.target.value)}
          placeholder="Untitled Note"
          className="w-full bg-transparent text-lg font-semibold text-zinc-100 placeholder:text-zinc-700 outline-none"
        />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-3 py-1.5">
        {tools.map((tool, i) =>
          tool.divider ? (
            <div key={i} className="w-px h-4 bg-zinc-800 mx-1" />
          ) : (
            <button
              key={i}
              title={tool.label}
              onClick={() => onFormat?.(tool.format!)}
              className="p-1.5 rounded text-zinc-600 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            >
              {tool.icon}
            </button>
          ),
        )}

        {/* Right side actions */}
        <div className="flex-1" />
        <button
          onClick={onGenerateInsights}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-colors"
        >
          <Sparkles size={12} />
          Generate Insights
        </button>
        <button
          onClick={onToggleAIPanel}
          title="Toggle AI Panel"
          className={`
            p-1.5 rounded ml-1 transition-colors
            ${
              aiPanelOpen
                ? "text-indigo-400 bg-indigo-500/10"
                : "text-zinc-600 hover:text-zinc-200 hover:bg-zinc-800"
            }
          `}
        >
          <PanelRight size={14} />
        </button>
      </div>
    </div>
  );
}
