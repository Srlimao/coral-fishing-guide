import React, { useState } from 'react';
import { FishItem } from '../../types/fishing';
import { getFishSpriteUrl } from '../../data/fishData';
import { useFishing } from '../../context/FishingContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { isFishSpawnActive, getFishExclusivityInfo } from '../calculator/FishingCalculations';
import { LocationMapHoverPopover } from './LocationMapHoverPopover';
import { Check, Sparkles, Clock, MapPin, Landmark, Flag } from 'lucide-react';

interface FishCardProps {
  fish: FishItem;
}

export const FishCard: React.FC<FishCardProps> = ({ fish }) => {
  const {
    gameState,
    userProgress,
    toggleCaught,
    toggleDonated,
    toggleOffered,
    setSelectedFish,
    customLocations,
    customMapImage
  } = useFishing();

  const { getFishName, getLocationName, t } = useLanguage();

  const [isLocationHovered, setIsLocationHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isCaught = !!userProgress.caught[fish.id];
  const isDonated = !!userProgress.donatedMuseum[fish.id];
  const isOffered = !!userProgress.offeredTemple[fish.id];

  const localizedName = getFishName(fish);

  const isActiveNow = isFishSpawnActive(
    fish,
    gameState.season,
    gameState.day,
    gameState.timeOfDay,
    gameState.weather,
    gameState.equippedBait
  );

  const exclusivity = getFishExclusivityInfo(fish, gameState.season, userProgress);
  const spriteSrc = getFishSpriteUrl(fish.iconName, fish.key, fish.id);

  return (
    <div
      className={`cg-card cg-card-interactive p-3.5 sm:p-4 flex flex-col justify-between relative overflow-visible transition-all border ${
        isCaught ? 'bg-[#f4efe4] opacity-95' : 'bg-[#faf6ee]'
      }`}
    >
      {/* Top Section - Interactive Button to view details */}
      <button
        type="button"
        onClick={() => setSelectedFish(fish)}
        aria-label={`${localizedName}, details and tracking`}
        className="text-left w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-xl transition-all"
      >
        {/* Banner Badges */}
        {exclusivity.isExclusive && (
          <div className="mb-2 -mt-0.5 flex flex-wrap items-center gap-1.5">
            <span className="bg-[#13181b] text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs border border-white/20">
              <Flag className="w-3 h-3 text-amber-400 fill-amber-400 flex-shrink-0" />
              <span>{exclusivity.flags.join(' • ')}</span>
            </span>
          </div>
        )}

        {/* Fish Header: Sprite + Title + Seasons */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-white/80 border border-[#e2d5be] flex items-center justify-center p-1 flex-shrink-0 shadow-inner overflow-hidden">
              {!imgError ? (
                <img
                  src={spriteSrc}
                  alt={localizedName}
                  className="w-full h-full object-contain drop-shadow-sm"
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="text-2xl select-none">
                  {fish.rarity === 'Legendary' ? '👑' : fish.size === 'Large' ? '🦈' : '🐟'}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm sm:text-base text-[#3d2f1a] leading-tight truncate hover:text-black transition-colors">
                  {localizedName}
                </h3>
                {isActiveNow && (
                  <span className="flex h-2 w-2 relative flex-shrink-0" title={t('badge_active_now')}>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
              </div>

              {/* Seasons Chips in Unified Style */}
              <div className="flex flex-wrap gap-1 mt-1">
                {fish.seasons.map(s => (
                  <span
                    key={s}
                    className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-[#ede5d5] text-[#5a4627] border border-[#dfd2be] uppercase"
                  >
                    {t(`season_${s}` as any, s)}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Badges: Rarity & Difficulty */}
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full badge-rarity-${fish.rarity}`}>
              {t(`rarity_${fish.rarity.toLowerCase()}` as any, fish.rarity)}
            </span>
            <span className="text-[9px] font-semibold text-[#8c785b] bg-[#ede5d5] px-1.5 py-0.5 rounded-full">
              {fish.difficulty}
            </span>
          </div>
        </div>

        {/* Location & Time of Day */}
        <div className="mt-2.5 pt-2 border-t border-[#e8ddcb] space-y-1 text-xs text-[#5a4627]">
          <div
            onMouseEnter={() => setIsLocationHovered(true)}
            onMouseLeave={() => setIsLocationHovered(false)}
            className="relative flex items-center gap-1.5 hover:text-black transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-[#8c785b] flex-shrink-0" />
            <span className="font-medium text-[11px] truncate text-[#44331d] hover:underline underline-offset-2">
              {fish.locations.map(loc => getLocationName(loc)).join(', ') || t('any_waters')}
            </span>

            {isLocationHovered && (
              <LocationMapHoverPopover
                locations={fish.locations}
                customLocations={customLocations}
                customMapImage={customMapImage}
              />
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#8c785b] flex-shrink-0" />
            <span className="text-[11px] text-[#5a4627] truncate">
              {fish.times.map(tm => t(`time_${tm}` as any, tm)).join(', ')} • {fish.sellPrice}g
            </span>
          </div>
        </div>
      </button>

      {/* Footer Checklists */}
      <div
        className="mt-3 pt-2 border-t border-[#e8ddcb] flex items-center gap-1.5 text-[11px]"
      >
        <button
          onClick={() => toggleCaught(fish.id)}
          aria-pressed={isCaught}
          aria-label={`${localizedName}: ${isCaught ? t('btn_caught') : t('btn_uncaught')}`}
          className={`flex-1 min-w-0 flex items-center justify-center gap-1 px-2 py-1 rounded-full font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
            isCaught ? 'bg-[#13181b] text-white shadow-xs' : 'bg-[#ede5d5] text-[#8c785b] hover:bg-[#e2d5be]'
          }`}
        >
          <Check className={`w-3 h-3 flex-shrink-0 ${isCaught ? 'opacity-100' : 'opacity-40'}`} />
          <span className="truncate">{isCaught ? t('btn_caught') : t('btn_uncaught')}</span>
        </button>

        <button
          onClick={() => toggleDonated(fish.id)}
          aria-pressed={isDonated}
          aria-label={`${localizedName} museum status: ${isDonated ? t('btn_museum_donated') : t('btn_museum_missing')}`}
          className={`flex-1 min-w-0 flex items-center justify-center gap-1 px-2 py-1 rounded-full font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
            isDonated ? 'bg-[#13181b] text-white shadow-xs' : 'bg-[#ede5d5] text-[#8c785b] hover:bg-[#e2d5be]'
          }`}
        >
          <Landmark className={`w-3 h-3 flex-shrink-0 ${isDonated ? 'opacity-100' : 'opacity-40'}`} />
          <span className="truncate">{isDonated ? t('btn_museum_donated') : t('btn_museum_missing')}</span>
        </button>

        {fish.offerings.length > 0 && (
          <button
            onClick={() => toggleOffered(fish.id)}
            aria-pressed={isOffered}
            aria-label={`${localizedName} altar offering status: ${isOffered ? t('btn_altar_offered') : t('btn_altar_needed')}`}
            title={`Required for: ${fish.offerings.map(o => o.bundleName).join(', ')}`}
            className={`flex-1 min-w-0 flex items-center justify-center gap-1 px-2 py-1 rounded-full font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
              isOffered
                ? 'bg-[#13181b] text-white shadow-xs'
                : 'bg-[#ede5d5] text-[#8c785b] hover:bg-[#e2d5be]'
            }`}
          >
            <Sparkles className={`w-3 h-3 flex-shrink-0 ${isOffered ? 'opacity-100' : 'opacity-40'}`} />
            <span className="truncate">{isOffered ? t('btn_altar_offered') : t('btn_altar_needed')}</span>
          </button>
        )}
      </div>
    </div>
  );
};
