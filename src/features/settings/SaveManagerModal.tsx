import React, { useState } from 'react';
import { useFishing } from '../../context/FishingContext';
import { X, Download, Upload, Trash2, Check, AlertTriangle } from 'lucide-react';

export const SaveManagerModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { exportData, importData, resetProgress } = useFishing();
  const [importText, setImportText] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coral-island-fishing-save-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMsg({ text: 'Progress exported to JSON file!', type: 'success' });
  };

  const handleImport = () => {
    if (!importText.trim()) return;
    const ok = importData(importText);
    if (ok) {
      setStatusMsg({ text: 'Data imported successfully!', type: 'success' });
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setStatusMsg({ text: 'Invalid JSON data. Please check formatting.', type: 'error' });
    }
  };

  const handleReset = () => {
    resetProgress();
    setConfirmReset(false);
    setStatusMsg({ text: 'Progress reset to default.', type: 'success' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="bg-[#1f2937] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl text-[#f3f4f6]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>⚙️ Save Data & Progress</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {statusMsg && (
            <div
              className={`p-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-950/70 border border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-950/70 border border-rose-500/30 text-rose-300'
              }`}
            >
              {statusMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* Export Section */}
          <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-2">
            <h4 className="font-semibold text-sm text-neutral-200">Export Backup</h4>
            <p className="text-xs text-neutral-400">
              Download your caught fish, temple offerings, and museum checklist as a JSON backup file.
            </p>
            <button
              onClick={handleExport}
              className="btn-amber text-xs py-2 px-3 mt-1 inline-flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Backup JSON</span>
            </button>
          </div>

          {/* Import Section */}
          <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-2">
            <h4 className="font-semibold text-sm text-neutral-200">Import Progress</h4>
            <p className="text-xs text-neutral-400">
              Paste previously exported JSON data to restore your progress:
            </p>
            <textarea
              rows={3}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder='{"gameState": {...}, "userProgress": {...}}'
              className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500 font-mono"
            />
            <button
              onClick={handleImport}
              disabled={!importText.trim()}
              className="bg-neutral-700 hover:bg-neutral-600 disabled:opacity-50 text-white text-xs font-semibold py-2 px-3.5 rounded-lg inline-flex items-center gap-1.5 transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Restore Data</span>
            </button>
          </div>

          {/* Reset Section */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-rose-300">Reset All Data</p>
              <p className="text-[11px] text-neutral-400">Clears all caught checkboxes and reset gear settings.</p>
            </div>
            {confirmReset ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-1.5 px-3 rounded-lg"
                >
                  Yes, Reset
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="bg-neutral-700 text-white text-xs py-1.5 px-2.5 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmReset(true)}
                className="bg-rose-950/60 hover:bg-rose-900/60 border border-rose-700/40 text-rose-300 text-xs py-1.5 px-3 rounded-lg flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
