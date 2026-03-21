import { Check, Download, X } from "lucide-react";
import type {
  LLMModel,
  StorageInfo,
} from "@/../product/sections/settings/types";

interface LocalLLMPanelProps {
  models: LLMModel[];
  storageInfo: StorageInfo;
  onDownload?: (id: string) => void;
  onActivate?: (id: string) => void;
  onCancelDownload?: (id: string) => void;
}

export function LocalLLMPanel({
  models,
  storageInfo,
  onDownload,
  onActivate,
  onCancelDownload,
}: LocalLLMPanelProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-5 border-b border-zinc-800 shrink-0">
        <h2 className="text-sm font-semibold text-zinc-100">Local LLM</h2>
        <p className="text-xs text-zinc-500 mt-1">
          Choose which model powers your AI assistant. All models run entirely
          on your device.
        </p>
      </div>

      {/* Model grid */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="grid grid-cols-2 gap-3">
          {models.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              onDownload={() => onDownload?.(model.id)}
              onActivate={() => onActivate?.(model.id)}
              onCancelDownload={() => onCancelDownload?.(model.id)}
            />
          ))}
        </div>
      </div>

      {/* Storage footer */}
      <div className="px-6 py-4 border-t border-zinc-800 shrink-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 mb-2">
          Storage
        </p>
        <div className="flex items-center gap-6">
          <div>
            <p className="text-[10px] text-zinc-600">Vault path</p>
            <p className="text-xs font-mono text-zinc-400">
              {storageInfo.vaultPath}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-zinc-600">Total size</p>
            <p className="text-xs text-zinc-400">{storageInfo.totalSize}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModelCard({
  model,
  onDownload,
  onActivate,
  onCancelDownload,
}: {
  model: LLMModel;
  onDownload?: () => void;
  onActivate?: () => void;
  onCancelDownload?: () => void;
}) {
  return (
    <div
      className={`
      flex flex-col gap-3 p-4 rounded-xl border transition-colors
      ${
        model.status === "active"
          ? "bg-indigo-600/10 border-indigo-500/30"
          : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
      }
    `}
    >
      {/* Name + badges */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-xs font-semibold text-zinc-100">{model.name}</p>
            {model.status === "active" && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded-full">
                <Check size={9} />
                Active
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-[10px] text-zinc-600 bg-zinc-800 px-1.5 py-0.5 rounded font-mono">
              {model.size}
            </span>
            <span className="text-[10px] text-zinc-600 bg-zinc-800 px-1.5 py-0.5 rounded">
              {model.ramRequired}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-[11px] text-zinc-500 leading-relaxed flex-1">
        {model.description}
      </p>

      {/* Action */}
      <div>
        {model.status === "not-downloaded" && (
          <button
            onClick={onDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 w-full justify-center bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-lg transition-colors"
          >
            <Download size={12} />
            Download
          </button>
        )}
        {model.status === "downloading" && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-blue-400">
                Downloading... {model.downloadProgress}%
              </span>
              <button
                onClick={onCancelDownload}
                className="text-zinc-600 hover:text-zinc-300 p-0.5"
              >
                <X size={11} />
              </button>
            </div>
            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${model.downloadProgress ?? 0}%` }}
              />
            </div>
          </div>
        )}
        {model.status === "downloaded" && (
          <button
            onClick={onActivate}
            className="flex items-center gap-1.5 px-3 py-1.5 w-full justify-center bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors"
          >
            Activate
          </button>
        )}
        {model.status === "active" && (
          <div className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-indigo-400 text-xs font-medium">
            <Check size={12} />
            Currently active
          </div>
        )}
      </div>
    </div>
  );
}
