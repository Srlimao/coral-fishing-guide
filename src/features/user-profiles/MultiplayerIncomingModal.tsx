import React, { useState, useEffect } from 'react';
import { useUserProfile } from './UserProfileContext';
import {
  decodeProgressionToken,
  mergeSharedProgress,
  payloadToUserProgress,
  SharedProgressionPayload
} from './shareProgressionUtils';
import { getAvatarById } from './defaultProfiles';
import { Users, Sparkles, Landmark, Fish, ArrowRight, X, UserPlus } from 'lucide-react';

export const MultiplayerIncomingModal: React.FC = () => {
  const { activeProfile, updateActiveProfile, createProfile } = useUserProfile();
  const [incomingPayload, setIncomingPayload] = useState<SharedProgressionPayload | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const shareParam = urlParams.get('share');
    const hash = window.location.hash;

    let token = shareParam;
    if (!token && hash.includes('share=')) {
      token = hash.split('share=')[1].split('&')[0];
    }

    if (token) {
      const decoded = decodeProgressionToken(token);
      if (decoded) {
        setIncomingPayload(decoded);
        setIsOpen(true);
      }
    }
  }, []);

  const cleanUrlParam = () => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.delete('share');
    if (url.hash.includes('share=')) {
      url.hash = '';
    }
    window.history.replaceState({}, document.title, url.pathname + (url.search ? url.search : ''));
  };

  const handleDismiss = () => {
    cleanUrlParam();
    setIsOpen(false);
    setIncomingPayload(null);
  };

  const handleMerge = () => {
    if (!incomingPayload) return;
    const merged = mergeSharedProgress(activeProfile.userProgress, incomingPayload);
    updateActiveProfile({ userProgress: merged });
    handleDismiss();
  };

  const handleCreateNew = () => {
    if (!incomingPayload) return;
    const incomingProgress = payloadToUserProgress(incomingPayload);
    const newProfileName = `${incomingPayload.hostName}'s Co-Op`;
    createProfile(newProfileName, incomingPayload.avatar || 'diver');
    updateActiveProfile({
      userProgress: incomingProgress,
      gameState: {
        ...activeProfile.gameState,
        season: (incomingPayload.season || activeProfile.gameState.season),
        day: incomingPayload.day || activeProfile.gameState.day,
        fishingLevel: incomingPayload.fishingLevel || activeProfile.gameState.fishingLevel
      }
    });
    handleDismiss();
  };

  if (!isOpen || !incomingPayload) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={handleDismiss}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="incoming-share-title"
        className="bg-[#182228] border-2 border-amber-400/60 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl text-[#f3f4f6] flex flex-col my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-amber-500/10 border-b border-amber-500/20">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <h3 id="incoming-share-title" className="text-base font-bold text-white">
              Multiplayer Progression Received!
            </h3>
          </div>
          <button
            onClick={handleDismiss}
            aria-label="Dismiss"
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <p className="text-neutral-300 leading-relaxed">
            Your co-op host has shared their game progression with you:
          </p>

          {/* Host Card */}
          <div className="p-3.5 bg-black/40 border border-amber-400/30 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{getAvatarById(incomingPayload.avatar).emoji}</span>
                <div>
                  <h4 className="font-bold text-white text-sm">{incomingPayload.hostName}</h4>
                  <span className="text-[11px] text-amber-300/90 font-medium">
                    {incomingPayload.season || 'Spring'} • Day {incomingPayload.day || 1} • Level {incomingPayload.fishingLevel || 1}
                  </span>
                </div>
              </div>
              <span className="bg-amber-400/20 text-amber-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-400/40">
                Co-Op Host
              </span>
            </div>

            {/* Checklist Counts */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
              <div className="p-2 rounded-lg bg-white/5">
                <span className="text-[10px] text-neutral-400 block flex items-center justify-center gap-1">
                  <Fish className="w-3 h-3 text-cyan-400" /> Caught
                </span>
                <strong className="text-cyan-300 text-xs font-bold">{incomingPayload.caught?.length || 0}/69</strong>
              </div>
              <div className="p-2 rounded-lg bg-white/5">
                <span className="text-[10px] text-neutral-400 block flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Altars
                </span>
                <strong className="text-amber-300 text-xs font-bold">{incomingPayload.offeredTemple?.length || 0}</strong>
              </div>
              <div className="p-2 rounded-lg bg-white/5">
                <span className="text-[10px] text-neutral-400 block flex items-center justify-center gap-1">
                  <Landmark className="w-3 h-3 text-purple-400" /> Museum
                </span>
                <strong className="text-purple-300 text-xs font-bold">{incomingPayload.donatedMuseum?.length || 0}</strong>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleMerge}
              className="w-full cg-pill cg-pill-active py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Merge into Current Profile ("{activeProfile.name}")</span>
            </button>
            <button
              onClick={handleCreateNew}
              className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <UserPlus className="w-4 h-4 text-cyan-400" />
              <span>Create as New Co-Op Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
