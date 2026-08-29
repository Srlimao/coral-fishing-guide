import React from 'react';
import { useSaveEditor } from '../context/SaveEditorContext';
import { X, GitCompare, Download, CheckCircle2, AlertCircle } from 'lucide-react';

interface SaveDiffInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
}

export const SaveDiffInspector: React.FC<SaveDiffInspectorProps> = ({
  isOpen,
  onClose,
  onExport
}) => {
  const { diffs, fileName } = useSaveEditor();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="diff-modal-title"
        className="bg-[#182228] text-white border border-white/15 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <GitCompare className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 id="diff-modal-title" className="text-base font-bold text-white">
                Pre-Export Save Diff Inspector
              </h2>
              <p className="text-[11px] text-[#c4b5a0]">
                Review all staged modifications before packing into <strong>{fileName || 'EndOfDayAutoSave.sav'}</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Table */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3 text-xs">
          {diffs.length === 0 ? (
            <div className="text-center py-10 space-y-2 text-neutral-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="font-bold text-white">No modifications made yet</p>
              <p className="text-xs text-[#c4b5a0]">Change stats, items, or dates to stage diffs.</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-[11px] text-[#c4b5a0] flex items-center justify-between font-bold">
                <span>{diffs.length} Staged Property Changes:</span>
                <span className="text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full">
                  Validation Ready
                </span>
              </div>

              <div className="border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5 bg-black/30">
                {diffs.map(diff => (
                  <div key={diff.id} className="p-3 flex items-center justify-between gap-3 text-[11px]">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white">{diff.label}</span>
                        <span className="text-[9px] bg-white/10 px-1.5 py-0.2 rounded text-[#c4b5a0]">
                          {diff.subsystem}
                        </span>
                      </div>
                      <div className="text-[10px] text-neutral-500 font-mono">{diff.propertyKey}</div>
                    </div>

                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-rose-400 line-through bg-rose-950/40 px-2 py-0.5 rounded border border-rose-500/20">
                        {diff.formattedOld}
                      </span>
                      <span className="text-neutral-500">➔</span>
                      <span className="text-emerald-300 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                        {diff.formattedNew}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Validation Notice */}
          <div className="bg-cyan-950/40 border border-cyan-500/30 p-3 rounded-2xl flex items-start gap-2.5 text-[11px] text-cyan-200">
            <AlertCircle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <span>
              All chunk offsets and <code>tarray_len</code> checksums are automatically verified in memory before download to prevent save corruption.
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between bg-black/30">
          <button onClick={onClose} className="cg-pill px-4 py-1.5 text-xs">
            Back to Editor
          </button>

          <button
            onClick={() => {
              onClose();
              onExport();
            }}
            className="cg-pill cg-pill-active px-5 py-2 text-xs font-bold flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Confirm & Download .sav</span>
          </button>
        </div>
      </div>
    </div>
  );
};
