import { Bold, Italic, Code, Heading1, Heading2, Heading3 } from "lucide-react";

interface EditorToolbarProps {
  onFormat: (syntax: string) => void;
}

const tools = [
  { icon: <Bold size={14} />, syntax: "**", label: "Bold" },
  { icon: <Italic size={14} />, syntax: "_", label: "Italic" },
  { icon: <Code size={14} />, syntax: "`", label: "Code" },
  { icon: <Heading1 size={14} />, syntax: "# ", label: "H1" },
  { icon: <Heading2 size={14} />, syntax: "## ", label: "H2" },
  { icon: <Heading3 size={14} />, syntax: "### ", label: "H3" },
];

export const EditorToolbar = ({ onFormat }: EditorToolbarProps) => {
  return (
    <div className="flex items-center gap-0.5 px-3 py-1.5 border-b border-border">
      {tools.map((tool) => (
        <button
          key={tool.label}
          onClick={() => onFormat(tool.syntax)}
          title={tool.label}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          {tool.icon}
        </button>
      ))}
    </div>
  );
};

export default EditorToolbar;
