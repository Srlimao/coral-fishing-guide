import React from 'react';
import { useSaveEditor } from '../../context/SaveEditorContext';
import { Season } from '../../../../types/fishing';
import { Calendar, CloudSun, Compass, Sparkles, CheckCircle2 } from 'lucide-react';

export const CalendarWorldModule: React.FC = () => {
  const { activeModel, updateModel } = useSaveEditor();

  if (!activeModel) return null;

  const seasons: Array<{ id: Season; label: string; icon: string }> = [
    { id: 'spring', label: 'Spring', icon: '🌸' },
    { id: 'summer', label: 'Summer', icon: '☀️' },
    { id: 'fall', label: 'Fall', icon: '🍂' },
    { id: 'winter', label: 'Winter', icon: '❄️' }
  ];

  const weathers = [
    { id: 'sunny', label: 'Sunny', icon: '☀️' },
    { id: 'rain', label: 'Rain', icon: '🌧️' },
    { id: 'storm', label: 'Storm', icon: '⛈️' },
    { id: 'snow', label: 'Snow', icon: '🌨️' },
    { id: 'blizzard', label: 'Blizzard', icon: '❄️' },
    { id: 'windy', label: 'Windy', icon: '🍃' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-amber-400" />
          Calendar, Weather & World Waypoints
        </h2>
        <p className="text-xs text-[#c4b5a0]">Adjust in-game date, set weather patterns, activate diving solar orbs, and unlock mine elevators.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        {/* 1. Date & Season */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-white/10 pb-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            Calendar Date
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-[#c4b5a0] text-[11px] mb-1.5 font-bold">Season</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {seasons.map(s => (
                  <button
                    key={s.id}
                    onClick={() => updateModel(prev => ({ ...prev, season: s.id }))}
                    className={`py-2 px-2.5 rounded-xl border text-center font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                      activeModel.season === s.id
                        ? 'bg-amber-400 text-neutral-950 border-amber-300 shadow-md'
                        : 'bg-black/30 border-white/10 text-[#c4b5a0] hover:text-white hover:border-white/20'
                    }`}
                  >
                    <span>{s.icon}</span>
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[#c4b5a0] text-[11px] mb-1 font-bold">Day (1–28)</label>
                <input
                  type="number"
                  min="1"
                  max="28"
                  value={activeModel.day}
                  onChange={e => updateModel(prev => ({ ...prev, day: Math.max(1, Math.min(28, parseInt(e.target.value) || 1)) }))}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-1.5 text-white font-bold text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-[#c4b5a0] text-[11px] mb-1 font-bold">Year</label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={activeModel.year}
                  onChange={e => updateModel(prev => ({ ...prev, year: Math.max(1, parseInt(e.target.value) || 1) }))}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-1.5 text-white font-bold text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Weather Override */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-white/10 pb-2">
            <CloudSun className="w-4 h-4 text-amber-400" />
            Weather Forecast
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-[#c4b5a0] text-[11px] mb-1.5 font-bold">Active Weather</label>
              <div className="grid grid-cols-3 gap-1.5">
                {weathers.map(w => (
                  <button
                    key={w.id}
                    onClick={() => updateModel(prev => ({ ...prev, weather: w.id }))}
                    className={`py-1.5 px-2 rounded-xl border text-center font-bold text-[11px] transition-all flex items-center justify-center gap-1 ${
                      activeModel.weather === w.id
                        ? 'bg-amber-950/60 border-amber-400 text-amber-300'
                        : 'bg-black/30 border-white/5 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span>{w.icon}</span>
                    <span>{w.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Island Exploration & Waypoint Unlocks */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-3 md:col-span-2">
          <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-white/10 pb-2">
            <Compass className="w-4 h-4 text-purple-400" />
            Island Exploration & Waypoints
          </h3>

          <p className="text-[#c4b5a0] text-[11px]">
            Unlock all fast-travel shrines around Starlet Town, heal all coral reefs, and activate cavern elevator shafts.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <button
              onClick={() => updateModel(prev => ({ ...prev }))}
              className="cg-pill cg-pill-active py-2.5 px-3 text-xs font-bold flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Unlock Fast Travel Shrines</span>
            </button>
            <button
              onClick={() => updateModel(prev => ({ ...prev }))}
              className="cg-pill py-2.5 px-3 text-xs font-bold flex items-center justify-center gap-2 text-cyan-300 hover:text-white"
            >
              <span>🤿 Activate All Solar Orbs</span>
            </button>
            <button
              onClick={() => updateModel(prev => ({ ...prev }))}
              className="cg-pill py-2.5 px-3 text-xs font-bold flex items-center justify-center gap-2 text-amber-300 hover:text-white"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Unlock Mine Elevators</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
