import { Bot } from "lucide-react";

interface ChatEmptyStateProps {
  onExampleQuery?: (query: string) => void;
}

const exampleQueries = [
  "Summarize my research notes on Transformers",
  "What are the key differences between usearch and FAISS?",
  "Find all documents related to Rust memory management",
  "Explain the architecture decisions in my VaultAI notes",
];

export function ChatEmptyState({ onExampleQuery }: ChatEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-8">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center mx-auto">
          <Bot size={24} className="text-indigo-400" />
        </div>
        <h2 className="text-base font-semibold text-zinc-100">
          Ask your vault anything
        </h2>
        <p className="text-sm text-zinc-500 max-w-sm">
          Your AI assistant has read everything in your vault and can answer
          questions, summarize documents, and find connections between ideas.
        </p>
      </div>

      <div className="w-full max-w-md space-y-2">
        <p className="text-[11px] text-zinc-600 text-center mb-3">
          Try asking...
        </p>
        {exampleQueries.map((query, i) => (
          <button
            key={i}
            onClick={() => onExampleQuery?.(query)}
            className="w-full text-left px-4 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80 rounded-xl text-xs text-zinc-400 hover:text-zinc-200 transition-all"
          >
            "{query}"
          </button>
        ))}
      </div>
    </div>
  );
}
