import React from 'react';
import { useUserProfile } from './UserProfileContext';
import { Cloud, CloudOff, RefreshCw, AlertCircle, HardDrive } from 'lucide-react';

interface CloudSyncIndicatorProps {
  compact?: boolean;
  showText?: boolean;
}

export const CloudSyncIndicator: React.FC<CloudSyncIndicatorProps> = ({
  compact = false,
  showText = true
}) => {
  const { cloudSyncStatus, lastSyncError, openProfileModal } = useUserProfile();

  const getStatusConfig = () => {
    switch (cloudSyncStatus) {
      case 'synced':
        return {
          icon: Cloud,
          iconClass: 'text-emerald-400',
          dotClass: 'bg-emerald-500 shadow-emerald-500/50',
          badgeClass: 'border-emerald-500/30 bg-emerald-950/40 text-emerald-300',
          label: 'GCP Synced',
          tooltip: 'All progress saved to db.dunhas.com'
        };
      case 'syncing':
        return {
          icon: RefreshCw,
          iconClass: 'text-sky-400 animate-spin',
          dotClass: 'bg-sky-500 animate-pulse shadow-sky-500/50',
          badgeClass: 'border-sky-500/30 bg-sky-950/40 text-sky-300',
          label: 'Syncing...',
          tooltip: 'Saving to GCP DB server...'
        };
      case 'error':
        return {
          icon: AlertCircle,
          iconClass: 'text-rose-400',
          dotClass: 'bg-rose-500 shadow-rose-500/50',
          badgeClass: 'border-rose-500/30 bg-rose-950/40 text-rose-300',
          label: 'Sync Error',
          tooltip: lastSyncError || 'Failed to sync with cloud DB'
        };
      case 'offline':
        return {
          icon: CloudOff,
          iconClass: 'text-amber-400',
          dotClass: 'bg-amber-500 shadow-amber-500/50',
          badgeClass: 'border-amber-500/30 bg-amber-950/40 text-amber-300',
          label: 'Offline',
          tooltip: 'Working in offline mode (local storage cached)'
        };
      case 'local_only':
      default:
        return {
          icon: HardDrive,
          iconClass: 'text-neutral-400',
          dotClass: 'bg-neutral-500',
          badgeClass: 'border-white/10 bg-white/5 text-neutral-300',
          label: 'Local Save',
          tooltip: 'Saved locally on this browser'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  if (compact) {
    return (
      <button
        onClick={openProfileModal}
        title={config.tooltip}
        aria-label={config.label}
        className="relative flex items-center justify-center p-1 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
      >
        <Icon className={`w-3.5 h-3.5 ${config.iconClass}`} />
        <span className={`absolute top-0 right-0 w-1.5 h-1.5 rounded-full shadow ${config.dotClass}`} />
      </button>
    );
  }

  return (
    <button
      onClick={openProfileModal}
      title={config.tooltip}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all hover:bg-white/10 ${config.badgeClass}`}
    >
      <Icon className={`w-3 h-3 ${config.iconClass}`} />
      {showText && <span>{config.label}</span>}
      <span className={`w-1.5 h-1.5 rounded-full shadow ${config.dotClass}`} />
    </button>
  );
};
