import NotesEditor from "@/components/notes-editor/NotesEditor";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/notes")({
  component: NotesEditor,
});
