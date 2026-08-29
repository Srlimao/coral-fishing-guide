import React, { useState, useRef, useEffect } from 'react';
import { useFishing } from '../../context/FishingContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { useUserProfile } from '../user-profiles/UserProfileContext';
import { NavigationTab } from '../../types/fishing';
import {
  BookOpen,
  Calendar,
  MapPin,
  Sparkles,
  Award,
  Gamepad2,
  Settings,
  Layers,
  FolderDown,
  Globe,
  ChevronLeft,
  ChevronRight,
  Menu,
  Users,
  Hammer,
  Save
} from 'lucide-react';
import superCoralImg from '../../assets/icons/Super_Coral.png';
import { SaveManagerModal } from '../settings/SaveManagerModal';
import { SaveImportModal } from '../save-import/SaveImportModal';
import { UserProfileModal } from '../user-profiles/UserProfileModal';
import { UserProfileSelector } from '../user-profiles/UserProfileSelector';
import { AppMobileDrawer } from './AppMobileDrawer';

export const AppLeftSidebar: React.FC = () => {
  const { activeTab, setActiveTab, activeNowCount, userProgress } = useFishing();
  const { language, currentLanguageInfo, setLanguage, supportedLanguages, t } = useLanguage();
  const { openProfileModal } = useUserProfile();

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

  interface NavItem {
    id: NavigationTab;
    label: string;
    icon: React.ElementType;
    badge?: number;
  }

  const navItems: NavItem[] = [
    { id: 'catalog', label: t('nav_journal'), icon: BookOpen, badge: activeNowCount },
    { id: 'crafting', label: t('nav_crafting_building'), icon: Hammer },
    { id: 'calendar', label: t('nav_calendar'), icon: Calendar },
    { id: 'map', label: t('nav_map'), icon: MapPin },
    { id: 'bundles', label: t('nav_altars'), icon: Sparkles },
    { id: 'stats', label: t('nav_mastery'), icon: Award },
    { id: 'trivia', label: t('nav_trivia'), icon: Gamepad2 },
    { id: 'save-editor', label: t('nav_save_editor'), icon: Save },
    { id: 'backoffice', label: t('nav_pins'), icon: Layers }
  ];

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

        <div className="flex items-center gap-2">
          <button
            onClick={openProfileModal}
            aria-label="Open Profile Manager"
            className="flex items-center gap-2 text-xs text-[#c4b5a0] bg-white/5 px-2.5 py-1 rounded-xl border border-white/10 hover:bg-white/10"
          >
            <span>🎣 <strong className="text-white">{caughtCount}/69</strong></span>
            <div className="w-[1px] h-2.5 bg-white/20" />
            <Users className="w-3.5 h-3.5 text-cyan-300" />
          </button>
        </div>
      </header>

      {/* Mobile Overlay Drawer */}
      <AppMobileDrawer
        isOpen={isMobileOpen}
        activeTab={activeTab}
        activeNowCount={activeNowCount}
        onClose={() => setIsMobileOpen(false)}
        onSelectTab={setActiveTab}
        onOpenSaveImport={() => setShowSaveImport(true)}
        onOpenSettings={() => setShowSettings(true)}
      />

      {/* Desktop Left Sidebar Navigation */}
      <aside
        className={`hidden lg:flex flex-col justify-between glass-header border-r border-white/10 sticky top-0 h-screen p-3 z-30 transition-all duration-300 text-xs flex-shrink-0 ${
          isCollapsed ? 'w-20 items-center' : 'w-64'
        }`}
      >
        {/* Top: Logo & Title + User Profile Selector + Nav Links */}
        <div className="space-y-3 w-full">
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

          {/* User Profile Selector Pill */}
          <div className="w-full">
            <UserProfileSelector isCollapsed={isCollapsed} />
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
      <UserProfileModal />
    </>
  );
};
