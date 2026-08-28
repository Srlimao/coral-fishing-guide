import React, { useState } from 'react';
import { useFishing } from '../../context/FishingContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { FISH_MAP, getFishSpriteUrl } from '../../data/fishData';
import { ALL_ALTARS, AltarCategory } from '../../data/bundlesData';
import { Sparkles, Check, Gift, Layers, Fish } from 'lucide-react';

export const OfferingsTrackerView: React.FC = () => {
  const { userProgress, toggleOffered, setSelectedFish } = useFishing();
  const { getFishName, getLocationName, getAltarTitle, getBundleTitle, getOfferingItemName, t } = useLanguage();
  const [selectedAltarKey, setSelectedAltarKey] = useState<string>('all');

  const displayedAltars: AltarCategory[] = selectedAltarKey === 'all'
    ? ALL_ALTARS
    : ALL_ALTARS.filter(a => a.key === selectedAltarKey);

  // Overall Stats across all altars
  const totalOfferingsCount = ALL_ALTARS.reduce((acc, a) => 
    acc + a.bundles.reduce((bAcc, b) => bAcc + b.items.length, 0), 0
  );
  const completedOfferingsCount = ALL_ALTARS.reduce((acc, a) => 
    acc + a.bundles.reduce((bAcc, b) => bAcc + b.items.filter(i => userProgress.offeredTemple[i.itemId]).length, 0), 0
  );

  return (
    <div className="space-y-6">
      {/* Altar Header */}
      <div className="glass-panel p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>{t('altar_header_main_title')}</span>
            </h2>
            <p className="text-xs text-neutral-300 mt-0.5">
              {t('altar_header_desc')}
            </p>
          </div>

          <div className="bg-black/30 border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-3">
            <Layers className="w-5 h-5 text-amber-400" />
            <div className="text-right">
              <span className="text-[10px] text-neutral-400 block uppercase font-semibold">{t('altar_total_progress')}</span>
              <span className="text-sm font-bold text-white">
                {completedOfferingsCount} / {totalOfferingsCount} ({Math.round((completedOfferingsCount / totalOfferingsCount) * 100 || 0)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Altar Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 mt-4 border-t border-white/10 scrollbar-thin">
          <button
            onClick={() => setSelectedAltarKey('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${
              selectedAltarKey === 'all'
                ? 'bg-amber-400 text-neutral-900 shadow-md font-extrabold'
                : 'bg-white/10 text-neutral-300 hover:bg-white/15'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t('altar_filter_all')}</span>
          </button>

          {ALL_ALTARS.map(altar => {
            const isCatching = altar.key === 'CatchingBased';
            const total = altar.bundles.reduce((acc, b) => acc + b.items.length, 0);
            const done = altar.bundles.reduce((acc, b) => acc + b.items.filter(i => userProgress.offeredTemple[i.itemId]).length, 0);
            const isSelected = selectedAltarKey === altar.key;

            return (
              <button
                key={altar.key}
                onClick={() => setSelectedAltarKey(altar.key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${
                  isSelected
                    ? 'bg-amber-400 text-neutral-900 shadow-md font-extrabold'
                    : 'bg-white/10 text-neutral-300 hover:bg-white/15'
                }`}
              >
                {isCatching && <Fish className="w-3.5 h-3.5 text-amber-500" />}
                <span>{getAltarTitle(altar.key, altar.title)}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  isSelected ? 'bg-amber-900/20 text-neutral-900' : 'bg-black/40 text-neutral-400'
                }`}>
                  {done}/{total}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Altars Section */}
      <div className="space-y-8">
        {displayedAltars.map(altar => (
          <div key={altar.key} className="space-y-4">
            {/* Section Title */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{getAltarTitle(altar.key, altar.title)}</span>
                </h3>
                {altar.reward && (
                  <p className="text-xs text-amber-300/90 flex items-center gap-1 mt-0.5">
                    <Gift className="w-3.5 h-3.5" />
                    <span>{t('reward_label')}: <strong>{altar.reward}</strong></span>
                  </p>
                )}
              </div>
            </div>

            {/* Bundles Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {altar.bundles.map(bundle => {
                const completedCount = bundle.items.filter(item => userProgress.offeredTemple[item.itemId]).length;
                const isAllCompleted = completedCount === bundle.items.length;
                const progressPercent = Math.round((completedCount / bundle.items.length) * 100);

                return (
                  <div
                    key={bundle.title}
                    className={`cg-card p-5 space-y-3.5 border-2 transition-all ${
                      isAllCompleted ? 'border-amber-400/80 bg-[#faf6ed]' : 'border-[#e2d3be]'
                    }`}
                  >
                    {/* Bundle Header */}
                    <div className="flex items-start justify-between gap-2 border-b border-[#e5d8c3] pb-2.5">
                      <div>
                        <h4 className="text-base font-bold text-[#3d2f1a] flex items-center gap-2">
                          <span>{getBundleTitle(bundle.title)}</span>
                          {isAllCompleted && <span className="text-amber-600 text-xs">✨ {t('bundle_complete')}</span>}
                        </h4>
                        {bundle.reward && (
                          <span className="text-xs text-[#8c785b] block mt-0.5">
                            🎁 {t('reward_label')}: <strong className="text-[#5a4627]">{bundle.reward}</strong>
                          </span>
                        )}
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {bundle.items.map(item => {
                        const isOffered = !!userProgress.offeredTemple[item.itemId];
                        const fishData = FISH_MAP[item.itemId];
                        const locItemName = fishData ? getFishName(fishData) : getOfferingItemName(item.itemName);

                        return (
                          <div
                            key={item.itemId}
                            onClick={() => fishData && setSelectedFish(fishData)}
                            className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                              isOffered
                                ? 'bg-amber-100/80 border-amber-300 text-amber-900 shadow-sm'
                                : 'bg-[#f0e8d8] border-[#e2d5be] text-[#5a4627] hover:bg-white'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleOffered(item.itemId);
                                }}
                                className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all ${
                                  isOffered
                                    ? 'bg-amber-500 text-white shadow-sm'
                                    : 'bg-white/80 border border-[#d1c2ab] text-transparent hover:text-neutral-400'
                                }`}
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              
                              <div className="w-6 h-6 rounded-md bg-white/70 border border-[#e2d5be] p-0.5 flex items-center justify-center flex-shrink-0">
                                <img
                                  src={getFishSpriteUrl(fishData?.iconName || item.iconName, fishData?.key || item.fishKey, item.itemId)}
                                  alt={locItemName}
                                  className="w-full h-full object-contain"
                                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                                />
                              </div>

                              <div className="truncate">
                                <div className="flex items-center gap-1">
                                  <strong className="text-xs font-bold truncate block">{locItemName}</strong>
                                  {item.quality && item.quality !== 'base' && (
                                    <span className="text-[9px] px-1 py-0.2 rounded font-bold uppercase bg-amber-200 text-amber-900">
                                      {item.quality}
                                    </span>
                                  )}
                                  {item.amount > 1 && (
                                    <span className="text-[10px] text-neutral-500 font-bold">x{item.amount}</span>
                                  )}
                                </div>
                                {fishData && (
                                  <span className="text-[10px] text-[#8c785b] line-clamp-1 block">
                                    {fishData.seasons.map(s => t(`season_${s}` as any, s)).join(', ')} • {getLocationName(fishData.locations[0])}
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
        ))}
      </div>
    </div>
  );
};
