import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/notes")({
  component: NotesPage,
});

function NotesPage() {
  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-zinc-600 text-sm">
        Notes Editor — coming in Milestone 3
      </p>
    </div>
  );
}
