import React, { useState, useEffect, useRef } from 'react';
import { MovementPattern, FishDifficulty, FishSize } from '../../types/fishing';
import { useLanguage } from '../../i18n/LanguageContext';
import { Check, AlertCircle, RotateCcw } from 'lucide-react';

interface MinigameVisualizerProps {
  pattern: MovementPattern;
  difficulty: FishDifficulty;
  size?: FishSize;
  reelingSpeed: number;
}

const TensionWave: React.FC<{ waveLeft: number; waveWidth: number; waveColor: string; isTop?: boolean; active: boolean }> = ({
  waveLeft, waveWidth, waveColor, isTop = true, active
}) => (
  <div className={`w-full h-4 relative overflow-hidden ${isTop ? 'mb-1' : 'mt-1'}`}>
    <div
      className={`absolute h-full transition-all duration-75 flex items-center ${active ? 'animate-pulse' : ''}`}
      style={{ left: `${waveLeft}%`, width: `${waveWidth}%` }}
    >
      <svg className="w-full h-3" viewBox="0 0 100 12" preserveAspectRatio="none">
        <path
          d={isTop ? "M 0,6 Q 5,0 10,6 T 20,6 T 30,6 T 40,6 T 50,6 T 60,6 T 70,6 T 80,6 T 90,6 T 100,6" : "M 0,6 Q 5,12 10,6 T 20,6 T 30,6 T 40,6 T 50,6 T 60,6 T 70,6 T 80,6 T 90,6 T 100,6"}
          fill="none"
          stroke={waveColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  </div>
);

export const MinigameVisualizer: React.FC<MinigameVisualizerProps> = ({
  pattern,
  difficulty,
  size = 'Medium',
  reelingSpeed
}) => {
  const { t } = useLanguage();
  const [catchProgress, setCatchProgress] = useState(15);
  const [tension, setTension] = useState(15);
  const [isReeling, setIsReeling] = useState(false);
  const [isFighting, setIsFighting] = useState(false);
  const [gameState, setGameState] = useState<'playing' | 'caught' | 'snapped'>('playing');

  const stateTimerRef = useRef(0);
  const nextFightDurationRef = useRef(2000);
  const nextCalmDurationRef = useRef(3000);

  const diffMultiplier =
    difficulty === 'VeryHard' ? 3.2 :
    difficulty === 'Hard' ? 2.4 :
    difficulty === 'Medium' ? 1.6 :
    difficulty === 'Easy' ? 1.1 : 0.8;

  const sizeMultiplier = size === 'Large' ? 1.3 : size === 'Medium' ? 1.0 : 0.8;
  const rodTolerance = reelingSpeed * 0.8;

  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      stateTimerRef.current += 60;

      if (!isFighting && stateTimerRef.current >= nextCalmDurationRef.current) {
        setIsFighting(true);
        stateTimerRef.current = 0;
        nextFightDurationRef.current = 1500 + Math.random() * 1200 * (diffMultiplier / 1.5);
      } else if (isFighting && stateTimerRef.current >= nextFightDurationRef.current) {
        setIsFighting(false);
        stateTimerRef.current = 0;
        nextCalmDurationRef.current = Math.max(1200, 3500 - (diffMultiplier * 600) + Math.random() * 1000);
      }

      setTension(prev => {
        if (isReeling) {
          const rate = isFighting
            ? (3.4 * diffMultiplier * sizeMultiplier) / Math.max(1, rodTolerance * 0.7)
            : 0.45 / Math.max(1, rodTolerance * 0.6);
          const nextT = prev + rate;
          if (nextT >= 100) {
            setGameState('snapped');
            return 100;
          }
          return Math.min(100, nextT);
        }
        return Math.max(0, prev - 2.8 * (reelingSpeed / 1.2));
      });

      setCatchProgress(prev => {
        if (isReeling) {
          const gain = isFighting ? 0.35 * reelingSpeed : 0.85 * reelingSpeed;
          const nextP = prev + gain;
          if (nextP >= 100) {
            setGameState('caught');
            return 100;
          }
          return Math.min(100, nextP);
        }
        return Math.max(0, prev - 0.25);
      });
    }, 60);

    return () => clearInterval(interval);
  }, [gameState, isReeling, isFighting, diffMultiplier, sizeMultiplier, rodTolerance, reelingSpeed]);

  const handleReset = () => {
    setCatchProgress(15);
    setTension(15);
    setIsReeling(false);
    setIsFighting(false);
    setGameState('playing');
    stateTimerRef.current = 0;
  };

  const waveWidth = Math.max(8, tension);
  const waveLeft = 50 - waveWidth / 2;
  const waveColor = tension > 75 ? '#ef4444' : tension > 45 ? '#f97316' : '#f472b6';

  return (
    <div className="bg-[#121e28] p-5 rounded-2xl border border-teal-500/30 text-white space-y-4 shadow-xl select-none">
      <div className="flex items-center justify-between text-xs">
        <div>
          <span className="font-extrabold text-amber-400 block text-sm">
            In-Game Fishing Minigame Simulation
          </span>
          <span className="text-[11px] text-neutral-300">
            Pattern: <strong>{pattern}</strong> • Difficulty: <strong>{t(`diff_${difficulty.toLowerCase()}` as any, difficulty)}</strong> • Size: <strong>{t(`size_${size.toLowerCase()}` as any, size)}</strong>
          </span>
        </div>

        {gameState === 'playing' && (
          <span className={`text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider transition-all ${
            isFighting ? 'bg-rose-600 text-white animate-bounce shadow-lg' : 'bg-emerald-600/90 text-emerald-100'
          }`}>
            {isFighting ? '⚠️ Fish is Fighting!' : '💤 Cool-off (Reel Now!)'}
          </span>
        )}
      </div>

      <div className="relative py-4 px-2 flex flex-col items-center justify-center bg-radial from-[#1e3a5f]/60 to-[#0d1b2a]/90 rounded-2xl border border-cyan-500/20 shadow-inner">
        <TensionWave waveLeft={waveLeft} waveWidth={waveWidth} waveColor={waveColor} isTop={true} active={isFighting && isReeling} />

        <div className="w-full max-w-md h-9 bg-white/20 backdrop-blur-md rounded-full p-1 relative flex items-center border border-white/40 shadow-xl overflow-hidden">
          <div className="absolute inset-0 flex justify-between pointer-events-none px-6 opacity-30">
            <div className="w-[1px] h-full bg-white" />
            <div className="w-[1px] h-full bg-white" />
            <div className="w-[1px] h-full bg-white" />
          </div>

          <div
            className="h-full bg-gradient-to-r from-cyan-400/80 to-blue-500 rounded-full transition-all duration-75 flex items-center justify-end relative shadow-md"
            style={{ width: `${catchProgress}%` }}
          >
            <div className={`mr-1 text-lg flex items-center justify-center filter drop-shadow-md select-none ${
              isFighting ? 'animate-spin-slow scale-110' : ''
            }`}>
              {size === 'Large' ? '🦈' : '🐟'}
            </div>
          </div>

          <div className="absolute right-1 w-7 h-7 rounded-full bg-[#f6dfc4] border border-[#d8b48f] flex items-center justify-center text-amber-800 shadow-md">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
        </div>

        <TensionWave waveLeft={waveLeft} waveWidth={waveWidth} waveColor={waveColor} isTop={false} active={isFighting && isReeling} />

        <div className="flex items-center justify-between w-full max-w-md text-[11px] font-mono mt-1 px-2 text-neutral-300">
          <span>{t('minigame_catch_label')} <strong className="text-cyan-300">{Math.round(catchProgress)}%</strong></span>
          <span className={tension > 75 ? 'text-rose-400 font-bold' : tension > 50 ? 'text-amber-400' : 'text-neutral-300'}>
            {t('gear_line_tension')} <strong>{Math.round(tension)}%</strong> {tension > 80 ? '💥' : ''}
          </span>
        </div>
      </div>

      {gameState === 'caught' && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-400/50 rounded-xl text-center space-y-1.5 animate-fade-in">
          <span className="text-sm font-black text-emerald-300 flex items-center justify-center gap-1.5">
            🎉 Fish Successfully Caught!
          </span>
          <p className="text-[11px] text-emerald-100">
            Great line feathering! You managed the line strain perfectly during cool-off windows.
          </p>
          <button onClick={handleReset} className="btn-pill bg-emerald-600 hover:bg-emerald-500 text-white text-xs py-1 px-4 font-bold inline-flex items-center gap-1 mt-1">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('minigame_practice_again')}</span>
          </button>
        </div>
      )}

      {gameState === 'snapped' && (
        <div className="p-3 bg-rose-950/80 border border-rose-500/60 rounded-xl text-center space-y-1.5 animate-fade-in">
          <span className="text-sm font-black text-rose-300 flex items-center justify-center gap-1.5">
            <AlertCircle className="w-4 h-4" />
            <span>💥 Line Snapped! The Fish Escaped!</span>
          </span>
          <p className="text-[11px] text-rose-100">
            Line tension reached 100%! Remember to <strong>release reel</strong> when the fish starts fighting.
          </p>
          <button onClick={handleReset} className="btn-pill bg-rose-600 hover:bg-rose-500 text-white text-xs py-1 px-4 font-bold inline-flex items-center gap-1 mt-1">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('minigame_try_again')}</span>
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <button
          onMouseDown={() => setIsReeling(true)}
          onMouseUp={() => setIsReeling(false)}
          onMouseLeave={() => setIsReeling(false)}
          onTouchStart={() => setIsReeling(true)}
          onTouchEnd={() => setIsReeling(false)}
          className={`w-full py-3 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all select-none shadow-lg ${
            isReeling
              ? isFighting
                ? 'bg-rose-600 text-white shadow-rose-600/50 scale-[0.98]'
                : 'bg-amber-400 text-black shadow-amber-400/50 scale-[0.98]'
              : 'bg-[#1b2b3a] hover:bg-[#253c52] text-amber-300 border border-cyan-400/30'
          }`}
        >
          {isReeling
            ? isFighting
              ? '⚠️ Reeling While Fighting (High Tension!)'
              : '🎣 Reeling In Progress...'
            : 'Hold Left-Click to Reel (Release to Recover Tension)'}
        </button>
      )}
    </div>
  );
};
