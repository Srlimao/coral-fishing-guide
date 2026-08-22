import React, { useState, useRef } from 'react';
import { useFishing } from '../../context/FishingContext';
import { UserProgress } from '../../types/fishing';
import { parseCoralIslandSaveFile, SaveCompletionsResult } from '../../utils/saveFileParser';
import { UploadCloud, FileCheck, AlertCircle, CheckCircle2, Copy, Check, X, Fish, Landmark, Sparkles, FolderOpen } from 'lucide-react';

interface SaveImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SaveImportModal: React.FC<SaveImportModalProps> = ({ isOpen, onClose }) => {
  const { setUserProgress } = useFishing();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedPath, setCopiedPath] = useState(false);
  const [parsedResult, setParsedResult] = useState<SaveCompletionsResult | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const savePathSnippet = '%LOCALAPPDATA%\\ProjectCoral\\Saved\\SaveGames';

  const handleCopyPath = () => {
    navigator.clipboard.writeText(savePathSnippet);
    setCopiedPath(true);
    setTimeout(() => setCopiedPath(false), 2000);
  };

  const handleFileProcess = (file: File) => {
    if (!file.name.endsWith('.sav')) {
      setStatusMessage('Please select a valid Coral Island .sav file (e.g. EndOfDayAutoSave.sav).');
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        if (!buffer) throw new Error('Could not read file buffer.');

        const result = parseCoralIslandSaveFile(buffer);
        if (result.success) {
          setParsedResult(result);
          setStatusMessage(`Found ${result.stats.totalFishCaught} Caught, ${result.stats.totalFishDonated} Donated, and ${result.stats.totalFishOffered} Offered fish.`);
        } else {
          setStatusMessage(result.error || 'Failed to parse the save file format.');
        }
      } catch (err: unknown) {
        setStatusMessage(err instanceof Error ? err.message : 'Error reading save file.');
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      setStatusMessage('Error reading file.');
      setIsLoading(false);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleApplyProgress = (merge: boolean) => {
    if (!parsedResult) return;

    setUserProgress((prev: UserProgress) => {
      const newCaught = merge
        ? { ...prev.caught, ...parsedResult.caughtFish }
        : { ...parsedResult.caughtFish };

      const newDonated = merge
        ? { ...prev.donatedMuseum, ...parsedResult.donatedMuseum }
        : { ...parsedResult.donatedMuseum };

      const newOffered = merge
        ? { ...prev.offeredTemple, ...parsedResult.offeredTemple }
        : { ...parsedResult.offeredTemple };

      return {
        ...prev,
        caught: newCaught,
        donatedMuseum: newDonated,
        offeredTemple: newOffered
      };
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#faf6ee] text-[#3d2f1a] border border-[#e8ddcb] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#ede5d5] border-b border-[#e8ddcb] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FolderOpen className="w-5 h-5 text-amber-700" />
            <h2 className="text-lg font-black text-[#3d2f1a]">Import Coral Island Save File</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#8c785b] hover:text-[#3d2f1a] hover:bg-[#e2d5be] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Quick instructions & Copy Path */}
          <div className="bg-[#f2ecde] border border-[#e8ddcb] rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#6e583b] font-semibold">
              <span>Save files are located on your PC at:</span>
              <button
                onClick={handleCopyPath}
                className="flex items-center gap-1 text-amber-700 hover:text-amber-800 font-bold hover:underline"
              >
                {copiedPath ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPath ? 'Copied!' : 'Copy Path'}</span>
              </button>
            </div>
            <div className="bg-white/80 border border-[#dfd2be] rounded-lg px-3 py-1.5 font-mono text-xs text-[#4a3b25] select-all truncate">
              {savePathSnippet}\World_X\EndOfDayAutoSave.sav
            </div>
          </div>

          {/* Drag and Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-amber-600 bg-amber-500/10 scale-[0.99]'
                : 'border-[#dfd2be] hover:border-amber-600/70 hover:bg-[#f4efe4]'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleFileProcess(e.target.files[0])}
              accept=".sav"
              className="hidden"
            />
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-amber-600/10 rounded-full text-amber-700">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div>
                <p className="font-bold text-[#3d2f1a]">
                  Click to select or drag & drop your <span className="font-mono text-amber-700">.sav</span> file
                </p>
                <p className="text-xs text-[#8c785b] mt-0.5">
                  Select <span className="font-semibold text-[#5a4627]">EndOfDayAutoSave.sav</span> or any <span className="font-semibold text-[#5a4627]">BackupSave*.sav</span>
                </p>
              </div>
            </div>
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center justify-center gap-2 text-amber-700 font-semibold py-2">
              <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Decompressing and parsing save data...</span>
            </div>
          )}

          {/* Status Message */}
          {statusMessage && !parsedResult && (
            <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-300 text-amber-900 rounded-xl text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-700" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Parsed Result Preview */}
          {parsedResult && (
            <div className="bg-[#ede5d5] border border-[#dfd2be] rounded-xl p-4 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold text-sm text-[#3d2f1a] truncate">{fileName}</span>
                </div>
                <span className="bg-emerald-600/15 text-emerald-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-700/20">
                  Ready to Sync
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="bg-white/80 border border-[#dfd2be] rounded-lg p-2.5">
                  <div className="flex items-center justify-center gap-1 text-xs text-[#735f43] font-bold">
                    <Fish className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Caught</span>
                  </div>
                  <div className="text-lg font-black text-[#3d2f1a] mt-0.5">
                    {parsedResult.stats.totalFishCaught} <span className="text-xs text-[#8c785b] font-normal">/ 69</span>
                  </div>
                </div>

                <div className="bg-white/80 border border-[#dfd2be] rounded-lg p-2.5">
                  <div className="flex items-center justify-center gap-1 text-xs text-[#735f43] font-bold">
                    <Landmark className="w-3.5 h-3.5 text-blue-600" />
                    <span>Museum</span>
                  </div>
                  <div className="text-lg font-black text-[#3d2f1a] mt-0.5">
                    {parsedResult.stats.totalFishDonated} <span className="text-xs text-[#8c785b] font-normal">/ 69</span>
                  </div>
                </div>

                <div className="bg-white/80 border border-[#dfd2be] rounded-lg p-2.5">
                  <div className="flex items-center justify-center gap-1 text-xs text-[#735f43] font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Temple</span>
                  </div>
                  <div className="text-lg font-black text-[#3d2f1a] mt-0.5">
                    {parsedResult.stats.totalFishOffered} <span className="text-xs text-[#8c785b] font-normal">/ 24</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                <button
                  onClick={() => handleApplyProgress(true)}
                  className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 text-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Merge with Current Progress</span>
                </button>
                <button
                  onClick={() => handleApplyProgress(false)}
                  className="w-full py-2.5 px-4 bg-[#dfd2be] hover:bg-[#cfc0a8] text-[#4a3b25] font-bold rounded-xl transition-all text-xs"
                >
                  <span>Overwrite Progress</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#ede5d5] border-t border-[#e8ddcb] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-[#dfd2be] text-[#5a4627] hover:bg-[#e2d5be] font-bold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
