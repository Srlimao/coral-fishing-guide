import React, { useState } from 'react';
import { parseCoralIslandSaveFile, SaveCompletionsResult } from '../../utils/saveFileParser';
import { useLiveSync } from './LiveSyncContext';
import {
  X,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Radio,
  RefreshCw,
  PowerOff,
  Sparkles
} from 'lucide-react';

interface SaveImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SaveImportModal: React.FC<SaveImportModalProps> = ({ isOpen, onClose }) => {
  const {
    isSupported,
    isConnected,
    fileName,
    lastSyncTime,
    syncCount,
    lastParsedResult,
    connectLiveSave,
    disconnectLiveSave,
    syncNow,
    applySaveData
  } = useLiveSync();

  const [dragActive, setDragActive] = useState(false);
  const [manualResult, setManualResult] = useState<SaveCompletionsResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleConnectLive = async () => {
    setIsProcessing(true);
    setErrorMessage(null);
    const success = await connectLiveSave();
    setIsProcessing(false);
    if (!success && !isConnected) {
      setErrorMessage('Could not connect file. Make sure to select a valid DailySave_*.sav file.');
    }
  };

  const processManualFile = async (file: File) => {
    if (!file.name.endsWith('.sav') && !file.name.endsWith('.json')) {
      setErrorMessage('Please select a valid Coral Island save file (.sav).');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const buffer = await file.arrayBuffer();
      const result = parseCoralIslandSaveFile(buffer);

      if (result.success) {
        setManualResult(result);
        applySaveData(result);
      } else {
        setErrorMessage(result.error || 'Failed to parse save file');
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Unknown error reading file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processManualFile(e.dataTransfer.files[0]);
    }
  };

  const activeResult = manualResult || lastParsedResult;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#182228] text-white border border-white/10 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl my-8">
        
        {/* Header */}
        <div className="p-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
            <div>
              <h2 className="text-lg font-bold">Coral Island Live Save Sync</h2>
              <p className="text-xs text-[#c4b5a0]">Real-Time In-Game Date, Weather & Checklist Watcher</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">

          {/* Connected Active Live Sync Card */}
          {isConnected ? (
            <div className="bg-emerald-950/40 border-2 border-emerald-500/50 p-4 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                  <strong className="text-sm text-emerald-300 font-bold">Live Auto-Sync Active</strong>
                </div>
                <span className="bg-emerald-900/80 text-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                  {syncCount} syncs
                </span>
              </div>

              <p className="text-[#c4b5a0]">
                Watching <strong>{fileName}</strong>. When you sleep or save in Coral Island, your web guide updates automatically in real time!
              </p>

              <div className="flex items-center justify-between pt-1 text-[11px] text-neutral-300 border-t border-emerald-500/20">
                <span>Last updated: {lastSyncTime ? lastSyncTime.toLocaleTimeString() : 'Just now'}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => syncNow()}
                    className="cg-pill px-2.5 py-1 text-[10px] text-white"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Sync Now</span>
                  </button>
                  <button
                    onClick={() => disconnectLiveSave()}
                    className="cg-pill px-2.5 py-1 text-[10px] text-rose-300 hover:text-rose-200 hover:border-rose-400"
                  >
                    <PowerOff className="w-3 h-3" />
                    <span>Disconnect</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Connect Live Save File CTA */
            <div className="space-y-3">
              {isSupported ? (
                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 mx-auto flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Continuous In-Game Sync</h3>
                    <p className="text-xs text-[#c4b5a0] max-w-md mx-auto mt-1">
                      Grant read access to your save file once. The app will monitor in-game progress (Day, Weather, Caught Fish, Altars) while you play.
                    </p>
                  </div>

                  <button
                    onClick={handleConnectLive}
                    disabled={isProcessing}
                    className="cg-pill cg-pill-active py-2.5 px-6 text-xs font-bold shadow-lg"
                  >
                    <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                    <span>{isProcessing ? 'Connecting...' : 'Connect Live Save File (*.sav)'}</span>
                  </button>
                </div>
              ) : null}

              {/* Drag and Drop Fallback Dropzone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                  dragActive
                    ? 'border-white bg-white/10'
                    : 'border-white/15 bg-white/5 hover:border-white/30'
                }`}
              >
                <UploadCloud className="w-8 h-8 text-[#c4b5a0] mx-auto mb-2" />
                <p className="font-bold text-white mb-1">
                  Or One-Time File Upload
                </p>
                <p className="text-[11px] text-[#c4b5a0] mb-3">
                  Drag and drop your <strong>DailySave_*.sav</strong> here
                </p>
                <label className="cg-pill py-1.5 px-4 text-xs cursor-pointer">
                  <span>Browse File</span>
                  <input
                    type="file"
                    accept=".sav,.json"
                    onChange={(e) => e.target.files && e.target.files[0] && processManualFile(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Sync Results Summary */}
          {activeResult && activeResult.success && (
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Save State Synced Successfully</span>
              </div>

              {activeResult.gameDate && (
                <div className="flex flex-wrap gap-2 text-[11px]">
                  <span className="cg-pill px-2.5 py-0.5 text-white">
                    📅 {activeResult.gameDate.season.toUpperCase()} Day {activeResult.gameDate.day}, Year {activeResult.gameDate.year}
                  </span>
                  {activeResult.weather && (
                    <span className="cg-pill px-2.5 py-0.5 text-white">
                      🌦️ {activeResult.weather.toUpperCase()}
                    </span>
                  )}
                  {activeResult.profile?.fishingLevel !== undefined && (
                    <span className="cg-pill px-2.5 py-0.5 text-white">
                      🎣 Fishing Lvl {activeResult.profile.fishingLevel}
                    </span>
                  )}
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                <div className="bg-black/30 p-2 rounded-xl border border-white/10">
                  <span className="text-[#c4b5a0] block text-[9px] uppercase">Caught</span>
                  <strong className="text-white text-sm">{activeResult.stats.totalFishCaught} / {activeResult.stats.catalogTotal}</strong>
                </div>
                <div className="bg-black/30 p-2 rounded-xl border border-white/10">
                  <span className="text-[#c4b5a0] block text-[9px] uppercase">Museum</span>
                  <strong className="text-white text-sm">{activeResult.stats.totalFishDonated} / {activeResult.stats.catalogTotal}</strong>
                </div>
                <div className="bg-black/30 p-2 rounded-xl border border-white/10">
                  <span className="text-[#c4b5a0] block text-[9px] uppercase">Altars</span>
                  <strong className="text-white text-sm">{activeResult.stats.totalFishOffered}</strong>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-rose-950/60 border border-rose-500/40 p-3 rounded-2xl flex items-center gap-2 text-rose-300">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Save File Location Guide */}
          <div className="bg-black/30 p-3.5 rounded-2xl border border-white/10 space-y-1.5 text-[11px] text-[#c4b5a0]">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <FileText className="w-3.5 h-3.5" />
              <span>Where is my Coral Island save file?</span>
            </div>
            <p>
              Press <kbd className="bg-white/10 px-1 py-0.5 rounded text-white font-mono">Win + R</kbd> and paste:
            </p>
            <code className="block bg-black/50 p-2 rounded-lg text-neutral-300 font-mono text-[10px] select-all break-all border border-white/5">
              %LOCALAPPDATA%\ProjectCoral\Saved\SaveGames
            </code>
            <p className="text-[10px] text-neutral-400">
              Select your slot file (e.g. <strong>DailySave_0.sav</strong> or <strong>Backup_0.sav</strong>).
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
