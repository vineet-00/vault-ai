import { useState } from "react";
import { MainNav } from "./MainNav";
import { CommandPalette } from "./CommandPalette";
import { AIPanel } from "./AIPanel";

interface AppShellProps {
  children: React.ReactNode;
  activeSection?: string;
  onNavigate?: (href: string) => void;
}

export function AppShell({
  children,
  activeSection = "vault",
  onNavigate,
}: AppShellProps) {
  const [commandOpen, setCommandOpen] = useState(false);
  const [aiPanelOpen, setAIPanelOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Sidebar */}
      <MainNav activeSection={activeSection} onNavigate={onNavigate} />

      {/* Main Workspace */}
      <main className="flex-1 overflow-hidden relative">{children}</main>

      {/* Command Palette Overlay */}
      {commandOpen && <CommandPalette onClose={() => setCommandOpen(false)} />}

      {/* AI Assistant Float Panel */}
      {aiPanelOpen && <AIPanel onClose={() => setAIPanelOpen(false)} />}
    </div>
  );
}
