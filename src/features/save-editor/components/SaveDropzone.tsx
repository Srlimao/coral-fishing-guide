import React, { useState } from 'react';
import { useSaveEditor } from '../context/SaveEditorContext';
import { UploadCloud, FolderOpen, AlertTriangle, Sparkles, FileText } from 'lucide-react';

export const SaveDropzone: React.FC = () => {
  const { loadFile, isProcessing, error } = useSaveEditor();
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.sav')) {
      alert('Please select a valid Unreal Engine .sav file (e.g. EndOfDayAutoSave.sav).');
      return;
    }
    loadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-8">
      {/* Header Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>UE4.27 GVAS 128KB Chunked Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Coral Island Save Editor Workbench
        </h1>
        <p className="text-xs sm:text-sm text-[#c4b5a0] max-w-xl mx-auto">
          Modify wallet money, spawn Osmium items, complete Goddess Altars, adjust calendar dates, water crops, and max NPC relationships.
        </p>
      </div>

      {/* Dropzone Box */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all ${
          dragActive
            ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
            : 'border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/[0.07]'
        }`}
      >
        <UploadCloud className="w-12 h-12 text-[#c4b5a0] mx-auto mb-3" />
        <h3 className="font-bold text-base text-white mb-1">
          Select or Drop Your Save File
        </h3>
        <p className="text-xs text-[#c4b5a0] mb-6">
          Supports <strong>EndOfDayAutoSave.sav</strong>, <strong>BackupSave*.sav</strong>, and slot saves.
        </p>

        <label className="cg-pill cg-pill-active py-2.5 px-6 text-xs font-bold cursor-pointer inline-flex items-center gap-2">
          <FolderOpen className="w-4 h-4" />
          <span>{isProcessing ? 'Decompressing GVAS Chunks...' : 'Browse Save File (.sav)'}</span>
          <input
            type="file"
            accept=".sav"
            onChange={(e) => e.target.files && e.target.files[0] && handleFile(e.target.files[0])}
            className="hidden"
          />
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-rose-950/60 border border-rose-500/40 p-4 rounded-2xl flex items-center gap-3 text-rose-300 text-xs">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* File Location Guidance */}
      <div className="bg-black/30 p-4 rounded-2xl border border-white/10 space-y-2 text-xs text-[#c4b5a0]">
        <div className="flex items-center gap-2 font-bold text-white">
          <FileText className="w-4 h-4 text-amber-400" />
          <span>Where to find your Coral Island save files:</span>
        </div>
        <p className="text-[11px]">
          Press <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white font-mono">Win + R</kbd> and paste:
        </p>
        <code className="block bg-black/50 p-2.5 rounded-xl text-neutral-300 font-mono text-[11px] select-all break-all border border-white/5">
          %LOCALAPPDATA%\ProjectCoral\Saved\SaveGames
        </code>
        <p className="text-[11px] text-neutral-400">
          Inside <code>World_0</code>, <code>World_1</code>, etc., select <strong>EndOfDayAutoSave.sav</strong>.
        </p>
      </div>
    </div>
  );
};
