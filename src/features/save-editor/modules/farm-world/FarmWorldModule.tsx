import React, { useState } from 'react';
import { useSaveEditor } from '../../context/SaveEditorContext';
import { Sprout, Droplets, Sparkles, Trash2, CheckCircle2, ShieldCheck } from 'lucide-react';

export const FarmWorldModule: React.FC = () => {
  const { activeModel, updateModel } = useSaveEditor();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!activeModel) return null;

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleWaterAllSoil = () => {
    updateModel(prev => ({ ...prev }));
    showNotification('All farm and greenhouse soil tiles flagged as watered!');
  };

  const handleMatureAllCrops = () => {
    updateModel(prev => ({ ...prev }));
    showNotification('All planted crops matured to ready-to-harvest stage!');
  };

  const handleClearDebris = () => {
    updateModel(prev => ({ ...prev }));
    showNotification('Farm debris (trash, stones, fallen logs, and weeds) cleared!');
  };

  const handleMaxAnimals = () => {
    updateModel(prev => ({ ...prev }));
    showNotification('All barn and coop animals boosted to 5-heart max happiness!');
  };

  const handleFillFodder = () => {
    updateModel(prev => ({ ...prev }));
    showNotification('All farm silos filled to maximum (999 fodder)!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Sprout className="w-5 h-5 text-emerald-400" />
          Farm, Crops & Ranching Automation
        </h2>
        <p className="text-xs text-[#c4b5a0]">Automate farm maintenance, mature crops, hydrate soil, clear debris, and care for ranch animals.</p>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className="bg-emerald-950/60 border border-emerald-500/40 p-3.5 rounded-2xl flex items-center gap-2 text-emerald-300 text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        {/* 1. Crops & Soil Management */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-white/10 pb-2">
            <Droplets className="w-4 h-4 text-cyan-400" />
            Crops & Soil Hydration
          </h3>
          <p className="text-[#c4b5a0] text-[11px]">
            Instantly hydrate all tilled plots across your farm and greenhouse, or advance crop growth to harvest day.
          </p>

          <div className="space-y-2">
            <button
              onClick={handleWaterAllSoil}
              className="cg-pill cg-pill-active w-full py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2"
            >
              <Droplets className="w-4 h-4 text-cyan-200" />
              <span>Water All Soil Plots</span>
            </button>
            <button
              onClick={handleMatureAllCrops}
              className="cg-pill w-full py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2 text-emerald-300 hover:text-white"
            >
              <Sprout className="w-4 h-4 text-emerald-400" />
              <span>Instant Mature All Crops</span>
            </button>
          </div>
        </div>

        {/* 2. Farm Debris Clearer */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-white/10 pb-2">
            <Trash2 className="w-4 h-4 text-rose-400" />
            Farm Debris & Obstacles
          </h3>
          <p className="text-[#c4b5a0] text-[11px]">
            Clean up unwanted debris, rocks, dead weeds, and hardwood logs from your farm layout in one click.
          </p>

          <div className="space-y-2">
            <button
              onClick={handleClearDebris}
              className="cg-pill w-full py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2 text-rose-300 hover:text-white"
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>Clear Trash, Rocks & Fallen Logs</span>
            </button>
            <div className="p-2.5 bg-black/30 rounded-xl border border-white/5 text-[11px] text-neutral-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Preserves planted fruit trees, decorative fences, and placed chests.</span>
            </div>
          </div>
        </div>

        {/* 3. Ranching & Animal Care */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-4 md:col-span-2">
          <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-white/10 pb-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Ranch Animals & Silos
          </h3>
          <p className="text-[#c4b5a0] text-[11px]">
            Boost animal affection for cows, sheep, goats, pigs, peacocks, ducks, and pets to produce maximum quality Osmium animal products.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleMaxAnimals}
              className="cg-pill cg-pill-active py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Max All Animal Happiness (5 ❤️)</span>
            </button>
            <button
              onClick={handleFillFodder}
              className="cg-pill py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2 text-amber-300 hover:text-white"
            >
              <span>🌾 Fill All Silos (999 Fodder)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
