import React, { useState } from 'react';
import { FishItem } from '../../types/fishing';
import { getFishSpriteUrl } from '../../data/fishData';
import { useFishing } from '../../context/FishingContext';
import { calculateCatchViability, isFishSpawnActive } from '../calculator/FishingCalculations';
import { MinigameVisualizer } from './MinigameVisualizer';
import { RODS_DATA } from '../../data/gearData';
import { X, Check, MapPin, Clock, Cloud, Sparkles, Landmark, Shield, AlertTriangle } from 'lucide-react';
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
    toggleOffered
  } = useFishing();

  const [imgError, setImgError] = useState(false);

  const isCaught = !!userProgress.caught[fish.id];
  const isDonated = !!userProgress.donatedMuseum[fish.id];
  const isOffered = !!userProgress.offeredTemple[fish.id];

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#f7f2e8] text-[#5a4627] border border-[#e2d3be] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
        
        {/* Modal Header */}
        <div className="bg-[#182228] text-white p-5 flex items-start justify-between border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center p-1.5 shadow-inner border border-white/10 flex-shrink-0">
              {!imgError ? (
                <img
                  src={spriteSrc}
                  alt={fish.name}
                  className="w-full h-full object-contain drop-shadow-md"
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="text-3xl select-none">
                  {fish.rarity === 'Legendary' ? '👑' : fish.size === 'Large' ? '🦈' : '🐟'}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-2xl font-bold">{fish.name}</h2>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full badge-rarity-${fish.rarity}`}>
                  {fish.rarity}
                </span>
                {isActiveNow && (
                  <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse-gentle">
                    Active Now!
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-300 italic mt-0.5">{fish.description}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Quick Checklists Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-[#ede6db] p-3 rounded-2xl border border-[#e5d8c3]">
            <button
              onClick={() => toggleCaught(fish.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                isCaught ? 'bg-[#13181b] text-white shadow-md' : 'bg-white/70 text-[#5a4627] hover:bg-white'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isCaught ? 'Caught in Journal' : 'Mark as Caught'}</span>
            </button>

            <button
              onClick={() => toggleDonated(fish.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                isDonated ? 'bg-[#13181b] text-white shadow-md' : 'bg-white/70 text-[#5a4627] hover:bg-white'
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>{isDonated ? 'Donated to Museum' : 'Donate to Museum'}</span>
            </button>

            {fish.offerings.length > 0 && (
              <button
                onClick={() => toggleOffered(fish.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isOffered ? 'bg-amber-600 text-white shadow-md' : 'bg-[#fef3c7] text-[#92400e] hover:bg-[#fde68a]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isOffered ? 'Offered to Altar' : 'Offer at Lake Temple'}</span>
              </button>
            )}
          </div>

          {/* Pricing & Sell Values with Quality Stars */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
            <div className="bg-[#ede6db] p-2 rounded-xl border border-[#e2d5be]">
              <span className="text-[10px] uppercase font-bold text-[#8c785b] block">Regular</span>
              <span className="font-extrabold text-sm text-[#44331d] flex items-center justify-center gap-1 mt-0.5">
                <img src={coinImg} alt="Coin" className="w-3.5 h-3.5 inline" />
                {fish.sellPrice}g
              </span>
            </div>
            <div className="bg-[#ede6db] p-2 rounded-xl border border-[#e2d5be]">
              <span className="text-[10px] uppercase font-bold text-amber-800 flex items-center justify-center gap-1">
                <img src={starBronze} alt="Bronze Star" className="w-3.5 h-3.5 inline" /> Bronze
              </span>
              <span className="font-extrabold text-sm text-[#44331d] block mt-0.5">
                {fish.bronzeSellPrice}g
              </span>
            </div>
            <div className="bg-[#ede6db] p-2 rounded-xl border border-[#e2d5be]">
              <span className="text-[10px] uppercase font-bold text-slate-700 flex items-center justify-center gap-1">
                <img src={starSilver} alt="Silver Star" className="w-3.5 h-3.5 inline" /> Silver
              </span>
              <span className="font-extrabold text-sm text-[#44331d] block mt-0.5">
                {fish.silverSellPrice}g
              </span>
            </div>
            <div className="bg-[#ede6db] p-2 rounded-xl border border-[#e2d5be]">
              <span className="text-[10px] uppercase font-bold text-amber-600 flex items-center justify-center gap-1">
                <img src={starGold} alt="Gold Star" className="w-3.5 h-3.5 inline" /> Gold
              </span>
              <span className="font-extrabold text-sm text-[#44331d] block mt-0.5">
                {fish.goldSellPrice}g
              </span>
            </div>
            <div className="bg-[#ede6db] p-2 rounded-xl border border-[#e2d5be]">
              <span className="text-[10px] uppercase font-bold text-purple-800 flex items-center justify-center gap-1">
                <img src={starOsmium} alt="Osmium Star" className="w-3.5 h-3.5 inline" /> Osmium
              </span>
              <span className="font-extrabold text-sm text-purple-900 block mt-0.5">
                {fish.osmiumSellPrice}g
              </span>
            </div>
          </div>

          {/* Gear Viability Advice */}
          <div className="bg-[#ede6db] p-4 rounded-2xl border border-[#e5d8c3] space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-1.5 text-[#3d2f1a]">
                <Shield className="w-4 h-4 text-amber-600" />
                <span>Gear Suitability with your {currentRod.name}:</span>
              </span>
              <span style={{ color: viability.badgeColor }} className="text-sm">
                {viability.statusLabel} ({viability.score}%)
              </span>
            </div>
            {viability.rodWarning && (
              <div className="bg-rose-100 text-rose-800 p-2.5 rounded-xl flex items-center gap-2 border border-rose-200">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{viability.rodWarning}</span>
              </div>
            )}
          </div>

          {/* Minigame Visualizer */}
          <MinigameVisualizer
            pattern={fish.pattern}
            difficulty={fish.difficulty}
            size={fish.size}
            reelingSpeed={currentRod.reelingMultiplier}
          />

          {/* Spawn Locations & Times */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-[#ede6db] p-3.5 rounded-2xl border border-[#e5d8c3] space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-[#3d2f1a]">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>Spawn Locations</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[#5a4627]">
                {fish.locations.map(loc => (
                  <li key={loc} className="font-bold">{loc}</li>
                ))}
              </ul>
            </div>

            <div className="bg-[#ede6db] p-3.5 rounded-2xl border border-[#e5d8c3] space-y-1.5 text-[#5a4627]">
              <div className="flex items-center gap-1.5 font-bold text-[#3d2f1a]">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Times & Weather</span>
              </div>
              <p><strong>Seasons:</strong> {fish.seasons.join(', ')}</p>
              <p><strong>Time Slots:</strong> {fish.times.join(', ')}</p>
              <p className="flex items-center gap-1">
                <Cloud className="w-3.5 h-3.5 text-blue-600" />
                <strong>Weathers:</strong> {fish.weathers.join(', ')}
              </p>
            </div>
          </div>

          {/* Temple Offerings Required */}
          {fish.offerings.length > 0 && (
            <div className="bg-[#fef3c7] p-3.5 rounded-2xl border border-amber-300 text-xs text-[#92400e] space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Lake Temple Catching Altar</span>
              </div>
              {fish.offerings.map((o, idx) => (
                <p key={idx}>
                  Required for <strong>{o.bundleName}</strong> ({o.roomName} - {o.altarName})
                </p>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
