import React from 'react';
import { PlannerItem, AggregatedMaterial } from './types';
import { X, Trash2, Plus, Minus, Check, Copy, Coins, Boxes, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface PlannerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  plannerItems: PlannerItem[];
  aggregatedMaterials: AggregatedMaterial[];
  totalGoldCost: number;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onClearPlanner: () => void;
  onCopyShoppingList: () => void;
  copiedNotification: boolean;
}

export const PlannerDrawer: React.FC<PlannerDrawerProps> = ({
  isOpen,
  onClose,
  plannerItems,
  aggregatedMaterials,
  totalGoldCost,
  onUpdateQuantity,
  onRemoveItem,
  onToggleComplete,
  onClearPlanner,
  onCopyShoppingList,
  copiedNotification
}) => {
  const { getItemName, getBuildingName, t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <aside className="relative bg-[#182228] border-l border-white/20 w-full max-w-md h-full flex flex-col justify-between p-4 sm:p-5 shadow-2xl z-10 text-xs overflow-hidden">
        {/* Top Header */}
        <div className="space-y-3 pb-3 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Boxes className="w-5 h-5 text-cyan-400" />
              <div>
                <h2 className="text-base font-bold text-white leading-tight">
                  {t('wiki_planner_title', 'Project Planner')}
                </h2>
                <span className="text-[11px] text-[#c4b5a0]">
                  {plannerItems.length} {plannerItems.length === 1 ? 'Project' : 'Projects'} Planned
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {plannerItems.length > 0 && (
                <button
                  onClick={onClearPlanner}
                  title={t('wiki_planner_clear', 'Clear All')}
                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                aria-label="Close Planner"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          {plannerItems.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#13181b] p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] text-[#c4b5a0] uppercase font-bold flex items-center gap-1">
                  <Coins className="w-3 h-3 text-amber-400" /> {t('wiki_total_gold', 'Total Gold Cost')}
                </span>
                <span className="text-sm font-black text-amber-300">
                  {totalGoldCost.toLocaleString()}g
                </span>
              </div>

              <div className="bg-[#13181b] p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] text-[#c4b5a0] uppercase font-bold flex items-center gap-1">
                  📦 {t('wiki_total_materials', 'Materials Needed')}
                </span>
                <span className="text-sm font-black text-cyan-300">
                  {aggregatedMaterials.length} Types
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-3 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
          {plannerItems.length === 0 ? (
            <div className="py-12 text-center space-y-3 px-4">
              <div className="text-4xl">📋</div>
              <h3 className="font-bold text-white text-sm">Your Planner is Empty</h3>
              <p className="text-xs text-[#c4b5a0] leading-relaxed">
                {t(
                  'wiki_planner_empty',
                  'Browse through Crafting Recipes and Farm Buildings in the catalogue and click "+ Add to Planner" to calculate total raw materials.'
                )}
              </p>
            </div>
          ) : (
            <>
              {/* Planned Items Section */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#c4b5a0] uppercase tracking-wider block">
                  Planned Items & Buildings
                </span>

                <div className="space-y-1.5">
                  {plannerItems.map(item => {
                    const localizedItemName =
                      item.type === 'crafting'
                        ? getItemName(item.name, item.name)
                        : getBuildingName(item.name, item.name);

                    return (
                      <div
                        key={item.id}
                        className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                          item.completed
                            ? 'bg-[#13181b]/50 border-emerald-500/30 opacity-70'
                            : 'bg-[#13181b] border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <button
                            onClick={() => onToggleComplete(item.id)}
                            className={`p-1 rounded-lg transition-colors ${
                              item.completed
                                ? 'text-emerald-400 bg-emerald-500/20'
                                : 'text-neutral-500 hover:text-white bg-white/5'
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <div className="min-w-0">
                            <span
                              className={`font-bold text-xs truncate block ${
                                item.completed ? 'line-through text-neutral-400' : 'text-white'
                              }`}
                            >
                              {localizedItemName}
                            </span>
                            <span className="text-[10px] text-[#c4b5a0]">
                              {item.type === 'crafting' ? 'Recipe' : 'Building'}
                              {item.goldCost > 0 && ` • ${(item.goldCost * item.quantity).toLocaleString()}g`}
                            </span>
                          </div>
                        </div>

                        {/* Stepper + Delete */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <div className="flex items-center bg-white/5 rounded-lg border border-white/10">
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                              className="p-1 text-neutral-400 hover:text-white"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-1.5 text-xs font-bold text-cyan-300 min-w-[1.5rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="p-1 text-neutral-400 hover:text-white"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="p-1 text-neutral-400 hover:text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Aggregated Raw Materials Section */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-[11px] font-bold text-[#c4b5a0] uppercase tracking-wider block">
                  {t('wiki_total_materials', 'Aggregated Raw Materials Required')}
                </span>

                <div className="space-y-1">
                  {aggregatedMaterials.map((mat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 bg-[#13181b]/70 border border-white/5 rounded-xl"
                    >
                      <div className="flex items-center gap-2">
                        <span>{mat.iconEmoji || '📦'}</span>
                        <div>
                          <span className="font-bold text-white text-xs block">
                            {getItemName(mat.name, mat.name)}
                          </span>
                          {mat.source && (
                            <span className="text-[10px] text-neutral-400 block">{mat.source}</span>
                          )}
                        </div>
                      </div>
                      <span className="font-black text-cyan-300 text-xs">
                        {mat.totalAmount.toLocaleString()}x
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bottom Actions: Copy Shopping List */}
        {plannerItems.length > 0 && (
          <div className="pt-3 border-t border-white/10 flex-shrink-0">
            <button
              onClick={onCopyShoppingList}
              className="w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-black hover:from-cyan-400 hover:to-teal-400 transition-all shadow-md shadow-cyan-500/20"
            >
              {copiedNotification ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>
                {copiedNotification
                  ? t('wiki_planner_copied', 'Copied to Clipboard!')
                  : t('wiki_planner_copy', 'Copy Shopping List')}
              </span>
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};
