import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/timeline")({
  component: TimelinePage,
});

function TimelinePage() {
  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-zinc-600 text-sm">Timeline — coming soon</p>
    </div>
  );
}
