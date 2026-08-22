import React, { useState, useEffect, useRef } from 'react';
import { MovementPattern, FishDifficulty, FishSize } from '../../types/fishing';
import { Check, AlertCircle, RotateCcw } from 'lucide-react';

interface MinigameVisualizerProps {
  pattern: MovementPattern;
  difficulty: FishDifficulty;
  size?: FishSize;
  reelingSpeed: number;
}

export const MinigameVisualizer: React.FC<MinigameVisualizerProps> = ({
  pattern,
  difficulty,
  size = 'Medium',
  reelingSpeed
}) => {
  const [catchProgress, setCatchProgress] = useState(15); // 0 to 100% (left to right)
  const [tension, setTension] = useState(15); // 0 to 100% (center expanding to left & right)
  const [isReeling, setIsReeling] = useState(false);
  const [isFighting, setIsFighting] = useState(false);
  const [gameState, setGameState] = useState<'playing' | 'caught' | 'snapped'>('playing');

  const stateTimerRef = useRef(0);
  const nextFightDurationRef = useRef(2000);
  const nextCalmDurationRef = useRef(3000);

  // Difficulty & size multipliers
  const diffMultiplier =
    difficulty === 'VeryHard' ? 3.2 :
    difficulty === 'Hard' ? 2.4 :
    difficulty === 'Medium' ? 1.6 :
    difficulty === 'Easy' ? 1.1 : 0.8;

  const sizeMultiplier = size === 'Large' ? 1.3 : size === 'Medium' ? 1.0 : 0.8;
  const rodTolerance = reelingSpeed * 0.8; // higher tier rods reduce tension build rate

  // Main game tick loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      stateTimerRef.current += 60;

      // Switch between Calm Cool-off and Fighting/Thrashing phases
      if (!isFighting && stateTimerRef.current >= nextCalmDurationRef.current) {
        setIsFighting(true);
        stateTimerRef.current = 0;
        // Fighting duration based on difficulty (harder fish fight longer)
        nextFightDurationRef.current = 1500 + Math.random() * 1200 * (diffMultiplier / 1.5);
      } else if (isFighting && stateTimerRef.current >= nextFightDurationRef.current) {
        setIsFighting(false);
        stateTimerRef.current = 0;
        // Calm duration based on difficulty (harder fish have shorter calm cool-offs)
        nextCalmDurationRef.current = Math.max(1200, 3500 - (diffMultiplier * 600) + Math.random() * 1000);
      }

      // 1. Tension Update
      setTension(prev => {
        if (isReeling) {
          if (isFighting) {
            // While fish is fighting, holding reel increases tension WAY FASTER
            const fightTensionRate = (3.4 * diffMultiplier * sizeMultiplier) / Math.max(1, rodTolerance * 0.7);
            const nextT = prev + fightTensionRate;
            if (nextT >= 100) {
              setGameState('snapped');
              return 100;
            }
            return Math.min(100, nextT);
          } else {
            // Cool-off period: holding increases tension VERY SLOWLY
            const calmTensionRate = 0.45 / Math.max(1, rodTolerance * 0.6);
            return Math.min(100, prev + calmTensionRate);
          }
        } else {
          // Releasing reel: tension goes back quickly to center
          const recoveryRate = 2.8 * (reelingSpeed / 1.2);
          return Math.max(0, prev - recoveryRate);
        }
      });

      // 2. Catch Progress Update (fills left to right)
      setCatchProgress(prev => {
        if (isReeling) {
          // Progress fills faster during calm, slightly slower if fighting
          const progressGain = isFighting ? 0.35 * reelingSpeed : 0.85 * reelingSpeed;
          const nextP = prev + progressGain;
          if (nextP >= 100) {
            setGameState('caught');
            return 100;
          }
          return Math.min(100, nextP);
        } else {
          // Slowly recedes if player releases for too long
          return Math.max(0, prev - 0.25);
        }
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

  // Calculate squiggly wave expansion (starts from center 50% and expands outward)
  const waveWidth = Math.max(8, tension); // 8% minimum center ripple up to 100%
  const waveLeft = 50 - waveWidth / 2;

  // Wave color: pastel pink when calm -> fiery red/orange when near breaking
  const waveColor =
    tension > 75 ? '#ef4444' :
    tension > 45 ? '#f97316' : '#f472b6';

  return (
    <div className="bg-[#121e28] p-5 rounded-2xl border border-teal-500/30 text-white space-y-4 shadow-xl select-none">
      
      {/* Header Info & State Badge */}
      <div className="flex items-center justify-between text-xs">
        <div>
          <span className="font-extrabold text-amber-400 block text-sm">
            In-Game Fishing Minigame Simulation
          </span>
          <span className="text-[11px] text-neutral-300">
            Pattern: <strong>{pattern}</strong> • Difficulty: <strong>{difficulty}</strong> • Size: <strong>{size}</strong>
          </span>
        </div>

        {/* Phase Indicator */}
        <div className="flex items-center gap-2">
          {gameState === 'playing' && (
            <span
              className={`text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider transition-all ${
                isFighting
                  ? 'bg-rose-600 text-white animate-bounce shadow-lg shadow-rose-600/50'
                  : 'bg-emerald-600/90 text-emerald-100 shadow-sm'
              }`}
            >
              {isFighting ? '⚠️ Fish is Fighting!' : '💤 Cool-off (Reel Now!)'}
            </span>
          )}
        </div>
      </div>

      {/* Main In-Game Fishing Bar Stage */}
      <div className="relative py-4 px-2 flex flex-col items-center justify-center bg-radial from-[#1e3a5f]/60 to-[#0d1b2a]/90 rounded-2xl border border-cyan-500/20 shadow-inner">
        
        {/* TOP SQUIGGLY TENSION WAVE (Expands from center to left & right) */}
        <div className="w-full h-4 relative overflow-hidden mb-1">
          <div
            className={`absolute h-full transition-all duration-75 flex items-center ${
              isFighting && isReeling ? 'animate-pulse' : ''
            }`}
            style={{
              left: `${waveLeft}%`,
              width: `${waveWidth}%`
            }}
          >
            <svg
              className="w-full h-3"
              viewBox="0 0 100 12"
              preserveAspectRatio="none"
            >
              <path
                d="M 0,6 Q 5,0 10,6 T 20,6 T 30,6 T 40,6 T 50,6 T 60,6 T 70,6 T 80,6 T 90,6 T 100,6"
                fill="none"
                stroke={waveColor}
                strokeWidth={tension > 60 ? "2.5" : "2"}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* CENTRAL CATCH PROGRESS BAR (Fills Left to Right with Checkmark Target) */}
        <div className="w-full max-w-md h-9 bg-white/20 backdrop-blur-md rounded-full p-1 relative flex items-center border border-white/40 shadow-xl overflow-hidden">
          
          {/* Segment division markers */}
          <div className="absolute inset-0 flex justify-between pointer-events-none px-6 opacity-30">
            <div className="w-[1px] h-full bg-white" />
            <div className="w-[1px] h-full bg-white" />
            <div className="w-[1px] h-full bg-white" />
          </div>

          {/* Left-to-Right Progress Fill */}
          <div
            className="h-full bg-gradient-to-r from-cyan-400/80 to-blue-500 rounded-full transition-all duration-75 flex items-center justify-end relative shadow-md"
            style={{ width: `${catchProgress}%` }}
          >
            {/* Tracking Fish Icon on the Bar */}
            <div className={`mr-1 text-lg flex items-center justify-center filter drop-shadow-md select-none ${
              isFighting ? 'animate-spin-slow scale-110' : ''
            }`}>
              {size === 'Large' ? '🦈' : '🐟'}
            </div>
          </div>

          {/* Right Target Catch Icon (✓) */}
          <div className="absolute right-1 w-7 h-7 rounded-full bg-[#f6dfc4] border border-[#d8b48f] flex items-center justify-center text-amber-800 shadow-md">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
        </div>

        {/* BOTTOM SQUIGGLY TENSION WAVE (Expands from center to left & right) */}
        <div className="w-full h-4 relative overflow-hidden mt-1">
          <div
            className={`absolute h-full transition-all duration-75 flex items-center ${
              isFighting && isReeling ? 'animate-pulse' : ''
            }`}
            style={{
              left: `${waveLeft}%`,
              width: `${waveWidth}%`
            }}
          >
            <svg
              className="w-full h-3"
              viewBox="0 0 100 12"
              preserveAspectRatio="none"
            >
              <path
                d="M 0,6 Q 5,12 10,6 T 20,6 T 30,6 T 40,6 T 50,6 T 60,6 T 70,6 T 80,6 T 90,6 T 100,6"
                fill="none"
                stroke={waveColor}
                strokeWidth={tension > 60 ? "2.5" : "2"}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Tension Meter Text */}
        <div className="flex items-center justify-between w-full max-w-md text-[11px] font-mono mt-1 px-2 text-neutral-300">
          <span>Catch: <strong className="text-cyan-300">{Math.round(catchProgress)}%</strong></span>
          <span className={tension > 75 ? 'text-rose-400 font-bold' : tension > 50 ? 'text-amber-400' : 'text-neutral-300'}>
            Line Tension: <strong>{Math.round(tension)}%</strong> {tension > 80 ? '💥 SNAPPING!' : ''}
          </span>
        </div>

      </div>

      {/* Outcome Overlays (Win / Line Break) */}
      {gameState === 'caught' && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-400/50 rounded-xl text-center space-y-1.5 animate-fade-in">
          <span className="text-sm font-black text-emerald-300 flex items-center justify-center gap-1.5">
            🎉 Fish Successfully Caught!
          </span>
          <p className="text-[11px] text-emerald-100">
            Great line feathering! You managed the line strain perfectly during cool-off windows.
          </p>
          <button
            onClick={handleReset}
            className="btn-pill bg-emerald-600 hover:bg-emerald-500 text-white text-xs py-1 px-4 font-bold inline-flex items-center gap-1 mt-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Practice Again</span>
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
          <button
            onClick={handleReset}
            className="btn-pill bg-rose-600 hover:bg-rose-500 text-white text-xs py-1 px-4 font-bold inline-flex items-center gap-1 mt-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* Interactive Reel Button / Hold Target */}
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
