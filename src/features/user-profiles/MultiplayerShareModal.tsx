import React, { useState, useMemo } from 'react';
import { useUserProfile } from './UserProfileContext';
import {
  encodeProgressionToken,
  decodeProgressionToken,
  generateShareUrl,
  mergeSharedProgress,
  payloadToUserProgress,
  SharedProgressionPayload
} from './shareProgressionUtils';
import { getAvatarById } from './defaultProfiles';
import { X, Share2, Download, Copy, Check, Sparkles, Landmark, Fish, Users, ArrowRight } from 'lucide-react';

interface MultiplayerShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'share' | 'import';
  onFeedback: (feedback: { type: 'success' | 'error'; msg: string }) => void;
}

export const MultiplayerShareModal: React.FC<MultiplayerShareModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'share',
  onFeedback
}) => {
  const { activeProfile, updateActiveProfile, createProfile } = useUserProfile();
  const [tab, setTab] = useState<'share' | 'import'>(initialTab);
  const [copiedType, setCopiedType] = useState<'link' | 'code' | null>(null);
  const [importInput, setImportInput] = useState('');

  // Sync tab state when modal opens or initialTab prop changes
  React.useEffect(() => {
    setTab(initialTab);
  }, [initialTab, isOpen]);

  // Generated token & URL for active profile
  const shareToken = useMemo(() => encodeProgressionToken(activeProfile), [activeProfile]);
  const shareUrl = useMemo(() => generateShareUrl(shareToken), [shareToken]);

  // Decoded payload for the import input
  const decodedPayload: SharedProgressionPayload | null = useMemo(() => {
    return decodeProgressionToken(importInput);
  }, [importInput]);

  if (!isOpen) return null;

  const caughtCount = Object.values(activeProfile.userProgress?.caught || {}).filter(Boolean).length;
  const museumCount = Object.values(activeProfile.userProgress?.donatedMuseum || {}).filter(Boolean).length;
  const templeCount = Object.values(activeProfile.userProgress?.offeredTemple || {}).filter(Boolean).length;

  const handleCopy = async (text: string, type: 'link' | 'code') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
      onFeedback({
        type: 'success',
        msg: type === 'link' ? '1-Click Share Link copied to clipboard!' : 'Base64 Progression Code copied!'
      });
    } catch {
      onFeedback({ type: 'error', msg: 'Failed to copy to clipboard' });
    }
  };

  const handleMerge = () => {
    if (!decodedPayload) return;
    const merged = mergeSharedProgress(activeProfile.userProgress, decodedPayload);
    updateActiveProfile({ userProgress: merged });
    onFeedback({
      type: 'success',
      msg: `Merged progress from ${decodedPayload.hostName} into "${activeProfile.name}"!`
    });
    setImportInput('');
    onClose();
  };

  const handleCreateNew = () => {
    if (!decodedPayload) return;
    const incomingProgress = payloadToUserProgress(decodedPayload);
    const newProfileName = `${decodedPayload.hostName}'s Co-Op`;
    createProfile(newProfileName, decodedPayload.avatar || 'diver');
    updateActiveProfile({
      userProgress: incomingProgress,
      gameState: {
        ...activeProfile.gameState,
        season: (decodedPayload.season || activeProfile.gameState.season),
        day: decodedPayload.day || activeProfile.gameState.day,
        fishingLevel: decodedPayload.fishingLevel || activeProfile.gameState.fishingLevel
      }
    });
    onFeedback({
      type: 'success',
      msg: `Created new profile "${newProfileName}" with host progress!`
    });
    setImportInput('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="multiplayer-share-title"
        className="bg-[#182228] border border-white/15 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl text-[#f3f4f6] flex flex-col my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-amber-400" />
            <h3 id="multiplayer-share-title" className="text-base font-bold text-white">
              Multiplayer Co-Op Progression
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-white/10 bg-black/20 px-5 pt-2 gap-2 flex-shrink-0">
          <button
            onClick={() => setTab('share')}
            className={`py-2 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              tab === 'share' ? 'border-amber-400 text-amber-300' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" /> Share My Progress
          </button>
          <button
            onClick={() => setTab('import')}
            className={`py-2 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              tab === 'import' ? 'border-amber-400 text-amber-300' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5" /> Import Host Progress
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs">
          {tab === 'share' ? (
            <div className="space-y-4">
              <p className="text-neutral-300 text-xs leading-relaxed">
                Playing multiplayer? Share your save progress (caught fish, museum, altars) with your co-op friends so they can sync up instantly.
              </p>

              {/* Progress Summary Pill */}
              <div className="p-3 bg-black/30 rounded-xl border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{getAvatarById(activeProfile.avatar).emoji}</span>
                  <div>
                    <h4 className="font-bold text-white text-xs">{activeProfile.name}</h4>
                    <span className="text-[10px] text-neutral-400">
                      {activeProfile.gameState.season} • Day {activeProfile.gameState.day}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Fish className="w-3 h-3" /> {caughtCount}/69
                  </span>
                  <span className="bg-amber-950/60 border border-amber-500/30 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> {templeCount}
                  </span>
                  <span className="bg-purple-950/60 border border-purple-500/30 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Landmark className="w-3 h-3" /> {museumCount}
                  </span>
                </div>
              </div>

              {/* Share Options */}
              <div className="space-y-2.5">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-2">
                  <span className="font-bold text-white text-xs block">🔗 1-Click Shareable Link</span>
                  <p className="text-[11px] text-neutral-400">
                    Send this link to your friends. Opening it will prompt them to import your progress directly.
                  </p>
                  <button
                    onClick={() => handleCopy(shareUrl, 'link')}
                    className="w-full cg-pill cg-pill-active py-2 px-3 text-xs font-bold flex items-center justify-center gap-2"
                  >
                    {copiedType === 'link' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedType === 'link' ? 'Link Copied!' : 'Copy 1-Click Share Link'}</span>
                  </button>
                </div>

                <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-2">
                  <span className="font-bold text-white text-xs block">📋 Base64 Progression Code</span>
                  <p className="text-[11px] text-neutral-400">
                    Compact text code for pasting into Discord, WhatsApp, or in-game chat.
                  </p>
                  <button
                    onClick={() => handleCopy(shareToken, 'code')}
                    className="w-full bg-black/40 hover:bg-black/60 text-neutral-200 border border-white/15 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    {copiedType === 'code' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedType === 'code' ? 'Code Copied!' : 'Copy Base64 Progression Code'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              <p className="text-neutral-300 text-xs">
                Paste a <strong>Share Link</strong> or <strong>Base64 Progression Code</strong> from your multiplayer host below:
              </p>

              <textarea
                value={importInput}
                onChange={(e) => setImportInput(e.target.value)}
                placeholder="Paste share link (http://.../?share=...) or Base64 code here..."
                rows={3}
                className="w-full p-2.5 bg-black/50 border border-white/20 rounded-xl text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400"
              />

              {/* Decoded Host Preview */}
              {decodedPayload && (
                <div className="p-3 bg-amber-950/30 border border-amber-500/40 rounded-xl space-y-2.5 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getAvatarById(decodedPayload.avatar).emoji}</span>
                      <div>
                        <h4 className="font-bold text-white text-xs">{decodedPayload.hostName}</h4>
                        <span className="text-[10px] text-amber-300/80">
                          {decodedPayload.season || 'Spring'} • Day {decodedPayload.day || 1} • Level {decodedPayload.fishingLevel || 1}
                        </span>
                      </div>
                    </div>
                    <span className="bg-amber-400/20 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-400/30">
                      Host Save
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-amber-500/20 text-center">
                    <div className="p-1.5 rounded-lg bg-black/30">
                      <span className="text-[10px] text-neutral-400 block">Caught</span>
                      <strong className="text-cyan-300 text-xs">{decodedPayload.caught?.length || 0}/69</strong>
                    </div>
                    <div className="p-1.5 rounded-lg bg-black/30">
                      <span className="text-[10px] text-neutral-400 block">Temple</span>
                      <strong className="text-amber-300 text-xs">{decodedPayload.offeredTemple?.length || 0}</strong>
                    </div>
                    <div className="p-1.5 rounded-lg bg-black/30">
                      <span className="text-[10px] text-neutral-400 block">Museum</span>
                      <strong className="text-purple-300 text-xs">{decodedPayload.donatedMuseum?.length || 0}</strong>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={handleMerge}
                      className="cg-pill cg-pill-active py-2 px-3 text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>Merge into "{activeProfile.name}"</span>
                    </button>
                    <button
                      onClick={handleCreateNew}
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/20 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Users className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Create New Co-Op Profile</span>
                    </button>
                  </div>
                </div>
              )}

              {importInput.trim().length > 0 && !decodedPayload && (
                <p className="text-rose-400 text-[11px] font-semibold">
                  ⚠️ Invalid progression code or link. Please check that the entire code was copied.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
