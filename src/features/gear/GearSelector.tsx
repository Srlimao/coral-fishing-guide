import React from 'react';
import { useFishing } from '../../context/FishingContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { RodTier, BaitType, TackleType } from '../../types/fishing';
import { RODS_DATA, BAITS_DATA, TACKLES_DATA } from '../../data/gearData';
import { Shield, Zap, Target, Anchor } from 'lucide-react';

export const GearSelector: React.FC = () => {
  const { gameState, setFishingLevel, setEquippedRod, setEquippedBait, setEquippedTackle } = useFishing();
  const { t } = useLanguage();

  const currentRod = RODS_DATA[gameState.equippedRod] || RODS_DATA.makeshift;
  const currentBait = BAITS_DATA[gameState.equippedBait] || BAITS_DATA.none;
  const currentTackle = TACKLES_DATA[gameState.equippedTackle] || TACKLES_DATA.none;

  return (
    <div className="glass-panel p-4 sm:p-5 shadow-xl space-y-4">
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 border-b border-white/10 pb-4">
        
        {/* Fishing Level Slider */}
        <div className="flex items-center gap-4 w-full xl:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎣</span>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-neutral-400 block">{t('gear_skill_level')}</span>
              <span className="text-base font-extrabold text-amber-400">{t('level_prefix')} {gameState.fishingLevel}</span>
            </div>
          </div>
          <div className="flex-1 min-w-[120px] max-w-[200px]">
            <input
              type="range"
              min={0}
              max={10}
              value={gameState.fishingLevel}
              onChange={(e) => setFishingLevel(Number(e.target.value))}
              className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
              <span>{t('level_prefix')} 0</span>
              <span>{t('level_prefix')} 5</span>
              <span>{t('level_prefix')} 10 ({t('gear_lvl_master')})</span>
            </div>
          </div>
        </div>

        {/* Rod Tier Select */}
        <div className="flex flex-wrap items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
          <span className="text-xs font-semibold text-neutral-400 px-2 flex items-center gap-1">
            <Anchor className="w-3.5 h-3.5" /> {t('gear_rod_label')}
          </span>
          {Object.values(RODS_DATA).map(rod => (
            <button
              key={rod.id}
              onClick={() => setEquippedRod(rod.id as RodTier)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                gameState.equippedRod === rod.id
                  ? 'bg-neutral-700 text-white border border-amber-500/60 shadow-md'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
              style={{
                color: gameState.equippedRod === rod.id ? rod.color : undefined
              }}
            >
              {t(`rod_${rod.id}` as any, rod.name.replace(' Fishing Rod', ''))}
            </button>
          ))}
        </div>

        {/* Bait Selector */}
        <div className="flex flex-wrap items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
          <span className="text-xs font-semibold text-neutral-400 px-2 flex items-center gap-1">
            <Target className="w-3.5 h-3.5" /> {t('gear_bait_label')}
          </span>
          {Object.values(BAITS_DATA).map(bait => (
            <button
              key={bait.id}
              onClick={() => setEquippedBait(bait.id as BaitType)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                gameState.equippedBait === bait.id
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {bait.name.replace(' Fish Bait', '').replace(' Bait', '')}
            </button>
          ))}
        </div>

        {/* Tackle Selector */}
        <div className="flex flex-wrap items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
          <span className="text-xs font-semibold text-neutral-400 px-2 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" /> {t('gear_tackle_label')}
          </span>
          {Object.values(TACKLES_DATA).map(tackle => (
            <button
              key={tackle.id}
              onClick={() => setEquippedTackle(tackle.id as TackleType)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                gameState.equippedTackle === tackle.id
                  ? 'bg-cyan-700 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tackle.name.replace(' Lure', '').replace(' Line', '').replace(' Hook', '')}
            </button>
          ))}
        </div>

      </div>

      {/* Dynamic Gear Summary & Buffs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="bg-black/20 p-2.5 rounded-xl border border-white/5 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <span className="text-neutral-400 font-medium block">{t('gear_reeling_power')}</span>
            <span className="text-white font-bold">{currentRod.reelingMultiplier}x Speed ({currentRod.maxDistance})</span>
          </div>
        </div>

        <div className="bg-black/20 p-2.5 rounded-xl border border-white/5 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="text-neutral-400 font-medium block">{t('gear_line_tension')}</span>
            <span className="text-white font-bold">
              {currentRod.lineStrength + gameState.fishingLevel * 5} Base + {currentTackle.name}
            </span>
          </div>
        </div>

        <div className="bg-black/20 p-2.5 rounded-xl border border-white/5 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <span className="text-neutral-400 font-medium block">{t('gear_bait_bonus')}</span>
            <span className="text-amber-300 font-semibold">{currentBait.bonusText}</span>
          </div>
        </div>
      </div>

    </div>
  );
};
