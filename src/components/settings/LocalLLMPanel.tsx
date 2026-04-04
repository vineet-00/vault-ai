import { useEffect, useState } from "react";
import { getOllamaModels, OllamaModel } from "@/lib/tauri";
import { Bot } from "lucide-react";

export const LocalLLMPanel = () => {
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeModel, setActiveModel] = useState("llama3.2");

  useEffect(() => {
    getOllamaModels()
      .then(setModels)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatSize = (bytes: number) => {
    const gb = bytes / 1024 / 1024 / 1024;
    return `${gb.toFixed(1)} GB`;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-border shrink-0">
        <h2 className="text-sm font-semibold text-foreground">Local LLM</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Choose which model powers your AI assistant. All models run on your
          device.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        {loading ? (
          <p className="text-xs text-muted-foreground">Loading models...</p>
        ) : models.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3">
            <Bot size={28} className="text-muted-foreground" />
            <p className="text-xs text-muted-foreground text-center">
              No models found. Pull a model using Ollama.
            </p>
            <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
              ollama pull phi3:mini
            </code>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {models.map((model) => (
              <div
                key={model.name}
                className={`flex flex-col gap-2 p-4 rounded-xl border transition-colors ${
                  activeModel === model.name
                    ? "bg-primary/10 border-primary/30"
                    : "bg-card border-border hover:border-muted-foreground"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-semibold text-foreground">
                    {model.name}
                  </p>
                  {activeModel === model.name && (
                    <span className="text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full shrink-0">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground font-mono">
                  {formatSize(model.size)}
                </p>
                {activeModel !== model.name && (
                  <button
                    onClick={() => setActiveModel(model.name)}
                    className="mt-1 px-3 py-1.5 w-full text-center bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Activate
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocalLLMPanel;
