import { Folder, Bot, Lock } from "lucide-react";
import type { SettingsCategory } from "@/../product/sections/settings/types";

interface SettingsNavProps {
  activeCategory?: SettingsCategory;
  onSelectCategory?: (category: SettingsCategory) => void;
}

const categories = [
  {
    id: "watched-folders" as SettingsCategory,
    label: "Watched Folders",
    icon: <Folder size={15} />,
    description: "Auto-ingestion sources",
  },
  {
    id: "local-llm" as SettingsCategory,
    label: "Local LLM",
    icon: <Bot size={15} />,
    description: "Model selection",
  },
  {
    id: "encryption" as SettingsCategory,
    label: "Encryption",
    icon: <Lock size={15} />,
    description: "Vault security",
  },
];

export function SettingsNav({
  activeCategory,
  onSelectCategory,
}: SettingsNavProps) {
  return (
    <div className="h-full border-r border-zinc-800 bg-zinc-900 py-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 px-4 mb-3">
        Settings
      </p>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelectCategory?.(cat.id)}
          className={`
            w-full flex items-center gap-3 px-4 py-2.5 text-left
            transition-colors border-l-2
            ${
              activeCategory === cat.id
                ? "border-l-indigo-500 bg-zinc-800 text-zinc-100"
                : "border-l-transparent text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
            }
          `}
        >
          <span className="shrink-0">{cat.icon}</span>
          <div>
            <p className="text-xs font-medium">{cat.label}</p>
            <p
              className={`text-[10px] ${activeCategory === cat.id ? "text-zinc-500" : "text-zinc-600"}`}
            >
              {cat.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
