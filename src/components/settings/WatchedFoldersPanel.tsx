import { useState, useEffect } from "react";
import { Pause, Play, Trash2, FolderOpen } from "lucide-react";
import {
  getWatchedFolders,
  addWatchedFolder,
  removeWatchedFolder,
  toggleFolderPause,
  WatchedFolder,
} from "@/lib/tauri";
import { open } from "@tauri-apps/plugin-dialog";

export const WatchedFoldersPanel = () => {
  const [folders, setFolders] = useState<WatchedFolder[]>([]);

  useEffect(() => {
    getWatchedFolders().then(setFolders).catch(console.error);
  }, []);

  const handleAdd = async () => {
    const path = await open({ directory: true, multiple: false });
    if (!path) return;
    try {
      const folder = await addWatchedFolder(path as string);
      setFolders((prev) => [...prev, folder]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await removeWatchedFolder(id);
      setFolders((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePause = async (id: string) => {
    try {
      const updated = await toggleFolderPause(id);
      setFolders((prev) => prev.map((f) => (f.id === id ? updated : f)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-border shrink-0">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Watched Folders
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              VaultAI monitors these folders and automatically ingests new
              files.
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-lg transition-colors hover:opacity-90 shrink-0"
          >
            Add Folder
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        {folders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3">
            <FolderOpen size={28} className="text-muted-foreground" />
            <p className="text-xs text-muted-foreground text-center">
              No folders watched yet.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {folders.map((folder) => (
              <div
                key={folder.id}
                className="flex items-center gap-3 px-4 py-3 bg-card border border-border rounded-xl"
              >
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    folder.is_paused ? "bg-amber-500" : "bg-green-500"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-foreground truncate">
                    {folder.path}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {folder.is_paused ? "Paused" : "Active"}
                  </p>
                </div>
                <button
                  onClick={() => handleTogglePause(folder.id)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  {folder.is_paused ? <Play size={13} /> : <Pause size={13} />}
                </button>
                <button
                  onClick={() => handleRemove(folder.id)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchedFoldersPanel;
