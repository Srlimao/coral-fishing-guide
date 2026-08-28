import React, { useState, useEffect } from 'react';
import { FishItem } from '../../types/fishing';
import { getFishSpriteUrl } from '../../data/fishData';
import { useFishing } from '../../context/FishingContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { calculateCatchViability, isFishSpawnActive } from '../calculator/FishingCalculations';
import { FishDetailMapLocation } from './FishDetailMapLocation';
import { RODS_DATA } from '../../data/gearData';
import { X, Check, Clock, Sparkles, Landmark, Shield, AlertTriangle } from 'lucide-react';
import coinImg from '../../assets/icons/T_IconCoin.png';
import starBronze from '../../assets/icons/quality-stars/T_Icon_StarBronzeB.png';
import starSilver from '../../assets/icons/quality-stars/T_Icon_StarSilverB.png';
import starGold from '../../assets/icons/quality-stars/T_Icon_StarGoldB.png';
import starOsmium from '../../assets/icons/quality-stars/T_Icon_StarOsmiumB.png';

interface FishDetailModalProps {
  fish: FishItem;
  onClose: () => void;
}

export const FishDetailModal: React.FC<FishDetailModalProps> = ({ fish, onClose }) => {
  const {
    gameState,
    userProgress,
    toggleCaught,
    toggleDonated,
    toggleOffered,
    customLocations,
    customMapImage
  } = useFishing();

  const { getFishName, getBundleTitle, getAltarTitle, t } = useLanguage();

  const [imgError, setImgError] = useState(false);

  const isCaught = !!userProgress.caught[fish.id];
  const isDonated = !!userProgress.donatedMuseum[fish.id];
  const isOffered = !!userProgress.offeredTemple[fish.id];

  const localizedName = getFishName(fish);

  const viability = calculateCatchViability(
    fish,
    gameState.equippedRod,
    gameState.fishingLevel,
    gameState.equippedTackle,
    gameState.equippedBait
  );

  const isActiveNow = isFishSpawnActive(
    fish,
    gameState.season,
    gameState.day,
    gameState.timeOfDay,
    gameState.weather,
    gameState.equippedBait
  );

  const currentRod = RODS_DATA[gameState.equippedRod] || RODS_DATA.makeshift;
  const spriteSrc = getFishSpriteUrl(fish.iconName, fish.key, fish.id);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="fish-detail-modal-title"
        className="bg-[#f7f2e8] text-[#5a4627] border border-[#e2d3be] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="bg-[#182228] text-white p-3.5 sm:p-4 flex items-center justify-between gap-3 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-13 h-13 sm:w-16 sm:h-16 bg-white/10 rounded-2xl flex items-center justify-center p-1.5 shadow-inner border border-white/10 flex-shrink-0">
              {!imgError ? (
                <img
                  src={spriteSrc}
                  alt={localizedName}
                  className="w-full h-full object-contain drop-shadow-md"
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="text-2xl sm:text-3xl select-none">
                  {fish.rarity === 'Legendary' ? '👑' : fish.size === 'Large' ? '🦈' : '🐟'}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h2 id="fish-detail-modal-title" className="text-base sm:text-xl font-bold truncate">
                  {localizedName}
                </h2>
                <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full badge-rarity-${fish.rarity}`}>
                  {t(`rarity_${fish.rarity.toLowerCase()}` as any, fish.rarity)}
                </span>
                {isActiveNow && (
                  <span className="bg-emerald-500 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full animate-pulse-gentle">
                    {t('badge_active_now')}
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-neutral-300 italic mt-0.5 line-clamp-2">
                {fish.description}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-all flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-5 space-y-3 sm:space-y-3.5 overflow-y-auto flex-1">
          
          {/* Quick Checklists Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-[#ede6db] p-2.5 sm:p-3 rounded-2xl border border-[#e5d8c3]">
            <button
              onClick={() => toggleCaught(fish.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                isCaught ? 'bg-[#13181b] text-white shadow-md' : 'bg-white/70 text-[#5a4627] hover:bg-white'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isCaught ? t('btn_caught') : t('btn_uncaught')}</span>
            </button>

            <button
              onClick={() => toggleDonated(fish.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                isDonated ? 'bg-[#13181b] text-white shadow-md' : 'bg-white/70 text-[#5a4627] hover:bg-white'
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>{isDonated ? t('btn_museum_donated') : t('btn_museum_missing')}</span>
            </button>

            {fish.offerings.length > 0 && (
              <button
                onClick={() => toggleOffered(fish.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isOffered ? 'bg-[#13181b] text-white shadow-md' : 'bg-white/70 text-[#5a4627] hover:bg-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isOffered ? t('btn_altar_offered') : t('btn_altar_needed')}</span>
              </button>
            )}
          </div>

          {/* Pricing & Sell Values with Quality Stars */}
          <div className="grid grid-cols-5 gap-1 sm:gap-2 text-center text-xs">
            <div className="bg-[#ede6db] p-1.5 sm:p-2 rounded-xl border border-[#e2d5be]">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-[#8c785b] block truncate">{t('price_regular')}</span>
              <span className="font-extrabold text-xs sm:text-sm text-[#44331d] flex items-center justify-center gap-0.5 sm:gap-1 mt-0.5">
                <img src={coinImg} alt="Coin" className="w-3 h-3 sm:w-3.5 sm:h-3.5 inline" />
                {fish.sellPrice}g
              </span>
            </div>
            <div className="bg-[#ede6db] p-1.5 sm:p-2 rounded-xl border border-[#e2d5be]">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-amber-800 flex items-center justify-center gap-0.5 sm:gap-1 truncate">
                <img src={starBronze} alt="Bronze Star" className="w-3 h-3 sm:w-3.5 sm:h-3.5 inline" />
                <span className="hidden sm:inline">{t('price_bronze')}</span>
              </span>
              <span className="font-extrabold text-xs sm:text-sm text-[#44331d] block mt-0.5">
                {fish.bronzeSellPrice}g
              </span>
            </div>
            <div className="bg-[#ede6db] p-1.5 sm:p-2 rounded-xl border border-[#e2d5be]">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-700 flex items-center justify-center gap-0.5 sm:gap-1 truncate">
                <img src={starSilver} alt="Silver Star" className="w-3 h-3 sm:w-3.5 sm:h-3.5 inline" />
                <span className="hidden sm:inline">{t('price_silver')}</span>
              </span>
              <span className="font-extrabold text-xs sm:text-sm text-[#44331d] block mt-0.5">
                {fish.silverSellPrice}g
              </span>
            </div>
            <div className="bg-[#ede6db] p-1.5 sm:p-2 rounded-xl border border-[#e2d5be]">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-amber-600 flex items-center justify-center gap-0.5 sm:gap-1 truncate">
                <img src={starGold} alt="Gold Star" className="w-3 h-3 sm:w-3.5 sm:h-3.5 inline" />
                <span className="hidden sm:inline">{t('price_gold')}</span>
              </span>
              <span className="font-extrabold text-xs sm:text-sm text-[#44331d] block mt-0.5">
                {fish.goldSellPrice}g
              </span>
            </div>
            <div className="bg-[#ede6db] p-1.5 sm:p-2 rounded-xl border border-[#e2d5be]">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-purple-800 flex items-center justify-center gap-0.5 sm:gap-1 truncate">
                <img src={starOsmium} alt="Osmium Star" className="w-3 h-3 sm:w-3.5 sm:h-3.5 inline" />
                <span className="hidden sm:inline">{t('price_osmium')}</span>
              </span>
              <span className="font-extrabold text-xs sm:text-sm text-purple-900 block mt-0.5">
                {fish.osmiumSellPrice}g
              </span>
            </div>
          </div>

          {/* Gear Viability Advice */}
          <div className="bg-[#ede6db] p-3 sm:p-3.5 rounded-2xl border border-[#e5d8c3] space-y-1.5 text-xs">
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-1.5 text-[#3d2f1a]">
                <Shield className="w-4 h-4 text-amber-600" />
                <span>{t('gear_suitability')} {t(`rod_${gameState.equippedRod}` as any, currentRod.name)}:</span>
              </span>
              <span style={{ color: viability.badgeColor }} className="text-xs sm:text-sm">
                {viability.statusLabel} ({viability.score}%)
              </span>
            </div>
            {viability.rodWarning && (
              <div className="bg-rose-100 text-rose-800 p-2 rounded-xl flex items-center gap-2 border border-rose-200 text-[11px]">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{viability.rodWarning}</span>
              </div>
            )}
          </div>

          {/* Map Location Visualizer Component */}
          <FishDetailMapLocation
            locations={fish.locations}
            customLocations={customLocations}
            customMapImage={customMapImage}
          />

          {/* Times & Weather Schedule Details */}
          <div className="bg-[#ede6db] p-3 sm:p-3.5 rounded-2xl border border-[#e5d8c3] space-y-1.5 text-xs text-[#5a4627]">
            <div className="flex items-center gap-1.5 font-bold text-[#3d2f1a]">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>{t('times_weather_title')}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
              <div>
                <strong className="block text-[#8c785b] uppercase text-[9px]">{t('season_date_header')}</strong>
                <span className="font-bold text-[#44331d]">{fish.seasons.map(s => t(`season_${s}` as any, s)).join(', ')}</span>
              </div>
              <div>
                <strong className="block text-[#8c785b] uppercase text-[9px]">{t('time_of_day_header')}</strong>
                <span className="font-bold text-[#44331d]">{fish.times.map(tm => t(`time_${tm}` as any, tm)).join(', ')}</span>
              </div>
              <div>
                <strong className="block text-[#8c785b] uppercase text-[9px]">{t('weather_header')}</strong>
                <span className="font-bold text-[#44331d]">{fish.weathers.map(w => t(`weather_${w}` as any, w)).join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Temple Offerings Required */}
          {fish.offerings.length > 0 && (
            <div className="bg-[#fef3c7] p-3 rounded-2xl border border-amber-300 text-xs text-[#92400e] space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>{t('lake_temple_title')}</span>
              </div>
              {fish.offerings.map((o, idx) => (
                <p key={idx} className="text-[11px]">
                  {t('altar_required_for')} <strong>{getBundleTitle(o.bundleName)}</strong> ({getAltarTitle(o.roomName, o.altarName)})
                </p>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
