import React from 'react';
import { useSaveEditor } from '../../context/SaveEditorContext';
import { Sparkles, Landmark, Flame, Award, CheckCircle2, Scroll } from 'lucide-react';

export const MuseumAltarsModule: React.FC = () => {
  const { activeModel, updateModel } = useSaveEditor();

  if (!activeModel) return null;

  const handleCompleteMuseum = () => {
    updateModel(prev => ({
      ...prev,
      donatedCount: 300
    }));
  };

  const handleCompleteAltars = () => {
    updateModel(prev => ({
      ...prev,
      offeredCount: 24
    }));
  };

  const handleCompleteAllQuests = () => {
    updateModel(prev => ({
      ...prev,
      completedQuestsCount: prev.totalQuestsCount || 100
    }));
  };

  const handleSetTownRank = (score: number) => {
    updateModel(prev => ({
      ...prev,
      townRankScore: score
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Landmark className="w-5 h-5 text-amber-400" />
          Museum Collections, Goddess Altars & Quests
        </h2>
        <p className="text-xs text-[#c4b5a0]">Complete Museum donations, fulfill Lake Temple altar bundles, rank up Starlet Town, and manage story quests.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        {/* 1. Museum Donations */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Landmark className="w-4 h-4 text-cyan-400" />
              Starlet Town Museum
            </h3>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full">
              {activeModel.donatedCount >= 300 ? 'Completed' : 'In Progress'}
            </span>
          </div>

          <p className="text-[#c4b5a0] text-[11px]">
            Unlock museum wing rewards, dinosaur holograms, and master collector trophies by completing all item donations.
          </p>

          <div className="space-y-2">
            <button
              onClick={handleCompleteMuseum}
              className="cg-pill cg-pill-active w-full py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Complete Entire Museum (Donate All)</span>
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => updateModel(prev => ({ ...prev, donatedCount: Math.min(300, prev.donatedCount + 69) }))}
                className="cg-pill w-full py-1.5 px-2 text-[11px] hover:text-white"
              >
                🐟 Donate All Fish
              </button>
              <button
                onClick={() => updateModel(prev => ({ ...prev, donatedCount: Math.min(300, prev.donatedCount + 50) }))}
                className="cg-pill w-full py-1.5 px-2 text-[11px] hover:text-white"
              >
                💎 Donate All Gems
              </button>
            </div>
          </div>
        </div>

        {/* 2. Lake Temple Goddess Altars */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              Lake Temple Goddess Altars
            </h3>
            <span className="text-[10px] text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded-full">
              {activeModel.offeredCount >= 24 ? 'All Altars Blessed' : 'Offerings Needed'}
            </span>
          </div>

          <p className="text-[#c4b5a0] text-[11px]">
            Restore the Goddess tree, unlock fast travel teleport sesajens, greenhouse access, and master crafting recipes.
          </p>

          <div className="space-y-2">
            <button
              onClick={handleCompleteAltars}
              className="cg-pill cg-pill-active w-full py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete All 4 Goddess Altars</span>
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => updateModel(prev => ({ ...prev, offeredCount: Math.min(24, prev.offeredCount + 6) }))}
                className="cg-pill w-full py-1.5 px-2 text-[11px] hover:text-white"
              >
                🌾 Crop Altar
              </button>
              <button
                onClick={() => updateModel(prev => ({ ...prev, offeredCount: Math.min(24, prev.offeredCount + 6) }))}
                className="cg-pill w-full py-1.5 px-2 text-[11px] hover:text-white"
              >
                🎣 Catch Altar
              </button>
            </div>
          </div>
        </div>

        {/* 3. Story & Side Quests Progression */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-3 md:col-span-2">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Scroll className="w-4 h-4 text-emerald-400" />
              Story & Side Quests Log
            </h3>
            <span className="text-emerald-400 font-mono font-bold text-xs bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              {activeModel.completedQuestsCount} / {activeModel.totalQuestsCount} Quests Completed
            </span>
          </div>

          <p className="text-[#c4b5a0] text-[11px]">
            Track discovered storyline quests, town errands, diving missions, and unlock rewards without missing seasonal milestones.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={handleCompleteAllQuests}
              className="cg-pill cg-pill-active py-2 px-4 text-xs font-bold flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark All Discovered Quests as Completed</span>
            </button>
          </div>
        </div>

        {/* 4. Town Rank Progression */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-3 md:col-span-2">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" />
              Starlet Town Rank (Letter E → S)
            </h3>
            <span className="text-white font-mono font-bold text-xs">
              Score: {activeModel.townRankScore} pts
            </span>
          </div>

          <p className="text-[#c4b5a0] text-[11px]">
            Elevating Town Rank unlocks new seeds, farm animals, clothes, artisan equipment, and diving depth access.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
            {[
              { rank: 'Rank E', score: 0, desc: 'Starter' },
              { rank: 'Rank D', score: 250, desc: 'Spring Seeds' },
              { rank: 'Rank C', score: 500, desc: 'Upgraded Tools' },
              { rank: 'Rank B', score: 850, desc: 'Exotic Animals' },
              { rank: 'Rank A', score: 1250, desc: 'Advanced Tech' },
              { rank: 'Rank S 🏆', score: 1800, desc: 'Max Island Honor' }
            ].map(r => (
              <button
                key={r.rank}
                onClick={() => handleSetTownRank(r.score)}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  activeModel.townRankScore >= r.score
                    ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                    : 'bg-black/30 border-white/5 text-neutral-400 hover:text-white hover:border-white/20'
                }`}
              >
                <div className="font-bold text-xs">{r.rank}</div>
                <div className="text-[9px] text-[#c4b5a0] mt-0.5">{r.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
