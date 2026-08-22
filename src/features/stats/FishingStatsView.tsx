import React from 'react';
import { useFishing } from '../../context/FishingContext';
import { FISH_LIST } from '../../data/fishData';
import { RODS_DATA } from '../../data/gearData';
import { Award, Zap, Anchor, Landmark, Sparkles, CheckCircle2 } from 'lucide-react';
import coinImg from '../../assets/icons/T_IconCoin.png';

const MASTERY_PERKS = [
  { level: 1, title: 'Cast Distance I', desc: '+1 Tile casting range. Unlocks Copper Fishing Rod upgrade at Beach Shack.' },
  { level: 2, title: 'Quick Nibble', desc: 'Fish bite the hook 10% faster on all fresh and saltwater bodies.' },
  { level: 3, title: 'Skill Tree Choice', desc: 'Choose between "Angler" (+20% fish sell price) or "Bait Master" (baits last 2x longer).' },
  { level: 4, title: 'Line Tension I', desc: '+15% Line tension resistance before breaking. Unlocks Silver Fishing Rod upgrade.' },
  { level: 5, title: 'Deep Cast', desc: '+2 Tile casting reach. Increases chance of finding high-quality Silver/Gold fish.' },
  { level: 6, title: 'Skill Tree Choice', desc: 'Choose between "Double Catch" (10% chance to reel in 2 fish) or "Trash Cleaner" (fishing debris grants extra EXP).' },
  { level: 7, title: 'Line Tension II', desc: '+25% Line tension resistance. Unlocks Gold Fishing Rod upgrade.' },
  { level: 8, title: 'Swift Reel', desc: 'Reeling speed increased by +20% during minigame safe zones.' },
  { level: 9, title: 'Master of Currents', desc: 'High difficulty fish move 15% slower during fight patterns.' },
  { level: 10, title: 'Osmium Angler (Mastery)', desc: 'Unlocks Osmium Fishing Rod. Maximum cast range, legendary fish bite rate boosted by +50%.' }
];

export const FishingStatsView: React.FC = () => {
  const { gameState, userProgress } = useFishing();

  const caughtIds = Object.keys(userProgress.caught).filter(id => userProgress.caught[id]);
  const caughtFishList = FISH_LIST.filter(f => userProgress.caught[f.id]);
  const totalCaughtGold = caughtFishList.reduce((sum, f) => sum + f.sellPrice, 0);
  const totalOsmiumGold = caughtFishList.reduce((sum, f) => sum + f.osmiumSellPrice, 0);

  const museumDonatedCount = Object.values(userProgress.donatedMuseum).filter(Boolean).length;
  const altarOfferedCount = Object.values(userProgress.offeredTemple).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="cg-card p-5 space-y-1">
          <span className="text-xs uppercase font-bold text-[#8c785b] flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Fish Journal
          </span>
          <h3 className="text-2xl font-black text-[#3d2f1a]">
            {caughtIds.length} <span className="text-sm font-semibold text-[#8c785b]">/ 69 ({Math.round((caughtIds.length / 69) * 100)}%)</span>
          </h3>
          <p className="text-[11px] text-[#8c785b]">Total unique species cataloged</p>
        </div>

        <div className="cg-card p-5 space-y-1">
          <span className="text-xs uppercase font-bold text-[#8c785b] flex items-center gap-1.5">
            <Landmark className="w-4 h-4 text-blue-600" /> Museum Donations
          </span>
          <h3 className="text-2xl font-black text-[#3d2f1a]">
            {museumDonatedCount} <span className="text-sm font-semibold text-[#8c785b]">/ 69 ({Math.round((museumDonatedCount / 69) * 100)}%)</span>
          </h3>
          <p className="text-[11px] text-[#8c785b]">Donated to Museum Wing</p>
        </div>

        <div className="cg-card p-5 space-y-1">
          <span className="text-xs uppercase font-bold text-[#8c785b] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" /> Temple Offerings
          </span>
          <h3 className="text-2xl font-black text-[#3d2f1a]">
            {altarOfferedCount} <span className="text-sm font-semibold text-[#8c785b]">/ 22 Bundles</span>
          </h3>
          <p className="text-[11px] text-[#8c785b]">Catching Altar restored</p>
        </div>

        <div className="cg-card p-5 space-y-1">
          <span className="text-xs uppercase font-bold text-[#8c785b] flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-yellow-600" /> Caught Fish Value
          </span>
          <h3 className="text-2xl font-black text-[#3d2f1a] flex items-center gap-1">
            <img src={coinImg} alt="Gold" className="w-5 h-5 inline" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
            {totalCaughtGold.toLocaleString()}g
          </h3>
          <p className="text-[11px] text-[#8c785b]">Osmium potential: {totalOsmiumGold.toLocaleString()}g</p>
        </div>
      </div>

      {/* Rod Upgrade Path Guide */}
      <div className="glass-panel p-5 shadow-xl space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Anchor className="w-5 h-5 text-amber-400" />
          <span>Sunny’s Beach Shack - Rod Upgrade Path</span>
        </h2>
        <p className="text-xs text-neutral-300">
          Upgrade your fishing rod at the Beach Shack (Sunny & Eleanor) to increase line resistance and cast distance.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          {Object.values(RODS_DATA).map((rod, index) => {
            const isCurrent = gameState.equippedRod === rod.id;
            return (
              <div
                key={rod.id}
                className={`p-4 rounded-2xl border transition-all text-xs flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-amber-950/80 border-amber-400 text-white shadow-lg shadow-amber-500/20'
                    : 'bg-black/30 border-white/10 text-neutral-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between font-bold text-xs mb-1">
                    <span className="text-neutral-400 uppercase text-[10px]">Tier {index + 1}</span>
                    {isCurrent && <span className="text-amber-400 font-extrabold">EQUIPPED</span>}
                  </div>
                  <h4 className="font-extrabold text-sm text-white" style={{ color: rod.color }}>
                    {rod.name}
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-1 leading-tight">{rod.description}</p>
                </div>

                <div className="mt-3 pt-3 border-t border-white/10 space-y-1 text-[11px]">
                  <p><strong>Min Level:</strong> Lvl {rod.minLevel}</p>
                  <p><strong>Reeling:</strong> {rod.reelingMultiplier}x Speed</p>
                  <p><strong>Distance:</strong> {rod.maxDistance}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mastery Perks 1 - 10 Tree */}
      <div className="glass-panel p-5 shadow-xl space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span>Fishing Mastery Perks (Levels 1 - 10)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {MASTERY_PERKS.map(perk => {
            const isUnlocked = gameState.fishingLevel >= perk.level;
            return (
              <div
                key={perk.level}
                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 text-xs ${
                  isUnlocked
                    ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                    : 'bg-black/20 border-white/5 text-neutral-400'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${
                    isUnlocked ? 'bg-emerald-500 text-black shadow-md' : 'bg-neutral-800 text-neutral-500'
                  }`}
                >
                  {perk.level}
                </div>
                <div>
                  <strong className="text-white font-bold block text-sm">{perk.title}</strong>
                  <p className="text-neutral-300 text-xs mt-0.5 leading-relaxed">{perk.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
