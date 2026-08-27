import React, { useState, useEffect } from 'react';
import { useFishing } from '../../context/FishingContext';
import { parseCoralIslandSaveFile, SaveCompletionsResult } from '../../utils/saveFileParser';
import {
  X,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  FileText,
  FolderOpen
} from 'lucide-react';

interface SaveImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SaveImportModal: React.FC<SaveImportModalProps> = ({ isOpen, onClose }) => {
  const { setUserProgress, setGameState } = useFishing();

  const [dragActive, setDragActive] = useState(false);
  const [importResult, setImportResult] = useState<SaveCompletionsResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importedFileName, setImportedFileName] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const processFile = async (file: File) => {
    if (!file.name.endsWith('.sav') && !file.name.endsWith('.json')) {
      setErrorMessage('Please select a valid Coral Island save file (.sav).');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setImportedFileName(file.name);

    try {
      const buffer = await file.arrayBuffer();
      const result = parseCoralIslandSaveFile(buffer);

      if (result.success) {
        setImportResult(result);

        // 1. Update Checklists (Caught, Donated, Offered)
        setUserProgress(prev => ({
          ...prev,
          caught: { ...prev.caught, ...result.caughtFish },
          donatedMuseum: { ...prev.donatedMuseum, ...result.donatedMuseum },
          offeredTemple: { ...prev.offeredTemple, ...result.offeredTemple }
        }));

        // 2. Update Active Game State (Date, Weather, Level)
        setGameState(prev => {
          const next = { ...prev };
          if (result.gameDate) {
            next.season = result.gameDate.season;
            next.day = result.gameDate.day;
            next.year = result.gameDate.year;
          }
          if (result.weather) {
            next.weather = result.weather;
          }
          if (result.profile?.fishingLevel !== undefined) {
            next.fishingLevel = result.profile.fishingLevel;
          }
          return next;
        });
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
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="save-import-modal-title"
        className="bg-[#182228] text-white border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <FolderOpen className="w-5 h-5 text-amber-400" />
            <div>
              <h2 id="save-import-modal-title" className="text-lg font-bold">Import Coral Island Save File</h2>
              <p className="text-xs text-[#c4b5a0]">Load in-game date, weather & fishing progress</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">

          {/* Drag & Drop Box */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
              dragActive
                ? 'border-white bg-white/10'
                : 'border-white/15 bg-white/5 hover:border-white/30'
            }`}
          >
            <UploadCloud className="w-10 h-10 text-[#c4b5a0] mx-auto mb-2" />
            <h3 className="font-bold text-sm text-white mb-1">
              Select or Drop Your Save File
            </h3>
            <p className="text-[11px] text-[#c4b5a0] mb-4">
              Upload your <strong>DailySave_*.sav</strong> or <strong>Backup_*.sav</strong> file
            </p>
            
            <label className="cg-pill cg-pill-active py-2 px-5 text-xs font-bold cursor-pointer inline-flex focus-within:ring-2 focus-within:ring-amber-400 focus-within:ring-offset-2 focus-within:ring-offset-[#182228]">
              <span>{isProcessing ? 'Reading file...' : 'Browse File (.sav)'}</span>
              <input
                type="file"
                accept=".sav,.json"
                aria-label="Upload Coral Island save file"
                onChange={(e) => e.target.files && e.target.files[0] && processFile(e.target.files[0])}
                className="sr-only"
              />
            </label>
          </div>

          {/* Sync Results Summary */}
          {importResult && importResult.success && (
            <div className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Loaded Successfully</span>
                </div>
                {importedFileName && (
                  <span className="text-[10px] text-emerald-300 font-bold bg-emerald-900/60 px-2 py-0.5 rounded-full">
                    {importedFileName}
                  </span>
                )}
              </div>

              {importResult.gameDate && (
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  <span className="cg-pill px-2.5 py-0.5 text-white">
                    📅 {importResult.gameDate.season.toUpperCase()} Day {importResult.gameDate.day}, Year {importResult.gameDate.year}
                  </span>
                  {importResult.weather && (
                    <span className="cg-pill px-2.5 py-0.5 text-white">
                      🌦️ {importResult.weather.toUpperCase()}
                    </span>
                  )}
                  {importResult.profile?.fishingLevel !== undefined && (
                    <span className="cg-pill px-2.5 py-0.5 text-white">
                      🎣 Fishing Lvl {importResult.profile.fishingLevel}
                    </span>
                  )}
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                <div className="bg-black/30 p-2 rounded-xl border border-white/10">
                  <span className="text-[#c4b5a0] block text-[9px] uppercase">Caught Fish</span>
                  <strong className="text-white text-sm">{importResult.stats.totalFishCaught} / {importResult.stats.catalogTotal}</strong>
                </div>
                <div className="bg-black/30 p-2 rounded-xl border border-white/10">
                  <span className="text-[#c4b5a0] block text-[9px] uppercase">Museum Donated</span>
                  <strong className="text-white text-sm">{importResult.stats.totalFishDonated} / {importResult.stats.catalogTotal}</strong>
                </div>
                <div className="bg-black/30 p-2 rounded-xl border border-white/10">
                  <span className="text-[#c4b5a0] block text-[9px] uppercase">Temple Altars</span>
                  <strong className="text-white text-sm">{importResult.stats.totalFishOffered}</strong>
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

          {/* Save File Location Instructions */}
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
              Select your slot file (e.g. <strong>DailySave_0.sav</strong>).
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
