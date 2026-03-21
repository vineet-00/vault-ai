import { Shield, ShieldCheck, ShieldAlert, Key } from "lucide-react";
import type {
  EncryptionSettings,
  KeyStrength,
  StorageInfo,
} from "@/../product/sections/settings/types";

interface EncryptionPanelProps {
  settings: EncryptionSettings;
  storageInfo: StorageInfo;
  onToggle?: (enabled: boolean) => void;
  onChangeKey?: () => void;
}

const strengthConfig: Record<
  KeyStrength,
  {
    label: string;
    color: string;
    bars: number;
    textColor: string;
  }
> = {
  weak: {
    label: "Weak",
    color: "bg-red-500",
    bars: 1,
    textColor: "text-red-500",
  },
  moderate: {
    label: "Moderate",
    color: "bg-amber-500",
    bars: 2,
    textColor: "text-amber-500",
  },
  strong: {
    label: "Strong",
    color: "bg-emerald-500",
    bars: 3,
    textColor: "text-emerald-500",
  },
};

export function EncryptionPanel({
  settings,
  storageInfo,
  onToggle,
  onChangeKey,
}: EncryptionPanelProps) {
  const strength = strengthConfig[settings.keyStrength];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-5 border-b border-zinc-800 shrink-0">
        <h2 className="text-sm font-semibold text-zinc-100">Encryption</h2>
        <p className="text-xs text-zinc-500 mt-1">
          Encrypt your vault with AES-256-GCM. All data stays on your device.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Encryption toggle */}
        <div className="flex items-start justify-between gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="flex items-start gap-3">
            {settings.enabled ? (
              <ShieldCheck
                size={20}
                className="text-emerald-500 shrink-0 mt-0.5"
              />
            ) : (
              <ShieldAlert
                size={20}
                className="text-zinc-600 shrink-0 mt-0.5"
              />
            )}
            <div>
              <p className="text-sm font-medium text-zinc-100">
                Vault Encryption
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">
                {settings.enabled
                  ? `Enabled · ${settings.algorithm} · Last changed ${settings.lastChanged}`
                  : "Your vault is not encrypted. Enable to secure your data."}
              </p>
            </div>
          </div>

          {/* Toggle switch */}
          <button
            onClick={() => onToggle?.(!settings.enabled)}
            className={`
              relative w-10 h-5.5 rounded-full transition-colors shrink-0 mt-0.5
              ${settings.enabled ? "bg-indigo-600" : "bg-zinc-700"}
            `}
            style={{ height: "22px", width: "40px" }}
          >
            <span
              className={`
              absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform
              ${settings.enabled ? "translate-x-5" : "translate-x-0.5"}
            `}
            />
          </button>
        </div>

        {/* Key strength + change key */}
        {settings.enabled && (
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key size={14} className="text-zinc-500" />
                <p className="text-xs font-medium text-zinc-300">
                  Encryption Key
                </p>
              </div>
              <button
                onClick={onChangeKey}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                Change Key
              </button>
            </div>

            {/* Strength meter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-zinc-600">Key strength</p>
                <p
                  className={`text-[11px] font-semibold ${strength.textColor}`}
                >
                  {strength.label}
                </p>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3].map((bar) => (
                  <div
                    key={bar}
                    className={`
                      h-1.5 flex-1 rounded-full transition-colors
                      ${bar <= strength.bars ? strength.color : "bg-zinc-800"}
                    `}
                  />
                ))}
              </div>
              <p className="text-[10px] text-zinc-700">
                Algorithm: {settings.algorithm}
              </p>
            </div>
          </div>
        )}

        {/* Info card */}
        <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
          <div className="flex items-start gap-3">
            <Shield size={15} className="text-zinc-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-medium text-zinc-400">
                Zero-knowledge encryption
              </p>
              <p className="text-[11px] text-zinc-600 leading-relaxed">
                Your encryption key never leaves your device. Anthropic and no
                third party can access your vault data. If you lose your key,
                your data cannot be recovered.
              </p>
            </div>
          </div>
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
          <div>
            <p className="text-[10px] text-zinc-600">Documents</p>
            <p className="text-xs text-zinc-400">{storageInfo.documentCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
