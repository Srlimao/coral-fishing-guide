import React from 'react';
import { TriviaCategory, AllCategoryStats } from './types';
import { TRIVIA_CATEGORIES, getItemsByCategory } from '../../data/triviaItemsData';
import { useLanguage } from '../../i18n/LanguageContext';
import { getTriviaCategoryName, getTriviaString } from '../../i18n/triviaTranslations';
import { Trophy, Play, CheckCircle2 } from 'lucide-react';

interface TriviaCategorySelectProps {
  allStats: AllCategoryStats;
  onSelectCategory: (cat: TriviaCategory) => void;
}

const CATEGORY_ICONS: Record<TriviaCategory, string> = {
  Fish: '🐟',
  Insect: '🦋',
  Critter: '🦀',
  Farm: '🌾',
  Forage: '🍄',
  Artisan: '🍯',
  Fossil: '🦴',
  Gem: '💎',
  Artifact: '🏺'
};

const CATEGORY_GRADIENTS: Record<TriviaCategory, string> = {
  Fish: 'from-blue-600/30 to-cyan-500/10 border-cyan-500/30 hover:border-cyan-400',
  Insect: 'from-emerald-600/30 to-lime-500/10 border-emerald-500/30 hover:border-emerald-400',
  Critter: 'from-teal-600/30 to-emerald-500/10 border-teal-500/30 hover:border-teal-400',
  Farm: 'from-amber-600/30 to-yellow-500/10 border-amber-500/30 hover:border-amber-400',
  Forage: 'from-orange-600/30 to-amber-500/10 border-orange-500/30 hover:border-orange-400',
  Artisan: 'from-purple-600/30 to-pink-500/10 border-purple-500/30 hover:border-purple-400',
  Fossil: 'from-stone-600/30 to-amber-900/10 border-stone-500/30 hover:border-stone-400',
  Gem: 'from-rose-600/30 to-pink-500/10 border-pink-500/30 hover:border-pink-400',
  Artifact: 'from-yellow-600/30 to-amber-600/10 border-yellow-500/30 hover:border-yellow-400'
};

export const TriviaCategorySelect: React.FC<TriviaCategorySelectProps> = ({
  allStats,
  onSelectCategory
}) => {
  const { language } = useLanguage();

  const totalWon = Object.values(allStats).filter(s => s.hasWon).length;

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden text-center space-y-3 border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider border border-amber-500/30">
          <Trophy className="w-3.5 h-3.5" />
          <span>Starlet Community Trivia</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {getTriviaString('title', language)}
        </h1>

        <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto">
          {getTriviaString('subtitle', language)}
        </p>

        <div className="flex items-center justify-center gap-6 pt-2 text-xs sm:text-sm text-neutral-400">
          <div className="flex items-center gap-1.5">
            <span className="text-rose-400">❤️❤️❤️</span>
            <strong className="text-white">3 {getTriviaString('hearts_label', language)}</strong>
          </div>
          <div className="w-[1px] h-3.5 bg-white/20" />
          <div className="flex items-center gap-1.5">
            <span>⏱️</span>
            <strong className="text-white">10.0s / Item</strong>
          </div>
          <div className="w-[1px] h-3.5 bg-white/20" />
          <div className="flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-400 inline" />
            <strong className="text-amber-300">{totalWon}/9 {language === 'pt' ? 'Vitórias' : 'Wins'}</strong>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {TRIVIA_CATEGORIES.map(cat => {
          const stats = allStats[cat] || { bestScore: 0, timesPlayed: 0, hasWon: false };
          const itemsCount = getItemsByCategory(cat).length;
          const localizedCatName = getTriviaCategoryName(cat, language);
          const icon = CATEGORY_ICONS[cat];
          const gradient = CATEGORY_GRADIENTS[cat];

          return (
            <div
              key={cat}
              data-testid={`category-card-${cat}`}
              onClick={() => onSelectCategory(cat)}
              className={`glass-panel p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.02] cursor-pointer relative group flex flex-col justify-between overflow-hidden shadow-lg bg-gradient-to-br ${gradient}`}
            >
              {/* Champion Badge if won */}
              {stats.hasWon && (
                <div className="absolute top-3.5 right-3.5 flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full text-[11px] font-bold shadow-md">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>WON</span>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                    {icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                      {localizedCatName}
                    </h3>
                    <p className="text-xs text-neutral-400">
                      {itemsCount} {language === 'pt' ? 'itens disponíveis' : 'pool items'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-neutral-400">{language === 'pt' ? 'Melhor: ' : 'Best: '}</span>
                  <strong className={stats.bestScore >= 9 ? 'text-amber-300 font-bold' : 'text-white'}>
                    {stats.bestScore}/15
                  </strong>
                </div>

                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors group-hover:bg-amber-500 group-hover:text-black shadow-sm">
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{getTriviaString('play_category', language)}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
