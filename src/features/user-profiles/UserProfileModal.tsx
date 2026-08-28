import React, { useState, useEffect } from 'react';
import { useUserProfile } from './UserProfileContext';
import { UserProfileCard } from './UserProfileCard';
import { UserProfileCreateForm } from './UserProfileCreateForm';
import { UserProfileCloudTab } from './UserProfileCloudTab';
import { X, Plus, Users, Cloud, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const UserProfileModal: React.FC = () => {
  const {
    profiles,
    activeProfileId,
    isProfileModalOpen,
    closeProfileModal,
    switchProfile,
    deleteProfile,
    renameProfile,
    syncSpecificProfile
  } = useUserProfile();

  const [activeTab, setActiveTab] = useState<'profiles' | 'cloud'>('profiles');
  const [isCreating, setIsCreating] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeProfileModal();
    };
    if (isProfileModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isProfileModalOpen, closeProfileModal]);

  if (!isProfileModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto"
      onClick={closeProfileModal}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-profile-modal-title"
        className="bg-[#182228] border border-white/10 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl text-[#f3f4f6] my-8 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <h3 id="user-profile-modal-title" className="text-base font-bold text-white">
              User Profiles & Cloud Sync
            </h3>
          </div>
          <button
            onClick={closeProfileModal}
            aria-label="Close"
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector (Simplified: Profiles & Cloud/Multiplayer) */}
        <div className="flex border-b border-white/10 bg-black/20 px-6 pt-2 gap-2 flex-shrink-0">
          <button
            onClick={() => setActiveTab('profiles')}
            className={`py-2 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'profiles'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Profiles ({profiles.length})
          </button>
          <button
            onClick={() => setActiveTab('cloud')}
            className={`py-2 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'cloud'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" /> Cloud & Multiplayer
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`mx-6 mt-4 p-2.5 rounded-xl text-xs flex items-center gap-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-950/70 border border-emerald-500/30 text-emerald-300'
                : 'bg-rose-950/70 border border-rose-500/30 text-rose-300'
            }`}
          >
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{feedback.msg}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {activeTab === 'profiles' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400 font-semibold">Local Profiles on This Device</span>
                {!isCreating && (
                  <button
                    onClick={() => setIsCreating(true)}
                    className="cg-pill cg-pill-active py-1 px-2.5 text-xs inline-flex items-center gap-1 font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" /> New Profile
                  </button>
                )}
              </div>

              {isCreating && (
                <UserProfileCreateForm
                  onSuccess={(name) => {
                    setIsCreating(false);
                    setFeedback({ type: 'success', msg: `Profile "${name}" created!` });
                  }}
                  onCancel={() => setIsCreating(false)}
                />
              )}

              <div className="space-y-2.5">
                {profiles.map(p => (
                  <UserProfileCard
                    key={p.id}
                    profile={p}
                    isActive={p.id === activeProfileId}
                    onSelect={() => switchProfile(p.id)}
                    onDelete={() => deleteProfile(p.id)}
                    onRename={(name) => renameProfile(p.id, name)}
                    onSync={async () => {
                      const ok = await syncSpecificProfile(p);
                      if (ok) setFeedback({ type: 'success', msg: `Saved "${p.name}" to cloud!` });
                      else setFeedback({ type: 'error', msg: 'Sync failed. Check internet connection.' });
                    }}
                    canDelete={profiles.length > 1}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'cloud' && <UserProfileCloudTab onFeedback={setFeedback} />}
        </div>
      </div>
    </div>
  );
};
