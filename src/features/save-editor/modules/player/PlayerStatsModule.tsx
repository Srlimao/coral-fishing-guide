import React from 'react';
import { useSaveEditor } from '../../context/SaveEditorContext';
import { Coins, Heart, Award, Sparkles, User } from 'lucide-react';

export const PlayerStatsModule: React.FC = () => {
  const { activeModel, updateModel } = useSaveEditor();

  if (!activeModel) return null;

  const handleMoneyPreset = (amount: number) => {
    updateModel(prev => ({ ...prev, money: Math.min(prev.money + amount, 99999999) }));
  };

  const handleSetMoney = (val: number) => {
    updateModel(prev => ({ ...prev, money: Math.max(0, val) }));
  };

  const handleMaxSkills = () => {
    updateModel(prev => ({
      ...prev,
      fishingLevel: 10,
      farmingLevel: 10,
      ranchingLevel: 10,
      foragingLevel: 10,
      miningLevel: 10,
      catchingLevel: 10,
      combatLevel: 10,
      divingLevel: 10
    }));
  };

  const skillsList = [
    { key: 'fishingLevel', label: '🎣 Fishing', val: activeModel.fishingLevel },
    { key: 'farmingLevel', label: '🌾 Farming', val: activeModel.farmingLevel },
    { key: 'ranchingLevel', label: '🐮 Ranching', val: activeModel.ranchingLevel },
    { key: 'foragingLevel', label: '🍄 Foraging', val: activeModel.foragingLevel },
    { key: 'miningLevel', label: '⛏️ Mining', val: activeModel.miningLevel },
    { key: 'catchingLevel', label: '🦋 Catching', val: activeModel.catchingLevel },
    { key: 'combatLevel', label: '⚔️ Combat', val: activeModel.combatLevel },
    { key: 'divingLevel', label: '🤿 Diving', val: activeModel.divingLevel }
  ] as const;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-amber-400" />
            Player Profile, Economy & Mastery
          </h2>
          <p className="text-xs text-[#c4b5a0]">Edit character identity, wallet coral coins, vitals, and skill levels.</p>
        </div>
        <button
          onClick={handleMaxSkills}
          className="cg-pill cg-pill-active text-xs font-bold py-1.5 px-3 self-start sm:self-auto flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Max All Skills (Lvl 10)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        {/* 1. Identity Card */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-white/10 pb-2">
            <User className="w-4 h-4 text-cyan-400" />
            Character Identity
          </h3>
          <div className="space-y-2">
            <div>
              <label className="block text-[#c4b5a0] text-[11px] mb-1">Player Name</label>
              <input
                type="text"
                aria-label="Player Name"
                value={activeModel.playerName}
                onChange={e => updateModel(prev => ({ ...prev, playerName: e.target.value }))}
                className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-1.5 text-white font-bold focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-[#c4b5a0] text-[11px] mb-1">Farm Name</label>
              <input
                type="text"
                aria-label="Farm Name"
                value={activeModel.farmName}
                onChange={e => updateModel(prev => ({ ...prev, farmName: e.target.value }))}
                className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-1.5 text-white font-bold focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* 2. Wallet & Economy */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-white/10 pb-2">
            <Coins className="w-4 h-4 text-amber-400" />
            Wallet & Coral Coins
          </h3>
          <div className="space-y-2">
            <label className="block text-[#c4b5a0] text-[11px]">Current Money (Coins)</label>
            <input
              type="number"
              aria-label="Current Money"
              value={activeModel.money}
              onChange={e => handleSetMoney(parseInt(e.target.value) || 0)}
              className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-1.5 text-amber-300 font-mono text-base font-bold focus:outline-none focus:border-amber-400"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              <button onClick={() => handleMoneyPreset(100000)} className="cg-pill text-[11px] py-1 px-2 hover:text-white">
                +100,000
              </button>
              <button onClick={() => handleMoneyPreset(1000000)} className="cg-pill text-[11px] py-1 px-2 hover:text-white">
                +1,000,000
              </button>
              <button onClick={() => handleSetMoney(9999999)} className="cg-pill text-[11px] py-1 px-2 text-amber-400 hover:text-white">
                Set 9,999,999
              </button>
            </div>
          </div>
        </div>

        {/* 3. Vitals: Health & Stamina */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-white/10 pb-2">
            <Heart className="w-4 h-4 text-rose-400" />
            Vitals & Energy
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#c4b5a0] text-[11px] mb-1">Max Health</label>
              <input
                type="number"
                aria-label="Max Health"
                value={activeModel.maxHealth}
                onChange={e => updateModel(prev => ({ ...prev, maxHealth: parseInt(e.target.value) || 100, health: parseInt(e.target.value) || 100 }))}
                className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-1.5 text-rose-300 font-bold focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-[#c4b5a0] text-[11px] mb-1">Max Stamina</label>
              <input
                type="number"
                aria-label="Max Stamina"
                value={activeModel.maxStamina}
                onChange={e => updateModel(prev => ({ ...prev, maxStamina: parseInt(e.target.value) || 450, stamina: parseInt(e.target.value) || 450 }))}
                className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-1.5 text-emerald-300 font-bold focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* 4. Skills & Mastery */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-white/10 pb-2">
            <Award className="w-4 h-4 text-purple-400" />
            Skill Mastery Levels (0–10)
          </h3>
          <div className="grid grid-cols-2 gap-2.5">
            {skillsList.map(s => (
              <div key={s.key} className="bg-black/30 p-2 rounded-xl border border-white/5 flex items-center justify-between">
                <span className="font-bold text-neutral-300 text-[11px]">{s.label}</span>
                <select
                  value={s.val}
                  onChange={e => updateModel(prev => ({ ...prev, [s.key]: parseInt(e.target.value) || 0 }))}
                  className="bg-black/60 border border-white/20 rounded-lg px-2 py-0.5 text-white font-bold focus:outline-none focus:border-amber-400 text-xs"
                >
                  {[...Array(11)].map((_, i) => (
                    <option key={i} value={i} className="bg-[#182228] text-white">
                      Lvl {i}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
