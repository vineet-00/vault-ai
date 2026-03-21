import { useState } from "react";
import {
  Library,
  FileText,
  StickyNote,
  Bot,
  Clock,
  Settings,
  Moon,
  Sun,
  Vault,
  BookLock,
} from "lucide-react";
import { useTheme } from "next-themes";

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
    icon: <BookLock size={18} />,
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

export const MainNav = ({ activeSection, onNavigate }: MainNavProps) => {
  const [expanded, setExpanded] = useState(false);
  const { theme, setTheme } = useTheme();

  const NavButton = ({ item }: { item: NavItem }) => {
    const isActive = activeSection === item.id;
    return (
      <button
        onClick={() => onNavigate?.(item.href)}
        title={!expanded ? `${item.label} ${item.shortcut ?? ""}` : undefined}
        className={`
          w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm
          transition-colors duration-150
          ${
            isActive
              ? "bg-primary text-primary-foreground font-medium"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          }
        `}
      >
        <span className="shrink-0">{item.icon}</span>
        {expanded && <span className="truncate">{item.label}</span>}
        {expanded && item.shortcut && (
          <span className="ml-auto text-xs font-mono text-muted-foreground/60">
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
        h-full bg-sidebar border-r border-sidebar-border
        flex flex-col py-3
        transition-all duration-200 ease-out
        overflow-hidden shrink-0 z-10
      "
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 py-1 mb-2">
        <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center shrink-0">
          <Library size={14} className="text-primary-foreground" />
        </div>
        {expanded && (
          <span className="font-semibold text-sm text-sidebar-foreground truncate">
            VaultAI
          </span>
        )}
      </div>

      {/* Top nav */}
      <div className="flex flex-col gap-0.5 px-1.5 flex-1">
        {topNavItems.map((item) => (
          <NavButton key={item.id} item={item} />
        ))}
      </div>

      {/* Divider + Settings */}
      <div className="px-1.5 flex flex-col gap-0.5">
        <div>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title={!expanded ? "Toggle theme" : undefined}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm
              transition-colors duration-150
              text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <span className="shrink-0">
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </span>
            {expanded && (
              <span className="truncate">
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </span>
            )}
          </button>
        </div>
        <div className="border-t border-sidebar-border mb-1" />
        {bottomNavItems.map((item) => (
          <NavButton key={item.id} item={item} />
        ))}
      </div>
    </nav>
  );
};
