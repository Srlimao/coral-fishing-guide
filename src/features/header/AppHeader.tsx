import React, { useState, useRef, useEffect } from 'react';
import { useFishing } from '../../context/FishingContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { BookOpen, Calendar, MapPin, Sparkles, Award, Settings, CheckCircle2, Layers, FolderDown, Globe } from 'lucide-react';
import superCoralImg from '../../assets/icons/Super_Coral.png';
import { SaveManagerModal } from '../settings/SaveManagerModal';
import { SaveImportModal } from '../save-import/SaveImportModal';

export const AppHeader: React.FC = () => {
  const { activeTab, setActiveTab, activeNowCount, userProgress } = useFishing();
  const { language, currentLanguageInfo, setLanguage, supportedLanguages, t } = useLanguage();

  const [showSettings, setShowSettings] = useState(false);
  const [showSaveImport, setShowSaveImport] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const caughtCount = Object.values(userProgress.caught).filter(Boolean).length;
  const donatedCount = Object.values(userProgress.donatedMuseum).filter(Boolean).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setShowLangDropdown(false);
      }
    };
    if (showLangDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLangDropdown]);

  return (
    <>
      <header className="glass-header sticky top-0 z-40 px-4 py-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2.5">
              <img
                src={superCoralImg}
                alt="Super Coral Logo"
                className="w-9 h-9 object-contain drop-shadow-md"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#c4b5a0]">
                Coral Guide <span className="text-white">Fishing</span>
              </span>
              <span className="bg-white/15 text-[#c4b5a0] border border-white/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
                v1.3+
              </span>
            </div>

            {/* Quick Progress Indicator on Mobile / Tablet */}
            <div className="flex xl:hidden items-center gap-2 bg-white/5 border border-white/15 px-2.5 py-1 rounded-full text-[11px] text-[#c4b5a0]">
              <span>🎣 <strong className="text-white">{caughtCount}/69</strong></span>
              <div className="w-[1px] h-2.5 bg-white/20" />
              <span>🏛️ <strong className="text-white">{donatedCount}/69</strong></span>
            </div>
          </div>

          {/* Navigation & Controls Wrapper */}
          <div className="flex items-center justify-between md:justify-end gap-2 w-full md:w-auto overflow-visible">
            
            {/* Scrollable Navigation Tabs */}
            <nav className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5 max-w-full">
              <button
                onClick={() => setActiveTab('catalog')}
                className={`cg-pill px-3 py-1.5 text-xs font-bold ${
                  activeTab === 'catalog' ? 'cg-pill-active' : ''
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{t('nav_journal')}</span>
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
                <span>{t('nav_calendar')}</span>
              </button>

              <button
                onClick={() => setActiveTab('map')}
                className={`cg-pill px-3 py-1.5 text-xs font-bold ${
                  activeTab === 'map' ? 'cg-pill-active' : ''
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{t('nav_map')}</span>
              </button>

              <button
                onClick={() => setActiveTab('bundles')}
                className={`cg-pill px-3 py-1.5 text-xs font-bold ${
                  activeTab === 'bundles' ? 'cg-pill-active' : ''
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('nav_altars')}</span>
              </button>

              <button
                onClick={() => setActiveTab('stats')}
                className={`cg-pill px-3 py-1.5 text-xs font-bold ${
                  activeTab === 'stats' ? 'cg-pill-active' : ''
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>{t('nav_mastery')}</span>
              </button>

              <button
                onClick={() => setActiveTab('backoffice')}
                className={`cg-pill px-2.5 py-1.5 text-xs font-bold ${
                  activeTab === 'backoffice' ? 'cg-pill-active' : ''
                }`}
                title={t('nav_pins')}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{t('nav_pins')}</span>
              </button>
            </nav>

            {/* Utility Controls (Outside of scroll container) */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 relative">
              
              {/* Language Selector Dropdown */}
              <div className="relative" ref={langDropdownRef}>
                <button
                  onClick={() => setShowLangDropdown(prev => !prev)}
                  className="cg-pill px-2.5 py-1.5 text-xs font-bold hover:text-white"
                  title="Change Language"
                >
                  <Globe className="w-3.5 h-3.5 text-[#c4b5a0]" />
                  <span>{currentLanguageInfo.flag} {currentLanguageInfo.code.toUpperCase()}</span>
                </button>

                {showLangDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#182228] border border-white/20 rounded-2xl shadow-2xl p-1.5 z-50 space-y-1">
                    {supportedLanguages.map(l => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code);
                          setShowLangDropdown(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                          language === l.code
                            ? 'bg-white text-[#13181b]'
                            : 'text-[#c4b5a0] hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{l.flag}</span>
                          <span>{l.nativeName}</span>
                        </span>
                        {language === l.code && <span>✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Import Save Game Button */}
              <button
                onClick={() => setShowSaveImport(true)}
                title={t('nav_import_save')}
                className="cg-pill px-2.5 py-1.5 text-xs font-bold hover:text-white"
              >
                <FolderDown className="w-3.5 h-3.5 text-[#c4b5a0]" />
                <span className="hidden xl:inline">{t('nav_import_save')}</span>
              </button>

              <button
                onClick={() => setShowSettings(true)}
                title={t('nav_settings')}
                aria-label={t('nav_settings')}
                className="cg-pill p-2"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* Quick Progress Indicator on Extra Large Screens */}
          <div className="hidden xl:flex items-center gap-3 bg-white/5 border border-white/15 px-3 py-1 rounded-full text-xs text-[#c4b5a0] flex-shrink-0">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#c4b5a0]" />
              <span>{t('nav_caught_count')}: <strong className="text-white">{caughtCount}/69</strong></span>
            </div>
            <div className="w-[1px] h-3 bg-white/20" />
            <div>
              <span>{t('nav_museum_count')}: <strong className="text-white">{donatedCount}/69</strong></span>
            </div>
          </div>

        </div>
      </header>

      {showSaveImport && <SaveImportModal isOpen={showSaveImport} onClose={() => setShowSaveImport(false)} />}
      {showSettings && <SaveManagerModal onClose={() => setShowSettings(false)} />}
    </>
  );
};
