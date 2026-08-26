import React from 'react';
import { TriviaQuestion, TriviaCategory } from './types';
import { useLanguage } from '../../i18n/LanguageContext';
import { getTriviaCategoryName, getTriviaString } from '../../i18n/triviaTranslations';
import { Heart, Clock, Check, X, Sparkles } from 'lucide-react';

interface TriviaQuestionCardProps {
  category: TriviaCategory;
  question: TriviaQuestion;
  currentIndex: number;
  totalQuestions: number;
  hearts: number;
  score: number;
  timeLeft: number;
  isAnswered: boolean;
  selectedOptionId: string | null;
  onSelectOption: (optionId: string) => void;
  onQuit: () => void;
}

export const TriviaQuestionCard: React.FC<TriviaQuestionCardProps> = ({
  category,
  question,
  currentIndex,
  totalQuestions,
  hearts,
  score,
  timeLeft,
  isAnswered,
  selectedOptionId,
  onSelectOption,
  onQuit
}) => {
  const { language } = useLanguage();
  const { targetItem, options, correctOptionId } = question;

  const timerPercent = Math.max(0, Math.min(100, (timeLeft / 10.0) * 100));

  // Timer color gradient
  const timerColor =
    timeLeft > 5.0
      ? 'bg-emerald-500 shadow-emerald-500/50'
      : timeLeft > 2.5
      ? 'bg-amber-500 shadow-amber-500/50'
      : 'bg-rose-500 shadow-rose-500/50 animate-pulse';

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Status Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onQuit}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 text-xs transition-colors"
          >
            ← {language === 'pt' ? 'Sair' : 'Quit'}
          </button>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold uppercase text-amber-400">
              {getTriviaCategoryName(category, language)}
            </span>
            <span className="text-neutral-500">•</span>
            <span className="text-xs font-bold text-white">
              {currentIndex + 1} / {totalQuestions}
            </span>
          </div>
        </div>

        {/* Hearts & Score */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            {[1, 2, 3].map(h => (
              <Heart
                key={h}
                className={`w-4 h-4 transition-all duration-300 ${
                  h <= hearts
                    ? 'text-rose-500 fill-rose-500 scale-100'
                    : 'text-neutral-600 scale-75 opacity-40'
                }`}
              />
            ))}
          </div>

          <div className="w-[1px] h-4 bg-white/10" />

          <div className="flex items-center gap-1 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-neutral-400">Pts:</span>
            <strong className="text-amber-300 text-sm">{score}</strong>
          </div>
        </div>
      </div>

      {/* 10.0s Timer Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs px-1">
          <div className="flex items-center gap-1 text-neutral-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{getTriviaString('time_remaining', language)}</span>
          </div>
          <span
            className={`font-mono font-bold text-sm ${
              timeLeft <= 2.5 ? 'text-rose-400' : 'text-neutral-200'
            }`}
          >
            {timeLeft.toFixed(1)}s
          </span>
        </div>
        <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/10 p-[1px]">
          <div
            className={`h-full rounded-full transition-all duration-75 shadow-sm ${timerColor}`}
            style={{ width: `${timerPercent}%` }}
          />
        </div>
      </div>

      {/* Center In-Game Item Image Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/15 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-white/10 to-transparent">
        <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl bg-black/60 border border-white/20 p-4 flex items-center justify-center shadow-inner relative group">
            <img
              data-testid="trivia-item-image"
              src={targetItem.imagePath}
              alt={targetItem.englishName}
              className="max-w-full max-h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] animate-pulse-slow"
              onError={e => {
                // Fallback icon if image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <p className="text-xs text-neutral-400 tracking-wide uppercase font-medium">
            {language === 'pt' ? 'Identifique este item' : 'Identify this item'}
          </p>
        </div>
      </div>

      {/* 4 In-Game Localized Option Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {options.map(option => {
          const localizedName = option.translations[language] || option.englishName;
          const isSelected = selectedOptionId === option.id;
          const isCorrect = option.id === correctOptionId;

          let buttonStyle = 'glass-panel border-white/10 hover:border-amber-400/50 hover:bg-white/15 text-white';
          let icon = null;

          if (isAnswered) {
            if (isCorrect) {
              buttonStyle = 'bg-emerald-500/30 border-emerald-400 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.4)]';
              icon = <Check className="w-4 h-4 text-emerald-400" />;
            } else if (isSelected) {
              buttonStyle = 'bg-rose-500/30 border-rose-400 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-shake';
              icon = <X className="w-4 h-4 text-rose-400" />;
            } else {
              buttonStyle = 'opacity-40 border-white/5 text-neutral-400';
            }
          }

          return (
            <button
              key={option.id}
              onClick={() => !isAnswered && onSelectOption(option.id)}
              disabled={isAnswered}
              className={`p-4 rounded-2xl border text-left font-semibold text-sm transition-all duration-200 flex items-center justify-between gap-3 shadow-md hover:scale-[1.01] active:scale-[0.99] ${buttonStyle}`}
            >
              <span className="truncate">{localizedName}</span>
              {icon}
            </button>
          );
        })}
      </div>
    </div>
  );
};
