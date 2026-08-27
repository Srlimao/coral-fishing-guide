import React, { useState, useEffect } from 'react';
import { useUserProfile } from './UserProfileContext';
import { checkDbHealth } from './userProfileApi';
import { UserProfile } from './types';
import { MultiplayerShareModal } from './MultiplayerShareModal';
import { Cloud, HardDriveDownload, RefreshCw, X, Share2, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface UserProfileCloudTabProps {
  onFeedback: (feedback: { type: 'success' | 'error'; msg: string }) => void;
}

export const UserProfileCloudTab: React.FC<UserProfileCloudTabProps> = ({ onFeedback }) => {
  const {
    activeProfile,
    dbConfig,
    syncActiveProfile,
    pullCloudProfile,
    pullAllCloudProfiles,
    deleteCloudProfileDoc
  } = useUserProfile();

  const [cloudProfiles, setCloudProfiles] = useState<UserProfile[]>([]);
  const [isLoadingCloud, setIsLoadingCloud] = useState(false);
  const [healthStatus, setHealthStatus] = useState<{ ok: boolean } | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareModalTab, setShareModalTab] = useState<'share' | 'import'>('share');

  const handleLoadCloudProfiles = async () => {
    setIsLoadingCloud(true);
    try {
      const list = await pullAllCloudProfiles();
      setCloudProfiles(list);
      const health = await checkDbHealth(dbConfig);
      setHealthStatus({ ok: health.ok });
    } catch {
      onFeedback({ type: 'error', msg: 'Failed to connect to cloud service' });
    } finally {
      setIsLoadingCloud(false);
    }
  };

  useEffect(() => {
    handleLoadCloudProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleManualSync = async () => {
    setIsLoadingCloud(true);
    const ok = await syncActiveProfile();
    setIsLoadingCloud(false);
    if (ok) {
      onFeedback({ type: 'success', msg: `Backed up "${activeProfile.name}" to cloud!` });
      handleLoadCloudProfiles();
    } else {
      onFeedback({ type: 'error', msg: 'Cloud sync failed. Check internet connection.' });
    }
  };

  const handleImportCloudProfile = async (id: string) => {
    setIsLoadingCloud(true);
    const ok = await pullCloudProfile(id);
    setIsLoadingCloud(false);
    if (ok) {
      onFeedback({ type: 'success', msg: 'Cloud profile downloaded and set as active!' });
    } else {
      onFeedback({ type: 'error', msg: 'Failed to import cloud profile' });
    }
  };

  return (
    <div className="space-y-4">
      {/* Multiplayer Co-Op Feature Card */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
            <Share2 className="w-4 h-4" />
            <span>Multiplayer Co-Op Sharing</span>
          </div>
          <p className="text-[11px] text-neutral-300">
            Share progression with co-op friends via 1-click links or Base64 codes.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              setShareModalTab('share');
              setIsShareModalOpen(true);
            }}
            className="flex-1 sm:flex-initial cg-pill cg-pill-active py-1.5 px-3 text-xs font-bold flex items-center justify-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
          <button
            onClick={() => {
              setShareModalTab('import');
              setIsShareModalOpen(true);
            }}
            className="flex-1 sm:flex-initial bg-white/10 hover:bg-white/20 text-white border border-white/20 py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <HardDriveDownload className="w-3.5 h-3.5" />
            <span>Import</span>
          </button>
        </div>
      </div>

      {/* Cloud Backup Status Bar */}
      <div className="p-3.5 rounded-2xl bg-black/20 border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Cloud className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Cloud Backup & Sync</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                  healthStatus?.ok ? 'text-emerald-400' : 'text-neutral-400'
                }`}
              >
                {healthStatus?.ok ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Cloud Connected</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3 h-3 text-neutral-400" />
                    <span>Local Mode</span>
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleManualSync}
          disabled={isLoadingCloud}
          className="cg-pill text-xs py-1.5 px-3 font-bold flex items-center gap-1.5"
        >
          <Cloud className="w-3.5 h-3.5 text-cyan-300" />
          <span>Save to Cloud</span>
        </button>
      </div>

      {/* Cloud Profiles Explorer */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-300 font-semibold">Your Cloud Saves</span>
          <button
            onClick={handleLoadCloudProfiles}
            disabled={isLoadingCloud}
            className="text-xs text-cyan-300 hover:text-cyan-200 inline-flex items-center gap-1 font-semibold"
          >
            <RefreshCw className={`w-3 h-3 ${isLoadingCloud ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {cloudProfiles.length === 0 ? (
          <div className="p-4 rounded-xl border border-white/5 bg-black/10 text-center text-neutral-400 space-y-1">
            <p>No cloud backup saves found for this account.</p>
            <p className="text-[10px] text-neutral-500">
              Click "Save to Cloud" above to back up your active profile.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {cloudProfiles.map(cp => (
              <div
                key={cp.id}
                className="p-3 rounded-xl border border-white/10 bg-black/25 flex items-center justify-between"
              >
                <div>
                  <h5 className="text-xs font-bold text-white">{cp.name}</h5>
                  <p className="text-[10px] text-neutral-400">
                    🎣 {Object.values(cp.userProgress?.caught || {}).filter(Boolean).length}/69 Fish • Level{' '}
                    {cp.gameState?.fishingLevel || 1}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleImportCloudProfile(cp.id)}
                    className="cg-pill text-xs py-1 px-2.5 font-bold flex items-center gap-1"
                    title="Download and restore this save"
                  >
                    <HardDriveDownload className="w-3.5 h-3.5" />
                    <span>Restore</span>
                  </button>
                  <button
                    onClick={async () => {
                      await deleteCloudProfileDoc(cp.id);
                      handleLoadCloudProfiles();
                    }}
                    className="text-rose-400 hover:text-rose-300 p-1"
                    title="Delete cloud backup"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Multiplayer Share Modal */}
      <MultiplayerShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        initialTab={shareModalTab}
        onFeedback={onFeedback}
      />
    </div>
  );
};
