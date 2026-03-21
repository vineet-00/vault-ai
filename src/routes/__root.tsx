import { AppShell } from "@/components/shell";
import {
  createRootRoute,
  Outlet,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useEffect, useState } from "react";

function RootLayout() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const [commandOpen, setCommandOpen] = useState(false);
  const [aiPanelOpen, setAIPanelOpen] = useState(false);

  // Derive active section from current route
  const activeSection = routerState.location.pathname.split("/")[1] || "vault";

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "j") {
        e.preventDefault();
        setAIPanelOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setCommandOpen(false);
        setAIPanelOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <AppShell
      activeSection={activeSection}
      commandOpen={commandOpen}
      aiPanelOpen={aiPanelOpen}
      onNavigate={(href: string) => navigate({ to: href })}
      onCloseCommand={() => setCommandOpen(false)}
      onCloseAIPanel={() => setAIPanelOpen(false)}
    >
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </AppShell>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
});
