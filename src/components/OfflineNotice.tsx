import React from 'react';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';

interface OfflineNoticeProps {
  isOffline: boolean;
  onToggleSimulatedOffline?: () => void;
  isSimulated?: boolean;
}

export const OfflineNotice: React.FC<OfflineNoticeProps> = ({
  isOffline,
  onToggleSimulatedOffline,
  isSimulated
}) => {
  if (!isOffline) {
    return null;
  }

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 text-xs text-amber-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Offline Mode Active:</strong> You are viewing cached festival results and winners. Voting actions will sync when reconnected.
          </span>
        </div>

        {onToggleSimulatedOffline && (
          <button
            onClick={onToggleSimulatedOffline}
            className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-mono text-[11px] whitespace-nowrap transition-colors"
          >
            {isSimulated ? 'Exit Offline Simulation' : 'Toggle Online'}
          </button>
        )}
      </div>
    </div>
  );
};
