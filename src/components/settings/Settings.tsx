import { useState } from "react";
import SettingsNav from "./SettingsNav";
import WatchedFoldersPanel from "./WatchedFoldersPanel";
import LocalLLMPanel from "./LocalLLMPanel";
import { Shield } from "lucide-react";

type SettingsCategory = "watched-folders" | "local-llm" | "encryption";

export const Settings = () => {
  const [active, setActive] = useState<SettingsCategory>("watched-folders");

  return (
    <div className="h-full flex overflow-hidden">
      <div className="w-[220px] shrink-0">
        <SettingsNav active={active} onSelect={setActive} />
      </div>

      <div className="flex-1 overflow-hidden">
        {active === "watched-folders" && <WatchedFoldersPanel />}
        {active === "local-llm" && <LocalLLMPanel />}
        {active === "encryption" && (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <Shield size={32} className="text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Encryption — coming soon
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
