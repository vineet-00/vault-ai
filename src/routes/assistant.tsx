import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/assistant")({
  component: AssistantPage,
});

function AssistantPage() {
  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-zinc-600 text-sm">
        AI Assistant — coming in Milestone 4
      </p>
    </div>
  );
}
