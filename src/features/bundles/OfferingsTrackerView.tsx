import React from 'react';
import { useFishing } from '../../context/FishingContext';
import { FISH_LIST, getFishSpriteUrl } from '../../data/fishData';
import { Sparkles, Check } from 'lucide-react';

interface BundleGroup {
  name: string;
  category: string;
  reward: string;
  items: Array<{
    fishId: string;
    fishName: string;
    amount: number;
    quality: string;
  }>;
}

export const TEMPLE_BUNDLES: BundleGroup[] = [
  {
    name: 'Fresh Water Fish Bundle',
    category: 'Catching Altar',
    reward: 'Fish Pond & Small Fish Bait x10',
    items: [
      { fishId: 'item_71002', fishName: 'Catfish', amount: 1, quality: 'Regular' },
      { fishId: 'item_71004', fishName: 'Tilapia', amount: 1, quality: 'Regular' },
      { fishId: 'item_71009', fishName: 'Rainbow fish', amount: 1, quality: 'Regular' },
      { fishId: 'item_71005', fishName: 'Silver arowana', amount: 1, quality: 'Regular' },
      { fishId: 'item_71001', fishName: 'Giant snakehead', amount: 1, quality: 'Regular' }
    ]
  },
  {
    name: 'Salt Water Fish Bundle',
    category: 'Catching Altar',
    reward: 'Recycling Machine & Medium Fish Bait x10',
    items: [
      { fishId: 'item_72001', fishName: 'Pink snapper', amount: 1, quality: 'Regular' },
      { fishId: 'item_72002', fishName: 'Lionfish', amount: 1, quality: 'Regular' },
      { fishId: 'item_72003', fishName: 'Tuna', amount: 1, quality: 'Regular' },
      { fishId: 'item_72004', fishName: 'Sardine', amount: 1, quality: 'Regular' }
    ]
  },
  {
    name: 'Rare Fish Bundle',
    category: 'Catching Altar',
    reward: 'Fish House & Large Fish Bait x10',
    items: [
      { fishId: 'item_72005', fishName: 'Giant mudskipper', amount: 1, quality: 'Regular' },
      { fishId: 'item_71010', fishName: 'Sturgeon', amount: 1, quality: 'Regular' },
      { fishId: 'item_71008', fishName: 'Gator gar', amount: 1, quality: 'Regular' },
      { fishId: 'item_72006', fishName: 'Yellow moray eel', amount: 1, quality: 'Regular' }
    ]
  },
  {
    name: 'Night Fishing Bundle',
    category: 'Catching Altar',
    reward: 'Warp Sesajen x5 & Glow Ring',
    items: [
      { fishId: 'item_72007', fishName: 'Asian sheepshead', amount: 1, quality: 'Regular' },
      { fishId: 'item_71007', fishName: 'Black phantom ghost fish', amount: 1, quality: 'Regular' },
      { fishId: 'item_72008', fishName: 'Moray eel', amount: 1, quality: 'Regular' },
      { fishId: 'item_72009', fishName: 'Barramundi', amount: 1, quality: 'Regular' }
    ]
  },
  {
    name: 'Day Fishing Bundle',
    category: 'Catching Altar',
    reward: 'Sprinkler II x2 & Fertilized Bait x5',
    items: [
      { fishId: 'item_71011', fishName: 'Bluegill', amount: 1, quality: 'Regular' },
      { fishId: 'item_72010', fishName: 'Pufferfish', amount: 1, quality: 'Regular' },
      { fishId: 'item_72011', fishName: 'Green sawfish', amount: 1, quality: 'Regular' },
      { fishId: 'item_74001', fishName: 'Red king arowana', amount: 1, quality: 'Regular' }
    ]
  }
];

export const OfferingsTrackerView: React.FC = () => {
  const { userProgress, toggleOffered, setSelectedFish } = useFishing();

  return (
    <div className="space-y-6">
      {/* Altar Header */}
      <div className="glass-panel p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Goddess Lake Temple Offerings (Catching Altar)</span>
            </h2>
            <p className="text-xs text-neutral-300">
              Track required fish offerings to restore the Goddess Lake and unlock community rewards.
            </p>
          </div>
        </div>
      </div>

      {/* Bundles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {TEMPLE_BUNDLES.map(bundle => {
          const completedCount = bundle.items.filter(item => userProgress.offeredTemple[item.fishId]).length;
          const isAllCompleted = completedCount === bundle.items.length;
          const progressPercent = Math.round((completedCount / bundle.items.length) * 100);

          return (
            <div
              key={bundle.name}
              className={`cg-card p-5 space-y-4 border-2 transition-all ${
                isAllCompleted ? 'border-amber-400/80 bg-[#faf6ed]' : 'border-[#e2d3be]'
              }`}
            >
              {/* Bundle Header */}
              <div className="flex items-start justify-between gap-2 border-b border-[#e5d8c3] pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                    {bundle.category}
                  </span>
                  <h3 className="text-lg font-bold text-[#3d2f1a] flex items-center gap-2">
                    <span>{bundle.name}</span>
                    {isAllCompleted && <span className="text-amber-500">✨ Complete!</span>}
                  </h3>
                  <span className="text-xs text-[#8c785b] block mt-0.5">
                    🎁 Reward: <strong className="text-[#5a4627]">{bundle.reward}</strong>
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-[#3d2f1a]">
                    {completedCount} / {bundle.items.length}
                  </span>
                  <span className="text-[10px] text-[#8c785b] block">({progressPercent}%)</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-[#e2d5be] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Required Items List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {bundle.items.map(item => {
                  const isOffered = !!userProgress.offeredTemple[item.fishId];
                  const fishData = FISH_LIST.find(f => f.id === item.fishId);

                  return (
                    <div
                      key={item.fishId}
                      onClick={() => fishData && setSelectedFish(fishData)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isOffered
                          ? 'bg-amber-100/80 border-amber-300 text-amber-900 shadow-sm'
                          : 'bg-[#f0e8d8] border-[#e2d5be] text-[#5a4627] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleOffered(item.fishId);
                          }}
                          className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                            isOffered
                              ? 'bg-amber-500 text-white shadow-sm'
                              : 'bg-white/80 border border-[#d1c2ab] text-transparent hover:text-neutral-400'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <div className="w-7 h-7 rounded-md bg-white/70 border border-[#e2d5be] p-0.5 flex items-center justify-center flex-shrink-0">
                          <img
                            src={getFishSpriteUrl(fishData?.iconName, fishData?.key, item.fishId)}
                            alt={item.fishName}
                            className="w-full h-full object-contain"
                            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                          />
                        </div>
                        <div>
                          <strong className="text-xs font-bold block">{item.fishName}</strong>
                          {fishData && (
                            <span className="text-[10px] text-[#8c785b] line-clamp-1">
                              {fishData.seasons.join(', ')} • {fishData.locations[0]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
