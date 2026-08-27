import React, { useState } from 'react';
import { useUserProfile } from './UserProfileContext';
import { AVATAR_OPTIONS } from './defaultProfiles';

interface UserProfileCreateFormProps {
  onSuccess: (profileName: string) => void;
  onCancel: () => void;
}

export const UserProfileCreateForm: React.FC<UserProfileCreateFormProps> = ({
  onSuccess,
  onCancel
}) => {
  const { createProfile, activeProfile } = useUserProfile();
  const [newProfileName, setNewProfileName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('fisherman');
  const [cloneCurrent, setCloneCurrent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;
    createProfile(newProfileName.trim(), selectedAvatar, cloneCurrent);
    onSuccess(newProfileName.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 rounded-2xl bg-black/30 border border-cyan-500/30 space-y-3">
      <h4 className="font-bold text-white text-xs">Create New Player Profile</h4>
      <div>
        <label className="text-[11px] text-neutral-300 block mb-1">Farmer / Profile Name</label>
        <input
          type="text"
          placeholder="e.g. Farmer Luna, Year 2 Run..."
          value={newProfileName}
          onChange={(e) => setNewProfileName(e.target.value)}
          className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
          autoFocus
        />
      </div>

      <div>
        <label className="text-[11px] text-neutral-300 block mb-1">Choose Avatar</label>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
          {AVATAR_OPTIONS.map(avatar => (
            <button
              type="button"
              key={avatar.id}
              onClick={() => setSelectedAvatar(avatar.id)}
              className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all ${
                selectedAvatar === avatar.id
                  ? 'bg-white/20 border-cyan-400 scale-105 shadow-md'
                  : 'border-white/10 hover:bg-white/10'
              }`}
            >
              <span className="text-base">{avatar.emoji}</span>
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer text-[11px] text-neutral-300 pt-1">
        <input
          type="checkbox"
          checked={cloneCurrent}
          onChange={(e) => setCloneCurrent(e.target.checked)}
          className="rounded accent-cyan-400"
        />
        <span>Copy caught checklist from active profile ({activeProfile.name})</span>
      </label>

      <div className="flex items-center gap-2 pt-2">
        <button
          type="submit"
          disabled={!newProfileName.trim()}
          className="cg-pill cg-pill-active py-1.5 px-3 text-xs font-bold disabled:opacity-50"
        >
          Save Profile
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
