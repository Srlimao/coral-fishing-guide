import React, { useState, useEffect } from 'react';
import { useFishing } from '../../context/FishingContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { useUserProfile } from '../user-profiles/UserProfileContext';
import { getAvatarById } from '../user-profiles/defaultProfiles';
import {
  X,
  Download,
  Upload,
  Trash2,
  Check,
  AlertTriangle,
  Globe,
  ZoomIn,
  Users,
  Cloud
} from 'lucide-react';

export const SaveManagerModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { exportData, importData, resetProgress, uiScale, setUiScale } = useFishing();
  const { language, setLanguage, supportedLanguages, t } = useLanguage();
  const { activeProfile, openProfileModal, cloudSyncStatus } = useUserProfile();

  const [importText, setImportText] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const avatar = getAvatarById(activeProfile.avatar);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const scalePresets = [
    { label: '90%', value: 0.90, desc: 'Compact' },
    { label: '100%', value: 1.00, desc: 'Standard' },
    { label: '105%', value: 1.05, desc: 'Default' },
    { label: '115%', value: 1.15, desc: 'Large' },
    { label: '125%', value: 1.25, desc: 'XL' }
  ];

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coral-island-${activeProfile.name.toLowerCase().replace(/\s+/g, '-')}-save-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMsg({ text: 'Progress exported to JSON file!', type: 'success' });
  };

  const handleImport = () => {
    if (!importText.trim()) return;
    const ok = importData(importText);
    if (ok) {
      setStatusMsg({ text: 'Data imported successfully into current profile!', type: 'success' });
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
    setStatusMsg({ text: 'Current profile progress reset to default.', type: 'success' });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
        className="bg-[#182228] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl text-[#f3f4f6] my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h3 id="settings-modal-title" className="text-lg font-bold text-white flex items-center gap-2">
            <span>⚙️ {t('nav_settings')}</span>
          </h3>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {statusMsg && (
            <div
              className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-950/70 border border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-950/70 border border-rose-500/30 text-rose-300'
              }`}
            >
              {statusMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* Active Profile & GCP DB Sync Card */}
          <div className="bg-gradient-to-r from-cyan-950/30 via-black/20 to-black/20 p-4 rounded-xl border border-cyan-500/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${avatar.bgGradient} flex items-center justify-center text-sm shadow`}>
                  <span>{avatar.emoji}</span>
                </div>
                <div>
                  <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider block">Active Profile</span>
                  <strong className="text-white text-xs">{activeProfile.name}</strong>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  openProfileModal();
                }}
                className="cg-pill text-[11px] py-1 px-2.5 font-bold flex items-center gap-1 hover:text-white"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Switch / Manage</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1 border-t border-white/5">
              <span>Cloud Status: <strong className="text-white capitalize">{cloudSyncStatus}</strong></span>
              <span className="flex items-center gap-1 text-cyan-300">
                <Cloud className="w-3 h-3" /> db.dunhas.com
              </span>
            </div>
          </div>

          {/* UI Scale Setting Section */}
          <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-white text-sm">
                <ZoomIn className="w-4 h-4 text-amber-400" />
                <span>UI Scaling & Size</span>
              </div>
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
                {Math.round(uiScale * 100)}%
              </span>
            </div>
            
            <div className="grid grid-cols-5 gap-1.5">
              {scalePresets.map(p => (
                <button
                  key={p.label}
                  onClick={() => setUiScale(p.value)}
                  className={`cg-pill py-1.5 px-1 text-xs flex flex-col items-center justify-center gap-0.5 ${
                    Math.abs(uiScale - p.value) < 0.01 ? 'cg-pill-active' : ''
                  }`}
                >
                  <span className="font-extrabold text-[11px]">{p.label}</span>
                  <span className="text-[9px] opacity-75">{p.desc}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-1">
              <span className="text-[10px] text-neutral-400 font-semibold">85%</span>
              <input
                type="range"
                min="0.85"
                max="1.30"
                step="0.05"
                value={uiScale}
                onChange={(e) => setUiScale(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <span className="text-[10px] text-neutral-400 font-semibold">130%</span>
            </div>
          </div>

          {/* Language Selection Grid */}
          <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-2.5">
            <div className="flex items-center gap-1.5 font-bold text-white text-sm">
              <Globe className="w-4 h-4 text-[#c4b5a0]" />
              <span>{t('language_modal_title')}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {supportedLanguages.map(l => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`cg-pill py-2 px-2 text-xs flex flex-col items-center justify-center gap-0.5 ${
                    language === l.code ? 'cg-pill-active' : ''
                  }`}
                >
                  <span className="text-base">{l.flag}</span>
                  <span className="text-[10px] font-bold truncate max-w-full">{l.nativeName}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Export Section */}
          <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-2">
            <h4 className="font-semibold text-xs text-neutral-200">Export Current Profile</h4>
            <button
              onClick={handleExport}
              className="cg-pill cg-pill-active text-xs py-1.5 px-3 inline-flex items-center gap-1.5 font-bold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Backup JSON</span>
            </button>
          </div>

          {/* Import Section */}
          <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-2">
            <h4 className="font-semibold text-xs text-neutral-200">Import Progress</h4>
            <textarea
              rows={2}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder='{"gameState": {...}, "userProgress": {...}}'
              className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-neutral-200 focus:outline-none focus:border-white font-mono"
            />
            <button
              onClick={handleImport}
              disabled={!importText.trim()}
              className="cg-pill text-xs font-semibold py-1.5 px-3 rounded-lg inline-flex items-center gap-1.5 transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Restore Data</span>
            </button>
          </div>

          {/* Reset Section */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-rose-300">Reset Profile Progress</p>
              <p className="text-[10px] text-neutral-400">Clears caught checklist for active profile.</p>
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
