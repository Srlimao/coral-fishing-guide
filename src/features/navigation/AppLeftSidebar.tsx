import React, { useState, useRef, useEffect } from 'react';
import { useFishing } from '../../context/FishingContext';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  BookOpen,
  Calendar,
  MapPin,
  Sparkles,
  Award,
  Settings,
  Layers,
  FolderDown,
  Globe,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import superCoralImg from '../../assets/icons/Super_Coral.png';
import { SaveManagerModal } from '../settings/SaveManagerModal';
import { SaveImportModal } from '../save-import/SaveImportModal';

export const AppLeftSidebar: React.FC = () => {
  const { activeTab, setActiveTab, activeNowCount, userProgress } = useFishing();
  const { language, currentLanguageInfo, setLanguage, supportedLanguages, t } = useLanguage();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
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

  const navItems = [
    { id: 'catalog', label: t('nav_journal'), icon: BookOpen, badge: activeNowCount },
    { id: 'calendar', label: t('nav_calendar'), icon: Calendar },
    { id: 'map', label: t('nav_map'), icon: MapPin },
    { id: 'bundles', label: t('nav_altars'), icon: Sparkles },
    { id: 'stats', label: t('nav_mastery'), icon: Award },
    { id: 'backoffice', label: t('nav_pins'), icon: Layers }
  ] as const;

  return (
    <>
      {/* Mobile Top Header (Visible only on < lg) */}
      <header className="lg:hidden glass-header sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsMobileOpen(true)}
            aria-label="Open Navigation Menu"
            className="p-1.5 rounded-xl bg-white/10 text-[#c4b5a0] hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          <img src={superCoralImg} alt="Super Coral Logo" className="w-7 h-7 object-contain" />
          <span className="text-base font-bold text-[#c4b5a0]">
            Coral Guide <span className="text-white">Fishing</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#c4b5a0]">
          <span>🎣 <strong className="text-white">{caughtCount}/69</strong></span>
          <div className="w-[1px] h-2.5 bg-white/20" />
          <span>🏛️ <strong className="text-white">{donatedCount}/69</strong></span>
        </div>
      </header>

      {/* Mobile Overlay Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="relative bg-[#182228] w-72 h-full p-4 flex flex-col justify-between border-r border-white/10 shadow-2xl z-10 text-xs">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <img src={superCoralImg} alt="Super Coral Logo" className="w-7 h-7 object-contain" />
                  <span className="font-bold text-white text-base">Coral Guide</span>
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  aria-label="Close"
                  className="p-1.5 rounded-lg bg-white/5 text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav className="space-y-1.5">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileOpen(false);
                    }}
                    className={`cg-pill w-full py-2.5 px-3.5 text-xs justify-between ${
                      activeTab === item.id ? 'cg-pill-active' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="bg-[#13181b] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            <div className="pt-3 border-t border-white/10 space-y-2">
              {/* Language Selection Grid */}
              <div className="space-y-1">
                <span className="text-[10px] text-[#c4b5a0] uppercase font-bold block">Language</span>
                <div className="grid grid-cols-4 gap-1">
                  {supportedLanguages.map(l => (
                    <button
                      key={l.code}
                      onClick={() => setLanguage(l.code)}
                      className={`p-1.5 rounded-lg text-center text-xs font-bold ${
                        language === l.code ? 'bg-white text-[#13181b]' : 'bg-white/5 text-[#c4b5a0]'
                      }`}
                    >
                      {l.flag}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => { setShowSaveImport(true); setIsMobileOpen(false); }}
                className="cg-pill w-full py-2 px-3 justify-center gap-2"
              >
                <FolderDown className="w-4 h-4 text-[#c4b5a0]" />
                <span>{t('nav_import_save')}</span>
              </button>

              <button
                onClick={() => { setShowSettings(true); setIsMobileOpen(false); }}
                className="cg-pill w-full py-2 px-3 justify-center gap-2"
              >
                <Settings className="w-4 h-4" />
                <span>{t('nav_settings')}</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Desktop Left Sidebar Navigation */}
      <aside
        className={`hidden lg:flex flex-col justify-between glass-header border-r border-white/10 sticky top-0 h-screen p-3 z-30 transition-all duration-300 text-xs flex-shrink-0 ${
          isCollapsed ? 'w-20 items-center' : 'w-64'
        }`}
      >
        {/* Top: Logo & Title + Collapse Toggle */}
        <div className="space-y-4 w-full">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} border-b border-white/10 pb-3`}>
            {!isCollapsed && (
              <div className="flex items-center gap-2.5">
                <img src={superCoralImg} alt="Super Coral Logo" className="w-8 h-8 object-contain drop-shadow" />
                <div>
                  <span className="text-base font-bold text-[#c4b5a0] leading-tight block">
                    Coral Guide
                  </span>
                  <span className="text-white text-xs font-bold">Fishing</span>
                </div>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(prev => !prev)}
              title={isCollapsed ? 'Expand Left Menu' : 'Collapse Left Menu'}
              aria-label={isCollapsed ? 'Expand Menu' : 'Collapse Menu'}
              className="cg-pill p-2 hover:text-white"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5 w-full">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={item.label}
                className={`cg-pill w-full py-2.5 px-3 text-xs ${
                  isCollapsed ? 'justify-center' : 'justify-between'
                } ${activeTab === item.id ? 'cg-pill-active' : ''}`}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </div>
                {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    activeTab === item.id ? 'bg-[#13181b] text-white' : 'bg-white/20 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom: Progress Counter, Language, Import Save & Settings */}
        <div className="space-y-2 w-full pt-3 border-t border-white/10">
          {!isCollapsed && (
            <div className="bg-white/5 border border-white/10 p-2.5 rounded-2xl space-y-1 text-[#c4b5a0] text-[11px]">
              <div className="flex items-center justify-between">
                <span>{t('nav_caught_count')}:</span>
                <strong className="text-white font-bold">{caughtCount}/69</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>{t('nav_museum_count')}:</span>
                <strong className="text-white font-bold">{donatedCount}/69</strong>
              </div>
            </div>
          )}

          {/* Language Selector Dropdown */}
          <div className="relative w-full" ref={langDropdownRef}>
            <button
              onClick={() => setShowLangDropdown(prev => !prev)}
              className={`cg-pill w-full py-2 text-xs font-bold hover:text-white ${isCollapsed ? 'justify-center px-1' : 'justify-between px-3'}`}
              title="Change Language"
            >
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-[#c4b5a0]" />
                {!isCollapsed && <span>{currentLanguageInfo.nativeName}</span>}
              </div>
              <span>{currentLanguageInfo.flag}</span>
            </button>

            {showLangDropdown && (
              <div className="absolute bottom-full left-0 mb-2 w-48 bg-[#182228] border border-white/20 rounded-2xl shadow-2xl p-1.5 z-50 space-y-1">
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

          {/* Import Save Button */}
          <button
            onClick={() => setShowSaveImport(true)}
            title={t('nav_import_save')}
            className={`cg-pill w-full py-2 text-xs font-bold hover:text-white ${isCollapsed ? 'justify-center px-1' : 'justify-start gap-2 px-3'}`}
          >
            <FolderDown className="w-3.5 h-3.5 text-[#c4b5a0]" />
            {!isCollapsed && <span>{t('nav_import_save')}</span>}
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setShowSettings(true)}
            title={t('nav_settings')}
            aria-label={t('nav_settings')}
            className={`cg-pill w-full py-2 text-xs font-bold hover:text-white ${isCollapsed ? 'justify-center px-1' : 'justify-start gap-2 px-3'}`}
          >
            <Settings className="w-3.5 h-3.5 text-[#c4b5a0]" />
            {!isCollapsed && <span>{t('nav_settings')}</span>}
          </button>
        </div>
      </aside>

      {/* Modals */}
      {showSaveImport && <SaveImportModal isOpen={showSaveImport} onClose={() => setShowSaveImport(false)} />}
      {showSettings && <SaveManagerModal onClose={() => setShowSettings(false)} />}
    </>
  );
};
