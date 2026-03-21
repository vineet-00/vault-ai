import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-zinc-600 text-sm">Settings — coming in Milestone 5</p>
    </div>
  );
}
