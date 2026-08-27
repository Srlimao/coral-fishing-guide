import React from 'react';
import { useUserProfile } from './UserProfileContext';
import { getAvatarById } from './defaultProfiles';
import { CloudSyncIndicator } from './CloudSyncIndicator';
import { ChevronDown } from 'lucide-react';

interface UserProfileSelectorProps {
  isCollapsed?: boolean;
}

export const UserProfileSelector: React.FC<UserProfileSelectorProps> = ({ isCollapsed = false }) => {
  const { activeProfile, openProfileModal } = useUserProfile();
  const avatar = getAvatarById(activeProfile.avatar);

  const caughtCount = Object.values(activeProfile.userProgress.caught || {}).filter(Boolean).length;

  if (isCollapsed) {
    return (
      <button
        onClick={openProfileModal}
        title={`Profile: ${activeProfile.name} (${caughtCount}/69 caught)`}
        aria-label="User Profile"
        className="relative group p-1 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 transition-all flex items-center justify-center w-11 h-11"
      >
        <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${avatar.bgGradient} flex items-center justify-center text-base shadow`}>
          <span>{avatar.emoji}</span>
        </div>
        <div className="absolute -bottom-1 -right-1">
          <CloudSyncIndicator compact />
        </div>
      </button>
    );
  }

  return (
    <div className="w-full bg-gradient-to-r from-white/[0.07] to-white/[0.03] border border-white/10 rounded-2xl p-2 transition-all hover:border-white/20">
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={openProfileModal}
          className="flex-1 flex items-center gap-2.5 min-w-0 text-left group"
        >
          {/* Avatar Icon */}
          <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${avatar.bgGradient} flex items-center justify-center text-sm shadow flex-shrink-0 group-hover:scale-105 transition-transform`}>
            <span>{avatar.emoji}</span>
          </div>

          {/* User Details */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white truncate max-w-[105px]">
                {activeProfile.name}
              </span>
              <ChevronDown className="w-3 h-3 text-neutral-400 group-hover:text-white transition-colors" />
            </div>
            <div className="text-[10px] text-[#c4b5a0] flex items-center gap-1">
              <span>🎣 {caughtCount}/69</span>
            </div>
          </div>
        </button>

        {/* Cloud Status Badge */}
        <div className="flex-shrink-0">
          <CloudSyncIndicator compact />
        </div>
      </div>
    </div>
  );
};
