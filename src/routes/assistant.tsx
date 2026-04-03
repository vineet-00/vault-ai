import { createFileRoute } from "@tanstack/react-router";
import AIAssistant from "@/components/ai-assistant/AIAssistant";

export const Route = createFileRoute("/assistant")({
  component: AIAssistant,
});
