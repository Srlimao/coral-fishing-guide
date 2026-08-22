import React, { useState } from 'react';
import { useFishing } from '../../context/FishingContext';
import { BookOpen, Calendar, MapPin, Sparkles, Award, Settings, CheckCircle2, Layers, FolderDown } from 'lucide-react';
import superCoralImg from '../../assets/icons/Super_Coral.png';
import { SaveManagerModal } from '../settings/SaveManagerModal';
import { SaveImportModal } from '../save-import/SaveImportModal';

export const AppHeader: React.FC = () => {
  const { activeTab, setActiveTab, activeNowCount, userProgress } = useFishing();

  const [showSettings, setShowSettings] = useState(false);
  const [showSaveImport, setShowSaveImport] = useState(false);

  const caughtCount = Object.values(userProgress.caught).filter(Boolean).length;
  const donatedCount = Object.values(userProgress.donatedMuseum).filter(Boolean).length;
  const offeredCount = Object.values(userProgress.offeredTemple).filter(Boolean).length;

  return (
    <>
      <header className="glass-header sticky top-0 z-40 px-4 py-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <img
              src={superCoralImg}
              alt="Super Coral Logo"
              className="w-9 h-9 object-contain drop-shadow-md"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#c4b5a0]">
                  Coral Guide <span className="text-white">Fishing</span>
                </span>
                <span className="bg-white/15 text-[#c4b5a0] border border-white/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  v1.3+
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs in Coral Guide Capsule Pill Style */}
          <nav className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`cg-pill px-3 py-1.5 text-xs font-bold ${
                activeTab === 'catalog' ? 'cg-pill-active' : ''
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Fish Journal</span>
              {activeNowCount > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  activeTab === 'catalog' ? 'bg-[#13181b] text-white' : 'bg-white/20 text-white'
                }`}>
                  {activeNowCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`cg-pill px-3 py-1.5 text-xs font-bold ${
                activeTab === 'calendar' ? 'cg-pill-active' : ''
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>28-Day Schedule</span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`cg-pill px-3 py-1.5 text-xs font-bold ${
                activeTab === 'map' ? 'cg-pill-active' : ''
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Island Map</span>
            </button>

            <button
              onClick={() => setActiveTab('bundles')}
              className={`cg-pill px-3 py-1.5 text-xs font-bold ${
                activeTab === 'bundles' ? 'cg-pill-active' : ''
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Temple Altars</span>
              {offeredCount > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  activeTab === 'bundles' ? 'bg-[#13181b] text-white' : 'bg-white/20 text-white'
                }`}>
                  {offeredCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('stats')}
              className={`cg-pill px-3 py-1.5 text-xs font-bold ${
                activeTab === 'stats' ? 'cg-pill-active' : ''
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Mastery</span>
            </button>

            <button
              onClick={() => setActiveTab('backoffice')}
              className={`cg-pill px-2.5 py-1.5 text-xs font-bold ${
                activeTab === 'backoffice' ? 'cg-pill-active' : ''
              }`}
              title="Map Pin Editor & Back Office"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Pins</span>
            </button>

            {/* Import Save Game Button */}
            <button
              onClick={() => setShowSaveImport(true)}
              title="Import Coral Island Save Game (.sav)"
              className="cg-pill px-3 py-1.5 text-xs font-bold hover:text-white"
            >
              <FolderDown className="w-3.5 h-3.5 text-[#c4b5a0]" />
              <span>Import Save</span>
            </button>

            <button
              onClick={() => setShowSettings(true)}
              title="Settings"
              aria-label="Settings"
              className="cg-pill p-2"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </nav>

          {/* Quick Progress Indicator */}
          <div className="hidden lg:flex items-center gap-3 bg-white/5 border border-white/15 px-3 py-1 rounded-full text-xs text-[#c4b5a0]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#c4b5a0]" />
              <span>Caught: <strong className="text-white">{caughtCount}/69</strong></span>
            </div>
            <div className="w-[1px] h-3 bg-white/20" />
            <div>
              <span>Museum: <strong className="text-white">{donatedCount}/69</strong></span>
            </div>
          </div>
        </div>
      </header>

      {showSaveImport && <SaveImportModal isOpen={showSaveImport} onClose={() => setShowSaveImport(false)} />}
      {showSettings && <SaveManagerModal onClose={() => setShowSettings(false)} />}
    </>
  );
};
