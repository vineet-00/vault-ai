import type { AIGenerated } from "@/../product/sections/notes-editor/types";
import { ChevronDown, ChevronUp, FileText, Sparkles, X } from "lucide-react";
import { useState } from "react";

interface AIInsightsPanelProps {
  aiGenerated: AIGenerated | null;
  isGenerating?: boolean;
  onClose?: () => void;
  onOpenRelatedDocument?: (id: string) => void;
  onGenerateInsights?: () => void;
}

export function AIInsightsPanel({
  aiGenerated,
  isGenerating,
  onClose,
  onOpenRelatedDocument,
  onGenerateInsights,
}: AIInsightsPanelProps) {
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [insightsExpanded, setInsightsExpanded] = useState(true);
  const [flashcardsExpanded, setFlashcardsExpanded] = useState(true);
  const [relatedExpanded, setRelatedExpanded] = useState(true);

  const toggleFlip = (id: string) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="h-full flex flex-col border-l border-zinc-800 bg-zinc-950 w-[320px] shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles size={13} className="text-indigo-400" />
          <span className="text-xs font-semibold text-zinc-300">
            AI Insights
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-zinc-600 hover:text-zinc-300 p-1 rounded transition-colors"
        >
          <X size={13} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3">
            <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-zinc-600">Generating insights...</p>
          </div>
        ) : !aiGenerated ? (
          <div className="flex flex-col items-center justify-center h-48 gap-4 px-6">
            <Sparkles size={24} className="text-zinc-700" />
            <div className="text-center space-y-1">
              <p className="text-xs font-medium text-zinc-400">
                No insights yet
              </p>
              <p className="text-[11px] text-zinc-600">
                Generate AI insights to get a summary, key takeaways, and
                flashcards from this note.
              </p>
            </div>
            <button
              onClick={onGenerateInsights}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors"
            >
              Generate Insights
            </button>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {/* Summary */}
            <div className="px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-indigo-400 mb-2">
                Summary
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {aiGenerated.summary}
              </p>
            </div>

            {/* Key Insights */}
            <div className="px-4 py-3">
              <button
                onClick={() => setInsightsExpanded(!insightsExpanded)}
                className="flex items-center justify-between w-full mb-2"
              >
                <p className="text-[10px] font-semibold uppercase tracking-widest text-indigo-400">
                  Key Insights ({aiGenerated.insights.length})
                </p>
                {insightsExpanded ? (
                  <ChevronUp size={12} className="text-zinc-600" />
                ) : (
                  <ChevronDown size={12} className="text-zinc-600" />
                )}
              </button>
              {insightsExpanded && (
                <ul className="space-y-2">
                  {aiGenerated.insights.map((insight, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-indigo-500 text-[10px] mt-0.5 shrink-0 font-mono">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {insight}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Flashcards */}
            <div className="px-4 py-3">
              <button
                onClick={() => setFlashcardsExpanded(!flashcardsExpanded)}
                className="flex items-center justify-between w-full mb-2"
              >
                <p className="text-[10px] font-semibold uppercase tracking-widest text-indigo-400">
                  Flashcards ({aiGenerated.flashcards.length})
                </p>
                {flashcardsExpanded ? (
                  <ChevronUp size={12} className="text-zinc-600" />
                ) : (
                  <ChevronDown size={12} className="text-zinc-600" />
                )}
              </button>
              {flashcardsExpanded && (
                <div className="space-y-2">
                  {aiGenerated.flashcards.map((card) => (
                    <div
                      key={card.id}
                      onClick={() => toggleFlip(card.id)}
                      className="cursor-pointer rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors p-3 bg-zinc-900"
                    >
                      {flippedCards.has(card.id) ? (
                        <div>
                          <p className="text-[10px] font-semibold text-emerald-500 mb-1">
                            ANSWER
                          </p>
                          <p className="text-xs text-zinc-300 leading-relaxed">
                            {card.answer}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-[10px] font-semibold text-indigo-400 mb-1">
                            QUESTION
                          </p>
                          <p className="text-xs text-zinc-400 leading-relaxed">
                            {card.question}
                          </p>
                          <p className="text-[10px] text-zinc-700 mt-2">
                            Click to reveal answer
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Related Documents */}
            <div className="px-4 py-3">
              <button
                onClick={() => setRelatedExpanded(!relatedExpanded)}
                className="flex items-center justify-between w-full mb-2"
              >
                <p className="text-[10px] font-semibold uppercase tracking-widest text-indigo-400">
                  Related ({aiGenerated.relatedDocuments.length})
                </p>
                {relatedExpanded ? (
                  <ChevronUp size={12} className="text-zinc-600" />
                ) : (
                  <ChevronDown size={12} className="text-zinc-600" />
                )}
              </button>
              {relatedExpanded && (
                <div className="space-y-1">
                  {aiGenerated.relatedDocuments.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => onOpenRelatedDocument?.(doc.id)}
                      className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-zinc-800 transition-colors text-left"
                    >
                      <FileText size={12} className="text-red-400 shrink-0" />
                      <span className="text-xs text-zinc-400 truncate">
                        {doc.title}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
