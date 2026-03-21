import { useState } from "react";
import {
  Vault,
  FileText,
  StickyNote,
  Bot,
  Clock,
  Settings,
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  shortcut?: string;
}

interface MainNavProps {
  activeSection?: string;
  onNavigate?: (href: string) => void;
}

const topNavItems: NavItem[] = [
  {
    id: "vault",
    label: "Vault",
    icon: <Vault size={18} />,
    href: "/vault",
    shortcut: "⌘1",
  },
  {
    id: "documents",
    label: "Documents",
    icon: <FileText size={18} />,
    href: "/documents",
    shortcut: "⌘2",
  },
  {
    id: "notes",
    label: "Notes",
    icon: <StickyNote size={18} />,
    href: "/notes",
    shortcut: "⌘3",
  },
  {
    id: "assistant",
    label: "AI Assistant",
    icon: <Bot size={18} />,
    href: "/assistant",
    shortcut: "⌘4",
  },
  {
    id: "timeline",
    label: "Timeline",
    icon: <Clock size={18} />,
    href: "/timeline",
    shortcut: "⌘5",
  },
];

const bottomNavItems: NavItem[] = [
  {
    id: "settings",
    label: "Settings",
    icon: <Settings size={18} />,
    href: "/settings",
  },
];

export function MainNav({ activeSection, onNavigate }: MainNavProps) {
  const [expanded, setExpanded] = useState(false);

  const NavButton = ({ item }: { item: NavItem }) => {
    const isActive = activeSection === item.id;
    return (
      <button
        onClick={() => onNavigate?.(item.href)}
        title={!expanded ? `${item.label} ${item.shortcut ?? ""}` : undefined}
        className={`
          w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm
          transition-colors duration-100 group relative
          ${
            isActive
              ? "bg-indigo-600 text-white"
              : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
          }
        `}
      >
        <span className="shrink-0">{item.icon}</span>
        {expanded && <span className="truncate font-medium">{item.label}</span>}
        {expanded && item.shortcut && (
          <span className="ml-auto text-xs text-zinc-600 font-mono">
            {item.shortcut}
          </span>
        )}
      </button>
    );
  };

  return (
    <nav
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      style={{ width: expanded ? 220 : 48 }}
      className="
        h-full bg-zinc-900 border-r border-zinc-800
        flex flex-col py-3 gap-1
        transition-all duration-200 ease-out
        overflow-hidden shrink-0 z-10
      "
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 py-1 mb-2">
        <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center shrink-0">
          <Vault size={14} className="text-white" />
        </div>
        {expanded && (
          <span className="font-semibold text-sm text-zinc-100 truncate">
            VaultAI
          </span>
        )}
      </div>

      {/* Top nav items */}
      <div className="flex flex-col gap-0.5 px-1.5 flex-1">
        {topNavItems.map((item) => (
          <NavButton key={item.id} item={item} />
        ))}
      </div>

      {/* Divider + Settings */}
      <div className="px-1.5 flex flex-col gap-0.5">
        <div className="border-t border-zinc-800 mb-1" />
        {bottomNavItems.map((item) => (
          <NavButton key={item.id} item={item} />
        ))}
      </div>
    </nav>
  );
}
