import type {
  Document,
  EmbeddingStatus,
  FileType,
} from "@/../product/sections/vault-home/types";
import {
  Bot,
  Code,
  Copy,
  FileText,
  Image,
  Sparkles,
  Tag,
  Trash2,
} from "lucide-react";
import { useState } from "react";

interface DocumentRowProps {
  document: Document;
  isSelected: boolean;
  onSelect?: () => void;
  onAskAI?: () => void;
  onGenerateSummary?: () => void;
  onAddTags?: () => void;
  onCopyPath?: () => void;
  onDelete?: () => void;
}

const fileTypeIcon: Record<FileType, React.ReactNode> = {
  pdf: <FileText size={14} className="text-red-400" />,
  markdown: <FileText size={14} className="text-blue-400" />,
  image: <Image size={14} className="text-emerald-400" />,
  code: <Code size={14} className="text-amber-400" />,
};

const statusDot: Record<EmbeddingStatus, string> = {
  pending: "bg-zinc-500",
  processing: "bg-blue-500 animate-pulse",
  ready: "bg-emerald-500",
  failed: "bg-red-500",
};

const statusLabel: Record<EmbeddingStatus, string> = {
  pending: "Pending",
  processing: "Indexing...",
  ready: "Ready",
  failed: "Failed",
};

export function DocumentRow({
  document,
  isSelected,
  onSelect,
  onAskAI,
  onGenerateSummary,
  onAddTags,
  onCopyPath,
  onDelete,
}: DocumentRowProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        flex items-center gap-3 px-3 py-2.5 cursor-pointer
        border-b border-zinc-800/60 group relative
        transition-colors duration-75
        ${
          isSelected
            ? "bg-zinc-800 border-l-2 border-l-indigo-500"
            : "hover:bg-zinc-800/50"
        }
      `}
    >
      {/* Status dot */}
      <div
        title={statusLabel[document.embeddingStatus]}
        className={`
          w-1.5 h-1.5 rounded-full shrink-0
          ${statusDot[document.embeddingStatus]}
        `}
      />

      {/* File type icon */}
      <span className="shrink-0">{fileTypeIcon[document.fileType]}</span>

      {/* Title + meta */}
      <div className="flex-1 min-w-0">
        <p
          className={`
          text-sm truncate font-medium
          ${isSelected ? "text-zinc-100" : "text-zinc-200"}
        `}
        >
          {document.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] text-zinc-600 font-mono">
            {document.createdAt}
          </span>
          {document.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[10px] bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded font-medium"
            >
              {tag}
            </span>
          ))}
          {document.tags.length > 2 && (
            <span className="text-[10px] text-zinc-600">
              +{document.tags.length - 2}
            </span>
          )}
        </div>
      </div>

      {/* File size */}
      {!hovered && (
        <span className="text-[11px] text-zinc-600 font-mono shrink-0">
          {document.size}
        </span>
      )}

      {/* Hover actions */}
      {hovered && (
        <div
          className="flex items-center gap-0.5 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <ActionBtn
            icon={<Bot size={13} />}
            label="Ask AI"
            onClick={onAskAI}
          />
          <ActionBtn
            icon={<Sparkles size={13} />}
            label="Summary"
            onClick={onGenerateSummary}
          />
          <ActionBtn
            icon={<Tag size={13} />}
            label="Tags"
            onClick={onAddTags}
          />
          <ActionBtn
            icon={<Copy size={13} />}
            label="Copy path"
            onClick={onCopyPath}
          />
          <ActionBtn
            icon={<Trash2 size={13} />}
            label="Delete"
            onClick={onDelete}
            danger
          />
        </div>
      )}
    </div>
  );
}

function ActionBtn({
  icon,
  label,
  onClick,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <button
      title={label}
      onClick={onClick}
      className={`
        p-1.5 rounded-md transition-colors
        ${
          danger
            ? "text-zinc-600 hover:text-red-400 hover:bg-red-400/10"
            : "text-zinc-600 hover:text-zinc-200 hover:bg-zinc-700"
        }
      `}
    >
      {icon}
    </button>
  );
}
