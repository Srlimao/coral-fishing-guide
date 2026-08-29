import React, { useState } from 'react';
import { useSaveEditor } from '../../context/SaveEditorContext';
import { getItemDisplayName, CatalogItem } from '../../data/itemCatalog';
import { ItemSpawnerModal } from './ItemSpawnerModal';
import { Package, Sparkles, Trash2, Plus, ArrowUpRight } from 'lucide-react';

export const InventoryGridModule: React.FC = () => {
  const { activeModel, updateModel } = useSaveEditor();
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [showSpawner, setShowSpawner] = useState<boolean>(false);

  if (!activeModel) return null;

  const handleOpenSpawner = (slotIdx: number) => {
    setSelectedSlotIndex(slotIdx);
    setShowSpawner(true);
  };

  const handleSpawnItem = (slotIdx: number, item: CatalogItem, amount: number, quality: number) => {
    updateModel(prev => {
      const nextSlots = [...prev.inventorySlots];
      nextSlots[slotIdx] = {
        slotIndex: slotIdx,
        itemId: item.id,
        amount,
        quality
      };
      return { ...prev, inventorySlots: nextSlots };
    });
  };

  const handleClearSlot = (slotIdx: number) => {
    updateModel(prev => {
      const nextSlots = [...prev.inventorySlots];
      nextSlots[slotIdx] = {
        slotIndex: slotIdx,
        itemId: '',
        amount: 0,
        quality: 0
      };
      return { ...prev, inventorySlots: nextSlots };
    });
  };

  const handleMaxAllStacks = () => {
    updateModel(prev => ({
      ...prev,
      inventorySlots: prev.inventorySlots.map(s => s.itemId ? { ...s, amount: 999 } : s)
    }));
  };

  const handleUpgradeAllToOsmium = () => {
    updateModel(prev => ({
      ...prev,
      inventorySlots: prev.inventorySlots.map(s => s.itemId ? { ...s, quality: 4 } : s)
    }));
  };

  const qualityBadge = (q: number) => {
    if (q === 4) return <span className="text-[9px] font-bold text-purple-400 bg-purple-950/80 px-1 py-0.2 rounded border border-purple-500/40">Osmium 💜</span>;
    if (q === 3) return <span className="text-[9px] font-bold text-amber-400 bg-amber-950/80 px-1 py-0.2 rounded border border-amber-500/40">Gold 🥇</span>;
    if (q === 2) return <span className="text-[9px] font-bold text-slate-300 bg-slate-900/80 px-1 py-0.2 rounded border border-slate-400/40">Silver 🥈</span>;
    if (q === 1) return <span className="text-[9px] font-bold text-amber-600 bg-amber-950/80 px-1 py-0.2 rounded border border-amber-700/40">Bronze 🥉</span>;
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            Backpack Inventory & Item Spawner
          </h2>
          <p className="text-xs text-[#c4b5a0]">Manage your 40 inventory slots, inject items, boost stacks, and set quality tiers.</p>
        </div>

        {/* Batch Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleMaxAllStacks}
            className="cg-pill text-xs font-bold py-1.5 px-3 flex items-center gap-1 hover:text-white"
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
            <span>Max Stacks (999)</span>
          </button>
          <button
            onClick={handleUpgradeAllToOsmium}
            className="cg-pill cg-pill-active text-xs font-bold py-1.5 px-3 flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>All to Osmium (💜)</span>
          </button>
        </div>
      </div>

      {/* 40-Slot Visual Grid (4 rows of 10) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-2.5">
        {activeModel.inventorySlots.map((slot, idx) => {
          const hasItem = Boolean(slot.itemId);
          const displayName = hasItem ? getItemDisplayName(slot.itemId) : '';

          return (
            <div
              key={idx}
              data-slot-index={idx}
              onClick={() => handleOpenSpawner(idx)}
              className={`relative h-28 p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                hasItem
                  ? 'bg-black/40 border-white/15 hover:border-amber-400/80 hover:bg-black/60 shadow-lg'
                  : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/5 border-dashed'
              }`}
            >
              {/* Slot Number */}
              <div className="flex items-center justify-between text-[9px] text-neutral-500 font-mono">
                <span>#{idx + 1}</span>
                {hasItem && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClearSlot(idx);
                    }}
                    title="Clear Slot"
                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-rose-400 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Slot Content */}
              {hasItem ? (
                <div className="my-auto text-center space-y-1">
                  <div className="text-[10px] font-bold text-white line-clamp-2 leading-tight">
                    {displayName}
                  </div>
                  <div className="text-[9px] text-[#c4b5a0] font-mono">
                    {slot.itemId}
                  </div>
                </div>
              ) : (
                <div className="my-auto flex flex-col items-center justify-center text-neutral-600 group-hover:text-[#c4b5a0] transition-colors">
                  <Plus className="w-5 h-5 mb-0.5" />
                  <span className="text-[9px]">Empty</span>
                </div>
              )}

              {/* Bottom: Stack count & Quality Badge */}
              <div className="flex items-center justify-between min-h-[16px]">
                {hasItem ? (
                  <>
                    <span className="text-[10px] font-mono font-bold text-amber-300">
                      x{slot.amount}
                    </span>
                    {qualityBadge(slot.quality)}
                  </>
                ) : (
                  <span />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Item Spawner Modal */}
      {showSpawner && selectedSlotIndex !== null && (
        <ItemSpawnerModal
          isOpen={showSpawner}
          targetSlotIndex={selectedSlotIndex}
          onClose={() => setShowSpawner(false)}
          onSpawnItem={handleSpawnItem}
        />
      )}
    </div>
  );
};
