import React from 'react';
import { TriviaCategory, TriviaRoundQuestionResult, TownieLeaderboardEntry } from './types';
import { useLanguage } from '../../i18n/LanguageContext';
import { getTriviaCategoryName, getTriviaString } from '../../i18n/triviaTranslations';
import { TriviaLeaderboard } from './TriviaLeaderboard';
import { RotateCcw, LayoutGrid, Check, X, Clock } from 'lucide-react';

interface TriviaResultsModalProps {
  category: TriviaCategory;
  score: number;
  results: TriviaRoundQuestionResult[];
  leaderboard: TownieLeaderboardEntry[];
  onPlayAgain: () => void;
  onChooseCategory: () => void;
}

export const TriviaResultsModal: React.FC<TriviaResultsModalProps> = ({
  category,
  score,
  results,
  leaderboard,
  onPlayAgain,
  onChooseCategory
}) => {
  const { language } = useLanguage();
  const isWin = score >= 9;
  const categoryName = getTriviaCategoryName(category, language);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Result Fanfare Header */}
      <div
        className={`glass-panel p-6 sm:p-8 rounded-3xl border text-center space-y-3 relative overflow-hidden shadow-2xl ${
          isWin
            ? 'bg-gradient-to-b from-amber-500/20 to-transparent border-amber-500/40'
            : 'bg-gradient-to-b from-rose-500/20 to-transparent border-rose-500/40'
        }`}
      >
        <div className="w-16 h-16 mx-auto rounded-2xl bg-black/40 border border-white/20 flex items-center justify-center text-3xl shadow-inner">
          {isWin ? '🏆' : '💀'}
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          {isWin
            ? getTriviaString('victory_title', language)
            : getTriviaString('defeat_title', language)}
        </h2>

        <p className="text-sm text-neutral-300 max-w-lg mx-auto">
          {isWin
            ? getTriviaString('victory_desc', language)
            : getTriviaString('defeat_desc', language)}
        </p>

        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-black/40 border border-white/10 text-sm">
          <span className="text-neutral-400">{getTriviaString('score_label', language)}:</span>
          <strong className={`text-xl font-black ${isWin ? 'text-amber-300' : 'text-rose-400'}`}>
            {score} / 15
          </strong>
        </div>
      </div>

      {/* Main Grid: Breakdown & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Question Breakdown */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {language === 'pt' ? 'Resumo das 15 Questões' : '15-Item Round Breakdown'}
            </h3>
            <span className="text-xs text-neutral-400">
              {categoryName}
            </span>
          </div>

          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {results.map((res, index) => {
              const targetName = res.targetItem.translations[language] || res.targetItem.englishName;

              return (
                <div
                  key={index}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                    res.isCorrect
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-rose-500/10 border-rose-500/30'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-black/50 border border-white/10 p-1 flex-shrink-0 flex items-center justify-center">
                      <img
                        src={res.targetItem.imagePath}
                        alt={res.targetItem.englishName}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white truncate">{targetName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-3 h-3" />
                          {res.timeSpentSeconds}s
                        </span>
                        {!res.isCorrect && res.selectedOptionId === null && (
                          <span className="text-rose-400 font-semibold">
                            {getTriviaString('timeout_fail', language)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    {res.isCorrect ? (
                      <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 inline-flex">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="p-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 inline-flex">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Starlet Town Leaderboard */}
        <div className="lg:col-span-1">
          <TriviaLeaderboard entries={leaderboard} playerScore={score} />
        </div>
      </div>

      {/* Footer Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <button
          onClick={onPlayAgain}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:scale-105"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{getTriviaString('play_again', language)}</span>
        </button>

        <button
          onClick={onChooseCategory}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-colors border border-white/10 flex items-center justify-center gap-2"
        >
          <LayoutGrid className="w-4 h-4" />
          <span>{getTriviaString('choose_category', language)}</span>
        </button>
      </div>
    </div>
  );
};
