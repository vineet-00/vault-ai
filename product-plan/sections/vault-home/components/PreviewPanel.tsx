import type { Document } from "@/../product/sections/vault-home/types";
import { Bot, FileText, Sparkles, Tag, Trash2, X } from "lucide-react";

interface PreviewPanelProps {
  document: Document | null;
  onClose?: () => void;
  onAskAI?: (id: string) => void;
  onGenerateSummary?: (id: string) => void;
  onAddTags?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const statusConfig = {
  pending: { color: "bg-zinc-500", label: "Pending" },
  processing: { color: "bg-blue-500", label: "Indexing..." },
  ready: { color: "bg-emerald-500", label: "Ready" },
  failed: { color: "bg-red-500", label: "Failed" },
};

const fileTypeBadge = {
  pdf: "text-red-400 bg-red-400/10",
  markdown: "text-blue-400 bg-blue-400/10",
  image: "text-emerald-400 bg-emerald-400/10",
  code: "text-amber-400 bg-amber-400/10",
};

export function PreviewPanel({
  document,
  onClose,
  onAskAI,
  onGenerateSummary,
  onAddTags,
  onDelete,
}: PreviewPanelProps) {
  if (!document) {
    return (
      <div className="h-full flex items-center justify-center bg-zinc-950">
        <div className="text-center space-y-2">
          <FileText size={32} className="text-zinc-700 mx-auto" />
          <p className="text-sm text-zinc-600">Select a document to preview</p>
        </div>
      </div>
    );
  }

  const status = statusConfig[document.embeddingStatus];

  return (
    <div className="h-full flex flex-col bg-zinc-950 border-l border-zinc-800">
      {/* Header */}
      <div className="flex items-start gap-3 px-4 py-3 border-b border-zinc-800 shrink-0">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`
              text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded
              ${fileTypeBadge[document.fileType]}
            `}
            >
              {document.fileType}
            </span>
            <div className="flex items-center gap-1">
              <div className={`w-1.5 h-1.5 rounded-full ${status.color}`} />
              <span className="text-[10px] text-zinc-600">{status.label}</span>
            </div>
          </div>
          <h2 className="text-sm font-semibold text-zinc-100 truncate">
            {document.title}
          </h2>
          <p className="text-[11px] text-zinc-600 font-mono mt-0.5">
            {document.size}
            {document.pageCount && ` · ${document.pageCount} pages`}
            {` · ${document.createdAt}`}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-zinc-600 hover:text-zinc-300 p-1 rounded"
        >
          <X size={14} />
        </button>
      </div>

      {/* Action bar */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-zinc-800 shrink-0">
        <PanelAction
          icon={<Bot size={13} />}
          label="Ask AI"
          onClick={() => onAskAI?.(document.id)}
          primary
        />
        <PanelAction
          icon={<Sparkles size={13} />}
          label="Summary"
          onClick={() => onGenerateSummary?.(document.id)}
        />
        <PanelAction
          icon={<Tag size={13} />}
          label="Add Tags"
          onClick={() => onAddTags?.(document.id)}
        />
        <div className="flex-1" />
        <PanelAction
          icon={<Trash2 size={13} />}
          label="Delete"
          onClick={() => onDelete?.(document.id)}
          danger
        />
      </div>

      {/* Tags */}
      {document.tags.length > 0 && (
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-zinc-800 flex-wrap shrink-0">
          {document.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* AI Summary (if available) */}
      {document.summary && (
        <div className="px-4 py-3 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles size={11} className="text-indigo-400" />
            <p className="text-[10px] font-semibold uppercase tracking-widest text-indigo-400">
              AI Summary
            </p>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {document.summary}
          </p>
        </div>
      )}

      {/* Content preview */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {document.embeddingStatus === "processing" ? (
          <div className="flex flex-col items-center justify-center h-32 gap-3">
            <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-zinc-600">Indexing document...</p>
          </div>
        ) : document.embeddingStatus === "failed" ? (
          <div className="flex flex-col items-center justify-center h-32 gap-2">
            <p className="text-xs text-red-400">Indexing failed</p>
            <button className="text-xs text-zinc-500 hover:text-zinc-300 underline">
              Retry
            </button>
          </div>
        ) : document.preview ? (
          <div className="prose prose-sm prose-invert max-w-none">
            <pre className="text-xs text-zinc-400 whitespace-pre-wrap font-mono leading-relaxed bg-transparent p-0 m-0">
              {document.preview}
            </pre>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 gap-2">
            <Sparkles size={20} className="text-zinc-700" />
            <p className="text-xs text-zinc-600 text-center">
              No preview available.
              <br />
              Generate a summary to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function PanelAction({
  icon,
  label,
  onClick,
  primary = false,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  primary?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium
        transition-colors
        ${
          primary
            ? "bg-indigo-600 text-white hover:bg-indigo-500"
            : danger
              ? "text-zinc-500 hover:text-red-400 hover:bg-red-400/10"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}
