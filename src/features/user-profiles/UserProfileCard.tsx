import React, { useState } from 'react';
import { UserProfile } from './types';
import { getAvatarById } from './defaultProfiles';
import { Check, Cloud, Edit2, Trash2, CheckCircle2 } from 'lucide-react';

interface UserProfileCardProps {
  profile: UserProfile;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (newName: string) => void;
  onSync: () => void;
  canDelete: boolean;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({
  profile,
  isActive,
  onSelect,
  onDelete,
  onRename,
  onSync,
  canDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const avatar = getAvatarById(profile.avatar);
  const caughtCount = Object.values(profile.userProgress.caught || {}).filter(Boolean).length;
  const donatedCount = Object.values(profile.userProgress.donatedMuseum || {}).filter(Boolean).length;
  const offeredCount = Object.values(profile.userProgress.offeredTemple || {}).filter(Boolean).length;

  const handleSaveRename = () => {
    if (editName.trim()) {
      onRename(editName.trim());
    }
    setIsEditing(false);
  };

  const formattedDate = new Date(profile.updatedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div
      className={`p-3.5 rounded-2xl border transition-all ${
        isActive
          ? 'bg-gradient-to-br from-cyan-950/40 via-[#1d2b33] to-[#151f25] border-cyan-500/50 shadow-lg shadow-cyan-950/20'
          : 'bg-black/20 hover:bg-black/30 border-white/10'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left: Avatar & Info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${avatar.bgGradient} flex items-center justify-center text-xl shadow-md border ${avatar.borderColor} flex-shrink-0`}
          >
            <span>{avatar.emoji}</span>
          </div>

          <div className="min-w-0 flex-1">
            {isEditing ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveRename()}
                  className="bg-black/60 border border-cyan-400 rounded-lg px-2 py-0.5 text-xs text-white focus:outline-none w-full max-w-[140px]"
                  autoFocus
                />
                <button
                  onClick={handleSaveRename}
                  className="p-1 text-emerald-400 hover:text-emerald-300"
                  title="Save name"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-white truncate">{profile.name}</h4>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-neutral-400 hover:text-white p-0.5"
                  title="Rename"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                {isActive && (
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Active
                  </span>
                )}
              </div>
            )}

            {/* Stats Row */}
            <div className="flex items-center gap-2 text-[10px] text-neutral-400 mt-1">
              <span>🎣 <strong>{caughtCount}</strong>/69</span>
              <span>🏛️ <strong>{donatedCount}</strong></span>
              <span>✨ <strong>{offeredCount}</strong></span>
              <span className="text-[9px] opacity-60">• {formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {!isActive && (
            <button
              onClick={onSelect}
              className="cg-pill text-[11px] py-1 px-2.5 font-bold hover:text-white"
            >
              Switch
            </button>
          )}

          <button
            onClick={onSync}
            title="Sync this profile to GCP DB server"
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-neutral-300 hover:text-cyan-300 transition-colors"
          >
            <Cloud className="w-3.5 h-3.5" />
          </button>

          {canDelete && (
            confirmDelete ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={onDelete}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold px-2 py-1 rounded-lg"
                >
                  Delete
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="bg-neutral-700 text-neutral-300 text-[10px] px-1.5 py-1 rounded-lg"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                title="Delete Profile"
                className="p-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/30 text-rose-300 hover:text-rose-200 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
