import React from 'react';
import { TownieLeaderboardEntry } from './types';
import { useLanguage } from '../../i18n/LanguageContext';
import { getTriviaString } from '../../i18n/triviaTranslations';
import { Trophy, Medal, Award } from 'lucide-react';

interface TriviaLeaderboardProps {
  entries: TownieLeaderboardEntry[];
  playerScore?: number;
}

export const TriviaLeaderboard: React.FC<TriviaLeaderboardProps> = ({
  entries,
  playerScore
}) => {
  const { language } = useLanguage();

  return (
    <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            {getTriviaString('town_leaderboard', language)}
          </h3>
        </div>
        {playerScore !== undefined && (
          <span className="text-xs font-semibold text-amber-300">
            {language === 'pt' ? 'Você: ' : 'You: '} {playerScore} pts
          </span>
        )}
      </div>

      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {entries.map((entry, index) => {
          const rank = index + 1;
          const isTop3 = rank <= 3;
          const isPlayer = entry.isPlayer;

          let rankBadge = (
            <span className="w-5 text-center text-xs font-bold text-neutral-400">
              #{rank}
            </span>
          );

          if (rank === 1) {
            rankBadge = <Trophy className="w-4 h-4 text-yellow-400 flex-shrink-0" />;
          } else if (rank === 2) {
            rankBadge = <Medal className="w-4 h-4 text-neutral-300 flex-shrink-0" />;
          } else if (rank === 3) {
            rankBadge = <Award className="w-4 h-4 text-amber-600 flex-shrink-0" />;
          }

          return (
            <div
              key={entry.id}
              className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                isPlayer
                  ? 'bg-amber-500/20 border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : isTop3
                  ? 'bg-white/10 border-white/15'
                  : 'bg-black/20 border-white/5 opacity-80'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-6 flex items-center justify-center">
                  {rankBadge}
                </div>

                <div className="w-8 h-8 rounded-full overflow-hidden bg-black/40 border border-white/20 flex-shrink-0 flex items-center justify-center">
                  <img
                    src={entry.portrait}
                    alt={entry.name}
                    className="w-full h-full object-cover"
                    onError={e => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`font-bold truncate ${
                        isPlayer ? 'text-amber-300' : 'text-white'
                      }`}
                    >
                      {entry.name}
                    </span>
                    {isPlayer && (
                      <span className="px-1.5 py-0.2 bg-amber-400 text-black text-[9px] font-extrabold rounded-full">
                        YOU
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-neutral-400 truncate">{entry.title}</p>
                </div>
              </div>

              <div className="text-right pl-2 flex-shrink-0">
                <strong
                  className={`text-sm font-extrabold ${
                    isPlayer ? 'text-amber-300' : 'text-white'
                  }`}
                >
                  {entry.score}
                </strong>
                <span className="text-[10px] text-neutral-400 ml-0.5">pts</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
