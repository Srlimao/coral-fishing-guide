import React from 'react';
import { useFishing } from '../../context/FishingContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { FISH_LIST, getFishSpriteUrl } from '../../data/fishData';
import { Calendar, AlertCircle, Sparkles, Clock, Check } from 'lucide-react';

export const SeasonalCalendarView: React.FC = () => {
  const { gameState, setDay, setSelectedFish, userProgress } = useFishing();
  const { getFishName, getLocationName, t } = useLanguage();

  const seasonalFish = FISH_LIST.filter(f => f.seasons.includes(gameState.season));

  const nextSeason =
    gameState.season === 'spring'
      ? 'summer'
      : gameState.season === 'summer'
      ? 'fall'
      : gameState.season === 'fall'
      ? 'winter'
      : 'spring';

  const leavingFish = seasonalFish.filter(f => !f.seasons.includes(nextSeason));

  return (
    <div className="space-y-6">
      {/* Calendar Header Card */}
      <div className="glass-panel p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              <span>
                {t(`season_${gameState.season}` as any, gameState.season).toUpperCase()} {t('calendar_title')} (Year {gameState.year})
              </span>
            </h2>
            <p className="text-xs text-neutral-300">
              {t('calendar_subtitle')}
            </p>
          </div>

          <div className="bg-black/30 px-3 py-1.5 rounded-xl border border-white/10 text-xs text-neutral-200">
            {t('selected_day')}: <strong className="text-amber-400 text-sm">{t('day_label')} {gameState.day}</strong>
          </div>
        </div>

        {/* 28-Day Grid Selector */}
        <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5 sm:gap-2">
          {Array.from({ length: 28 }, (_, i) => i + 1).map(d => {
            const isToday = gameState.day === d;
            return (
              <button
                key={d}
                onClick={() => setDay(d)}
                className={`py-2 px-1 rounded-xl text-center font-bold text-xs transition-all border ${
                  isToday
                    ? 'bg-amber-500 text-black border-amber-300 shadow-lg shadow-amber-500/30 scale-105'
                    : 'bg-black/40 text-neutral-300 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="text-[10px] block opacity-70">{t('day_label').toUpperCase()}</span>
                <span className="text-sm">{d}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Leaving at End of Season Alert Banner */}
      {leavingFish.length > 0 && (
        <div className="bg-gradient-to-r from-amber-950/80 to-rose-950/80 border border-amber-500/30 p-4 rounded-2xl text-xs text-neutral-200 space-y-2">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>{t('leaving_soon_title')} ({leavingFish.length}):</span>
          </div>
          <p className="text-neutral-400 text-[11px]">
            {t('leaving_soon_desc')}
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {leavingFish.map(f => {
              const isCaught = !!userProgress.caught[f.id];
              const locName = getFishName(f);
              return (
                <button
                  key={f.id}
                  onClick={() => setSelectedFish(f)}
                  className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all text-xs border ${
                    isCaught
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                      : 'bg-rose-950/60 text-rose-300 border-rose-500/40 hover:bg-rose-900/60'
                  }`}
                >
                  <img
                    src={getFishSpriteUrl(f.iconName, f.key, f.id)}
                    alt={locName}
                    className="w-4 h-4 object-contain inline"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                  <span>{locName}</span>
                  {isCaught ? <Check className="w-3 h-3 text-emerald-400" /> : <span className="text-[10px] text-amber-400">🚨 NEED</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Seasonal Fish Table Matrix */}
      <div className="glass-panel p-5 shadow-xl space-y-4">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{t(`season_${gameState.season}` as any, gameState.season)} {t('seasonal_matrix_title')} ({seasonalFish.length})</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-neutral-400 uppercase text-[10px]">
                <th className="py-2.5 px-3 min-w-[160px]">{t('col_fish_name')}</th>
                <th className="py-2.5 px-2">{t('col_rarity')}</th>
                <th className="py-2.5 px-2">{t('col_active_times')}</th>
                <th className="py-2.5 px-2">{t('col_primary_loc')}</th>
                <th className="py-2.5 px-2 text-center">{t('col_status')}</th>
                <th className="py-2.5 px-2 text-right">{t('col_value')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-neutral-200">
              {seasonalFish.map(fish => {
                const isCaught = !!userProgress.caught[fish.id];
                const isOffered = !!userProgress.offeredTemple[fish.id];
                const locFishName = getFishName(fish);

                return (
                  <tr
                    key={fish.id}
                    onClick={() => setSelectedFish(fish)}
                    className="hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center p-0.5 flex-shrink-0">
                          <img
                            src={getFishSpriteUrl(fish.iconName, fish.key, fish.id)}
                            alt={locFishName}
                            className="w-full h-full object-contain"
                            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                          />
                        </div>
                        <div>
                          <strong className="text-sm font-bold text-white hover:text-amber-400 block">
                            {locFishName}
                          </strong>
                          <span className="text-[10px] text-neutral-400">{fish.size} • {fish.difficulty}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full badge-rarity-${fish.rarity}`}>
                        {t(`rarity_${fish.rarity.toLowerCase()}` as any, fish.rarity)}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-neutral-300 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        {fish.times.map(tm => t(`time_${tm}` as any, tm)).join(', ')}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-neutral-300">
                      {fish.locations[0] ? getLocationName(fish.locations[0]) : t('any_waters')}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {isCaught && (
                          <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] px-1.5 py-0.5 rounded font-bold">
                            {t('btn_caught')}
                          </span>
                        )}
                        {isOffered && (
                          <span className="bg-amber-950 text-amber-300 border border-amber-500/40 text-[10px] px-1.5 py-0.5 rounded font-bold">
                            {t('btn_altar_needed')}
                          </span>
                        )}
                        {!isCaught && !isOffered && (
                          <span className="text-neutral-500 text-[11px]">-</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right font-bold text-amber-300">
                      {fish.sellPrice}g
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
