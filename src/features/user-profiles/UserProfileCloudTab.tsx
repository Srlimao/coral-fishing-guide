import React, { useState } from 'react';
import { useUserProfile } from './UserProfileContext';
import { useAuth } from '../auth/AuthContext';
import { MultiplayerShareModal } from './MultiplayerShareModal';
import {
  Cloud,
  HardDriveDownload,
  Share2,
  CheckCircle2,
  LogIn,
  UserPlus,
  LogOut,
  UserCheck,
  RotateCw,
  Trash2
} from 'lucide-react';

interface UserProfileCloudTabProps {
  onFeedback: (feedback: { type: 'success' | 'error'; msg: string }) => void;
}

export const UserProfileCloudTab: React.FC<UserProfileCloudTabProps> = ({ onFeedback }) => {
  const {
    profiles,
    activeProfileId,
    restoreAccountProfiles
  } = useUserProfile();

  const {
    account,
    session,
    isAuthenticated,
    openLoginModal,
    openRegisterModal,
    logout,
    syncAccountData
  } = useAuth();

  const [isSyncing, setIsSyncing] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareModalTab, setShareModalTab] = useState<'share' | 'import'>('share');

  const handleAccountSync = async () => {
    if (!isAuthenticated) return;
    setIsSyncing(true);
    const ok = await syncAccountData(profiles, activeProfileId);
    setIsSyncing(false);
    if (ok) {
      onFeedback({ type: 'success', msg: `Synced ${profiles.length} profile(s) to @${session?.username}!` });
    } else {
      onFeedback({ type: 'error', msg: 'Failed to sync with account. Check connection.' });
    }
  };

  const handleRestoreFromAccount = (profileId: string) => {
    if (!account || !account.profiles) return;
    restoreAccountProfiles(account.profiles, profileId);
    onFeedback({ type: 'success', msg: 'Restored account profiles!' });
  };

  const handleDeleteProfileFromAccount = async (profileId: string) => {
    if (!account) return;
    if (account.profiles.length <= 1) {
      onFeedback({ type: 'error', msg: 'Cannot delete the only profile in your account.' });
      return;
    }
    const nextProfiles = account.profiles.filter(p => p.id !== profileId);
    const nextActiveId = account.activeProfileId === profileId ? nextProfiles[0].id : account.activeProfileId;
    const ok = await syncAccountData(nextProfiles, nextActiveId);
    if (ok) {
      restoreAccountProfiles(nextProfiles, nextActiveId);
      onFeedback({ type: 'success', msg: 'Deleted profile from cloud account.' });
    } else {
      onFeedback({ type: 'error', msg: 'Failed to update account data.' });
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

      {/* Account Cloud Status */}
      {isAuthenticated && account && session ? (
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white">@{session.username}</h4>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Private Vault
                  </span>
                </div>
                <span className="text-[10px] text-neutral-400">
                  {account.profiles?.length || 1} profile(s) synced • Last updated{' '}
                  {new Date(account.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAccountSync}
                disabled={isSyncing}
                className="cg-pill text-xs py-1.5 px-3 font-bold flex items-center gap-1.5"
                title="Sync local changes to cloud account"
              >
                <RotateCw className={`w-3.5 h-3.5 text-cyan-300 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Save to Cloud'}</span>
              </button>
              <button
                onClick={logout}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-rose-950/50 hover:text-rose-300 border border-white/10 text-neutral-400 transition-colors"
                title="Log out from cloud vault"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Account Cloud Profiles List */}
          <div className="space-y-2">
            <span className="text-xs text-neutral-300 font-semibold block">Your Private Cloud Saves</span>
            <div className="space-y-2">
              {(account.profiles || []).map(cp => {
                const count = Object.values(cp.userProgress?.caught || {}).filter(Boolean).length;
                return (
                  <div
                    key={cp.id}
                    className="p-3 rounded-xl border border-white/10 bg-black/25 flex items-center justify-between"
                  >
                    <div>
                      <h5 className="text-xs font-bold text-white">{cp.name}</h5>
                      <p className="text-[10px] text-neutral-400">
                        🎣 {count}/69 Fish • {cp.gameState?.season || 'Spring'} Day {cp.gameState?.day || 1}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRestoreFromAccount(cp.id)}
                        className="cg-pill text-xs py-1 px-2.5 font-bold flex items-center gap-1"
                        title="Restore this profile as active"
                      >
                        <HardDriveDownload className="w-3.5 h-3.5" />
                        <span>Restore</span>
                      </button>
                      {(account.profiles || []).length > 1 && (
                        <button
                          onClick={() => handleDeleteProfileFromAccount(cp.id)}
                          className="text-rose-400 hover:text-rose-300 p-1"
                          title="Delete from cloud"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Guest / Not Logged In State */
        <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center text-cyan-400">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Private Cloud Vault & Account</h4>
              <p className="text-[11px] text-neutral-400">
                Log in or register to sync your fishing progress privately across all your devices.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={openLoginModal}
              className="cg-pill cg-pill-active py-2 px-3 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              onClick={openRegisterModal}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5 text-cyan-300" />
              <span>Create Account</span>
            </button>
          </div>
        </div>
      )}

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
