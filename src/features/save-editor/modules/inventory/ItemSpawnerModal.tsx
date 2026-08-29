import React, { useState, useMemo } from 'react';
import { searchItemCatalog, ITEM_CATEGORIES, ItemCategory, CatalogItem } from '../../data/itemCatalog';
import { X, Search, Sparkles, PlusCircle } from 'lucide-react';

interface ItemSpawnerModalProps {
  isOpen: boolean;
  targetSlotIndex: number;
  onClose: () => void;
  onSpawnItem: (slotIndex: number, item: CatalogItem, amount: number, quality: number) => void;
}

export const ItemSpawnerModal: React.FC<ItemSpawnerModalProps> = ({
  isOpen,
  targetSlotIndex,
  onClose,
  onSpawnItem
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>('All');
  const [selectedQuality, setSelectedQuality] = useState<number>(4); // Default to Osmium
  const [stackAmount, setStackAmount] = useState<number>(1);
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);

  const filteredItems = useMemo(() => {
    return searchItemCatalog(searchQuery, selectedCategory, 60);
  }, [searchQuery, selectedCategory]);

  if (!isOpen) return null;

  const qualityLabels = [
    { tier: 0, label: 'Normal', color: 'bg-neutral-600 text-white' },
    { tier: 1, label: 'Bronze 🥉', color: 'bg-amber-800 text-amber-100' },
    { tier: 2, label: 'Silver 🥈', color: 'bg-slate-400 text-slate-950 font-bold' },
    { tier: 3, label: 'Gold 🥇', color: 'bg-amber-500 text-amber-950 font-bold' },
    { tier: 4, label: 'Osmium 💜', color: 'bg-purple-600 text-purple-100 font-bold ring-1 ring-purple-400' }
  ];

  const handleSpawn = () => {
    if (!selectedItem) return;
    onSpawnItem(targetSlotIndex, selectedItem, stackAmount, selectedQuality);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="item-spawner-title"
        className="bg-[#182228] text-white border border-white/15 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <div>
              <h2 id="item-spawner-title" className="text-base font-bold text-white">
                Item Spawner (Slot #{targetSlotIndex + 1})
              </h2>
              <p className="text-[11px] text-[#c4b5a0]">Search 4,700+ game items, pick quality tier, and inject into backpack.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters & Search */}
        <div className="p-4 space-y-3 border-b border-white/10 bg-black/20 text-xs">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search items by name, ID (e.g. item_72001) or description..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-black/50 border border-white/15 rounded-xl pl-9 pr-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 text-xs"
            />
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
            {ITEM_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-amber-400 text-neutral-950'
                    : 'bg-white/5 hover:bg-white/10 text-[#c4b5a0] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Quality & Amount Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-white/5">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[#c4b5a0] font-bold">Quality:</span>
              <div className="flex gap-1">
                {qualityLabels.map(q => (
                  <button
                    key={q.tier}
                    onClick={() => setSelectedQuality(q.tier)}
                    className={`px-2 py-0.5 rounded-md text-[10px] transition-all ${q.color} ${
                      selectedQuality === q.tier ? 'scale-105 shadow-md ring-2 ring-white' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#c4b5a0] font-bold">Count:</span>
              <input
                type="number"
                min="1"
                max="999"
                value={stackAmount}
                onChange={e => setStackAmount(Math.max(1, Math.min(999, parseInt(e.target.value) || 1)))}
                className="w-16 bg-black/60 border border-white/20 rounded-lg px-2 py-0.5 text-center font-bold text-xs text-white"
              />
              <button onClick={() => setStackAmount(999)} className="cg-pill text-[10px] py-0.5 px-1.5 text-amber-300">
                Max (999)
              </button>
            </div>
          </div>
        </div>

        {/* Item Results Grid */}
        <div className="p-4 flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {filteredItems.length === 0 ? (
            <div className="col-span-2 text-center py-8 text-neutral-500 text-xs">
              No items matching "{searchQuery}"
            </div>
          ) : (
            filteredItems.map(item => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  data-item-id={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-purple-950/60 border-purple-400 ring-1 ring-purple-400'
                      : 'bg-black/30 border-white/5 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-white text-[11px]">{item.name}</span>
                    <span className="text-[9px] text-[#c4b5a0] bg-white/5 px-1.5 py-0.2 rounded font-mono">
                      {item.id}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">{item.description}</p>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between bg-black/30">
          <div className="text-xs text-[#c4b5a0]">
            {selectedItem ? (
              <span>
                Selected: <strong className="text-white">{selectedItem.name}</strong> ({stackAmount}x)
              </span>
            ) : (
              <span className="text-neutral-500">Pick an item from the list above</span>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="cg-pill px-4 py-1.5 text-xs">
              Cancel
            </button>
            <button
              disabled={!selectedItem}
              onClick={handleSpawn}
              className={`cg-pill cg-pill-active px-5 py-1.5 text-xs font-bold flex items-center gap-1.5 ${
                !selectedItem ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Spawn Item</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
