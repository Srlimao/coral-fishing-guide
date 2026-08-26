import React, { useState } from 'react';
import { useLiveBridge } from './LiveBridgeContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { Radio, Zap, Clock, CloudSun, ShieldCheck } from 'lucide-react';

export const LiveSyncIndicator: React.FC = () => {
  const { liveState, isAutoSync, toggleAutoSync, isConnected } = useLiveBridge();
  const { t } = useLanguage();
  const [showPopover, setShowPopover] = useState(false);

  const isInGame = liveState.inGame ?? false;

  return (
    <div className="relative">
      {/* Trigger Pill */}
      <button
        onClick={() => setShowPopover(prev => !prev)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer shadow-sm ${
          isConnected && isInGame
            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
            : isConnected
            ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25'
            : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10'
        }`}
        title={
          isConnected && isInGame
            ? 'Game Connected & Synced via UE4SS'
            : isConnected
            ? 'Connected to UE4SS (In Menu - Join a world/farm to sync)'
            : 'Live Sync Idle (Launch game with UE4SS to sync)'
        }
      >
        <span className="relative flex h-2.5 w-2.5">
          {isConnected && (
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isInGame ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />
          )}
          <span
            className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
              isConnected && isInGame
                ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                : isConnected
                ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                : 'bg-neutral-500'
            }`}
          />
        </span>

        <span className="hidden sm:inline">
          {isConnected && isInGame
            ? `${liveState.season.toUpperCase()} ${liveState.day} • ${liveState.formattedTime}`
            : isConnected
            ? 'Connected (In Menu)'
            : 'Live Bridge'}
        </span>
        <Radio
          className={`w-3.5 h-3.5 ${
            isConnected && isInGame
              ? 'text-emerald-400 animate-pulse'
              : isConnected
              ? 'text-amber-400'
              : 'text-neutral-500'
          }`}
        />
      </button>

      {/* Details & Settings Popover */}
      {showPopover && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowPopover(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-neutral-900/95 border border-white/15 backdrop-blur-xl rounded-2xl p-4 shadow-2xl z-50 text-neutral-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Zap className={`w-4 h-4 ${isConnected ? 'text-emerald-400' : 'text-amber-400'}`} />
                <h4 className="text-sm font-bold text-white">UE4SS Game Memory Bridge</h4>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  isConnected
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-neutral-800 text-neutral-400 border border-white/10'
                }`}
              >
                {isConnected ? 'Connected' : 'Offline'}
              </span>
            </div>

            {/* Live Telemetry Info */}
            {isConnected ? (
              <div className="space-y-2.5 bg-black/40 rounded-xl p-3 border border-white/5 mb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" /> In-Game Clock:
                  </span>
                  <strong className="text-white">
                    {t(`season_${liveState.season}` as any, liveState.season)} Day {liveState.day} ({liveState.formattedTime})
                  </strong>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400 flex items-center gap-1.5">
                    <CloudSun className="w-3.5 h-3.5 text-sky-400" /> Active Weather:
                  </span>
                  <strong className="text-white capitalize">
                    {t(`weather_${liveState.weather}` as any, liveState.weather)}
                  </strong>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Fishing Level:
                  </span>
                  <strong className="text-white">Level {liveState.fishingLevel}</strong>
                </div>
              </div>
            ) : (
              <div className="text-xs text-neutral-400 bg-black/30 rounded-xl p-3 border border-white/5 mb-3 space-y-1.5">
                <p>
                  <strong>Mod Installed:</strong> <span className="text-emerald-400">LiveFishingBridge</span>
                </p>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Start Coral Island to stream live in-game time, weather, and fish availability in real-time.
                </p>
              </div>
            )}

            {/* Auto-Sync Toggle Switch */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div>
                <span className="text-xs font-semibold text-white block">Auto-Sync Game Simulator</span>
                <span className="text-[10px] text-neutral-400 block">Sync season, weather & clock automatically</span>
              </div>
              <button
                onClick={toggleAutoSync}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  isAutoSync ? 'bg-emerald-500' : 'bg-neutral-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    isAutoSync ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
