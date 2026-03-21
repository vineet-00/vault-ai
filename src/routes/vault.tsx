import { createFileRoute } from "@tanstack/react-router";
import VaultHome from "@/components/vault-home/VaultHome";

export const Route = createFileRoute("/vault")({
  component: VaultHome,
});
