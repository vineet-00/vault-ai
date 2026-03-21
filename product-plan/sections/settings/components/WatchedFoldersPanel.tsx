import { Plus, Pause, Play, Trash2, FolderOpen } from "lucide-react";
import type {
  WatchedFolder,
  StorageInfo,
} from "@/../product/sections/settings/types";

interface WatchedFoldersPanelProps {
  folders: WatchedFolder[];
  storageInfo: StorageInfo;
  onAddFolder?: () => void;
  onRemoveFolder?: (id: string) => void;
  onTogglePause?: (id: string) => void;
}

const statusConfig = {
  active: { dot: "bg-emerald-500", label: "Active" },
  indexing: { dot: "bg-blue-500 animate-pulse", label: "Indexing..." },
  paused: { dot: "bg-amber-500", label: "Paused" },
  error: { dot: "bg-red-500", label: "Error" },
};

export function WatchedFoldersPanel({
  folders,
  storageInfo,
  onAddFolder,
  onRemoveFolder,
  onTogglePause,
}: WatchedFoldersPanelProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-5 border-b border-zinc-800 shrink-0">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-sm font-semibold text-zinc-100">
              Watched Folders
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              VaultAI monitors these folders and automatically ingests new
              files.
            </p>
          </div>
          <button
            onClick={onAddFolder}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors shrink-0"
          >
            <Plus size={13} />
            Add Folder
          </button>
        </div>
      </div>

      {/* Folder list */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {folders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3">
            <FolderOpen size={28} className="text-zinc-700" />
            <p className="text-xs text-zinc-600 text-center">
              No folders watched yet.
              <br />
              Add a folder to start auto-ingesting files.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {folders.map((folder) => {
              const status = statusConfig[folder.status];
              return (
                <div
                  key={folder.id}
                  className="flex items-center gap-3 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl group"
                >
                  {/* Status dot */}
                  <div
                    title={status.label}
                    className={`w-2 h-2 rounded-full shrink-0 ${status.dot}`}
                  />

                  {/* Path + meta */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono text-zinc-300 truncate">
                      {folder.path}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[10px] text-zinc-600">
                        {status.label}
                      </span>
                      <span className="text-[10px] text-zinc-700">
                        {folder.fileCount} files
                      </span>
                      {folder.lastSynced && (
                        <span className="text-[10px] text-zinc-700 font-mono">
                          Last synced{" "}
                          {new Date(folder.lastSynced).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onTogglePause?.(folder.id)}
                      title={folder.isPaused ? "Resume" : "Pause"}
                      className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                    >
                      {folder.isPaused ? (
                        <Play size={13} />
                      ) : (
                        <Pause size={13} />
                      )}
                    </button>
                    <button
                      onClick={() => onRemoveFolder?.(folder.id)}
                      title="Remove folder"
                      className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Storage info footer */}
      <StorageFooter info={storageInfo} />
    </div>
  );
}

function StorageFooter({ info }: { info: StorageInfo }) {
  return (
    <div className="px-6 py-4 border-t border-zinc-800 shrink-0">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 mb-2">
        Storage
      </p>
      <div className="flex items-center gap-6">
        <div>
          <p className="text-[10px] text-zinc-600">Vault path</p>
          <p className="text-xs font-mono text-zinc-400">{info.vaultPath}</p>
        </div>
        <div>
          <p className="text-[10px] text-zinc-600">Total size</p>
          <p className="text-xs text-zinc-400">{info.totalSize}</p>
        </div>
        <div>
          <p className="text-[10px] text-zinc-600">Documents</p>
          <p className="text-xs text-zinc-400">{info.documentCount}</p>
        </div>
        <div>
          <p className="text-[10px] text-zinc-600">Embeddings</p>
          <p className="text-xs text-zinc-400">{info.embeddingSize}</p>
        </div>
      </div>
    </div>
  );
}
