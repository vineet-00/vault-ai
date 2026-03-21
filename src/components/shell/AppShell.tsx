import { MainNav } from "./MainNav";
import { CommandPalette } from "./CommandPalette";
import { AIPanel } from "./AIPanel";

interface AppShellProps {
  children: React.ReactNode;
  activeSection?: string;
  commandOpen?: boolean;
  aiPanelOpen?: boolean;
  onNavigate?: (href: string) => void;
  onCloseCommand?: () => void;
  onCloseAIPanel?: () => void;
}

export const AppShell = ({
  children,
  activeSection = "vault",
  commandOpen = false,
  aiPanelOpen = false,
  onNavigate,
  onCloseCommand,
  onCloseAIPanel,
}: AppShellProps) => {
  return (
    <div className="flex h-screen w-screen bg-background text-foreground overflow-hidden">
      <MainNav activeSection={activeSection} onNavigate={onNavigate} />
      <main className="flex-1 overflow-hidden relative">{children}</main>
      {commandOpen && <CommandPalette onClose={onCloseCommand} />}
      {aiPanelOpen && <AIPanel onClose={onCloseAIPanel} />}
    </div>
  );
};
