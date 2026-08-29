import React, { useState } from 'react';
import { useSaveEditor } from '../context/SaveEditorContext';
import { SaveDiffInspector } from './SaveDiffInspector';
import { Download, GitCompare, RotateCcw, ShieldCheck, FileArchive } from 'lucide-react';

export const SaveExportBar: React.FC = () => {
  const {
    hasFile,
    fileName,
    diffs,
    downloadModifiedSave,
    downloadOriginalBackup,
    resetAllEdits,
    isProcessing
  } = useSaveEditor();

  const [showDiffModal, setShowDiffModal] = useState(false);

  if (!hasFile) return null;

  return (
    <>
      <div className="sticky bottom-4 z-40 max-w-5xl mx-auto w-full px-4">
        <div className="bg-[#182228]/95 backdrop-blur-xl border border-white/20 p-3.5 sm:p-4 rounded-3xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          {/* File Name & Staged Count */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <span>{fileName}</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.2 rounded-full border border-emerald-500/30">
                  Ready
                </span>
              </div>
              <p className="text-[11px] text-[#c4b5a0]">
                {diffs.length === 0
                  ? 'No modifications staged'
                  : `${diffs.length} property modification${diffs.length > 1 ? 's' : ''} staged`}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            {/* Reset */}
            {diffs.length > 0 && (
              <button
                onClick={resetAllEdits}
                title="Discard all changes and reset to original"
                className="cg-pill p-2 text-neutral-400 hover:text-white"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            {/* Original Backup */}
            <button
              onClick={downloadOriginalBackup}
              title="Download original .sav.bak snapshot"
              className="cg-pill py-2 px-3 text-xs text-[#c4b5a0] hover:text-white flex items-center gap-1.5"
            >
              <FileArchive className="w-3.5 h-3.5 text-neutral-400" />
              <span className="hidden md:inline">Backup (.bak)</span>
            </button>

            {/* Diff Inspector */}
            <button
              onClick={() => setShowDiffModal(true)}
              className="cg-pill py-2 px-3.5 text-xs text-white font-bold flex items-center gap-1.5 hover:text-white"
            >
              <GitCompare className="w-3.5 h-3.5 text-cyan-400" />
              <span>Review Diffs ({diffs.length})</span>
            </button>

            {/* Download Modified Save */}
            <button
              onClick={downloadModifiedSave}
              disabled={isProcessing}
              className="cg-pill cg-pill-active py-2 px-5 text-xs font-bold flex items-center gap-2 shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span>{isProcessing ? 'Repacking...' : 'Export Repacked .sav'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Diff Inspector Modal */}
      {showDiffModal && (
        <SaveDiffInspector
          isOpen={showDiffModal}
          onClose={() => setShowDiffModal(false)}
          onExport={downloadModifiedSave}
        />
      )}
    </>
  );
};
