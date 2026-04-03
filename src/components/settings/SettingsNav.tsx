import { Folder, Bot, Shield } from "lucide-react";

type SettingsCategory = "watched-folders" | "local-llm" | "encryption";

interface SettingsNavProps {
  active: SettingsCategory;
  onSelect: (category: SettingsCategory) => void;
}

const categories = [
  {
    id: "watched-folders" as SettingsCategory,
    label: "Watched Folders",
    icon: <Folder size={15} />,
  },
  {
    id: "local-llm" as SettingsCategory,
    label: "Local LLM",
    icon: <Bot size={15} />,
  },
  {
    id: "encryption" as SettingsCategory,
    label: "Encryption",
    icon: <Shield size={15} />,
  },
];

export const SettingsNav = ({ active, onSelect }: SettingsNavProps) => {
  return (
    <div className="h-full border-r border-border py-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-4 mb-3">
        Settings
      </p>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors border-l-2 ${
            active === cat.id
              ? "border-l-primary bg-accent text-foreground"
              : "border-l-transparent text-muted-foreground hover:bg-accent hover:text-foreground"
          }`}
        >
          <span className="shrink-0">{cat.icon}</span>
          <span className="text-xs font-medium">{cat.label}</span>
        </button>
      ))}
    </div>
  );
};

export default SettingsNav;
