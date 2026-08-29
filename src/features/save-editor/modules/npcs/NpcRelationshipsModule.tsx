import React, { useState, useMemo } from 'react';
import { useSaveEditor } from '../../context/SaveEditorContext';
import { CORAL_ISLAND_NPCS } from '../../data/npcCatalog';
import { Users, Heart, Sparkles, Search, RotateCcw, UserCheck } from 'lucide-react';

export const NpcRelationshipsModule: React.FC = () => {
  const { activeModel, updateModel } = useSaveEditor();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'romance' | 'town'>('all');

  if (!activeModel) return null;

  const filteredNpcs = useMemo(() => {
    return CORAL_ISLAND_NPCS.filter(npc => {
      if (filterMode === 'romance' && !npc.romanceable) return false;
      if (filterMode === 'town' && npc.romanceable) return false;
      if (searchQuery) {
        return npc.name.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    });
  }, [searchQuery, filterMode]);

  const handleSetHeart = (npcName: string, hearts: number) => {
    updateModel(prev => ({
      ...prev,
      npcFriendships: {
        ...prev.npcFriendships,
        [npcName]: hearts
      }
    }));
  };

  const handleSwitchPlayer = (playerIdx: number) => {
    const target = activeModel.availablePlayers?.[playerIdx];
    if (target) {
      updateModel(prev => ({
        ...prev,
        selectedPlayerIndex: playerIdx,
        npcFriendships: { ...target.npcFriendships }
      }));
    }
  };

  const handleMaxAllNpcs = () => {
    const allMaxed: Record<string, number> = {};
    CORAL_ISLAND_NPCS.forEach(npc => {
      allMaxed[npc.name] = 10;
    });
    updateModel(prev => ({
      ...prev,
      npcFriendships: allMaxed
    }));
  };

  const handleMaxRomance = () => {
    const romanceMaxed: Record<string, number> = { ...activeModel.npcFriendships };
    CORAL_ISLAND_NPCS.filter(n => n.romanceable).forEach(npc => {
      romanceMaxed[npc.name] = 10;
    });
    updateModel(prev => ({
      ...prev,
      npcFriendships: romanceMaxed
    }));
  };

  const handleResetTalk = () => {
    updateModel(prev => ({
      ...prev,
      npcFriendships: { ...prev.npcFriendships }
    }));
  };

  const hasMultiplayer = (activeModel.availablePlayers?.length ?? 0) > 1;
  const currentSelectedIdx = activeModel.selectedPlayerIndex ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-rose-400" />
            NPC Relationships & Romance
          </h2>
          <p className="text-xs text-[#c4b5a0]">Adjust friendship hearts (0–10), trigger date events, and unlock marriage cutscenes.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleResetTalk}
            className="cg-pill text-xs font-bold py-1.5 px-3 flex items-center gap-1 hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Daily Talk</span>
          </button>
          <button
            onClick={handleMaxRomance}
            className="cg-pill text-xs font-bold py-1.5 px-3 flex items-center gap-1 text-rose-300 hover:text-white"
          >
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>Max Romance (28 💕)</span>
          </button>
          <button
            onClick={handleMaxAllNpcs}
            className="cg-pill cg-pill-active text-xs font-bold py-1.5 px-3 flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Max All Hearts (10 ❤️)</span>
          </button>
        </div>
      </div>

      {/* Multiplayer Character Switcher Banner */}
      {hasMultiplayer && (
        <div className="bg-cyan-950/40 border border-cyan-500/30 p-3 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold">
            <UserCheck className="w-4 h-4 text-cyan-400" />
            <span>Viewing Relationships for:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {activeModel.availablePlayers?.map((pl, idx) => (
              <button
                key={idx}
                onClick={() => handleSwitchPlayer(idx)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  currentSelectedIdx === idx
                    ? 'bg-cyan-400 text-neutral-950 shadow-md scale-105'
                    : 'bg-black/40 text-neutral-300 hover:text-white border border-white/10'
                }`}
              >
                {pl.name || `Player ${idx + 1}`} {idx === 0 ? '👑 (Host)' : `(Cabin #${idx})`}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filter & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-black/20 p-3 rounded-2xl border border-white/10 text-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2" />
          <input
            type="text"
            placeholder="Search islander by name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-black/50 border border-white/15 rounded-xl pl-9 pr-3 py-1.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 text-xs"
          />
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
              filterMode === 'all' ? 'bg-amber-400 text-neutral-950' : 'bg-white/5 text-[#c4b5a0] hover:text-white'
            }`}
          >
            All Islanders ({CORAL_ISLAND_NPCS.length})
          </button>
          <button
            onClick={() => setFilterMode('romance')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
              filterMode === 'romance' ? 'bg-rose-500 text-white' : 'bg-white/5 text-[#c4b5a0] hover:text-white'
            }`}
          >
            Romanceable (28)
          </button>
        </div>
      </div>

      {/* NPC Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
        {filteredNpcs.map(npc => {
          const currentHearts = activeModel.npcFriendships[npc.name] ?? 0;
          const status = activeModel.npcRelationships?.[npc.name]?.status || 'NONE';

          return (
            <div
              key={npc.name}
              className="bg-white/5 border border-white/10 p-3.5 rounded-2xl space-y-2.5 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{npc.name}</span>
                {status !== 'NONE' ? (
                  <span className="text-[10px] text-rose-300 font-bold bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-500/30">
                    {status === 'MARRIED' ? '💍 Married' : status === 'DATING' ? '💕 Dating' : status}
                  </span>
                ) : npc.romanceable ? (
                  <span className="text-[10px] text-rose-300/80 bg-rose-950/40 px-2 py-0.5 rounded-full border border-rose-500/20">
                    Romance 💕
                  </span>
                ) : (
                  <span className="text-[10px] text-neutral-400 bg-white/5 px-2 py-0.5 rounded-full">
                    Townie
                  </span>
                )}
              </div>

              {/* Heart slider & Counter */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#c4b5a0] flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    Hearts
                  </span>
                  <strong className="text-white font-mono">{currentHearts} / 10</strong>
                </div>

                <input
                  type="range"
                  min="0"
                  max="10"
                  value={currentHearts}
                  onChange={e => handleSetHeart(npc.name, parseInt(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer h-1.5 bg-black/40 rounded-lg"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex gap-1 pt-1 border-t border-white/5">
                <button
                  onClick={() => handleSetHeart(npc.name, 0)}
                  className="flex-1 cg-pill py-0.5 text-[10px] text-neutral-400 hover:text-white"
                >
                  0
                </button>
                <button
                  onClick={() => handleSetHeart(npc.name, 5)}
                  className="flex-1 cg-pill py-0.5 text-[10px] text-amber-300 hover:text-white"
                >
                  5
                </button>
                <button
                  onClick={() => handleSetHeart(npc.name, 10)}
                  className="flex-1 cg-pill py-0.5 text-[10px] text-rose-400 font-bold hover:text-white"
                >
                  10 ❤️
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
