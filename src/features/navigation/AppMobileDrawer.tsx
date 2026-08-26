import React from 'react';
import { NavigationTab } from '../../types/fishing';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  BookOpen,
  Calendar,
  MapPin,
  Sparkles,
  Award,
  Layers,
  Gamepad2,
  FolderDown,
  Settings,
  X
} from 'lucide-react';
import superCoralImg from '../../assets/icons/Super_Coral.png';

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

interface AppMobileDrawerProps {
  isOpen: boolean;
  activeTab: NavigationTab;
  activeNowCount: number;
  onClose: () => void;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenSaveImport: () => void;
  onOpenSettings: () => void;
}

export const AppMobileDrawer: React.FC<AppMobileDrawerProps> = ({
  isOpen,
  activeTab,
  activeNowCount,
  onClose,
  onSelectTab,
  onOpenSaveImport,
  onOpenSettings
}) => {
  const { language, setLanguage, supportedLanguages, t } = useLanguage();

  if (!isOpen) return null;

  const navItems: NavItem[] = [
    { id: 'catalog', label: t('nav_journal'), icon: BookOpen, badge: activeNowCount },
    { id: 'calendar', label: t('nav_calendar'), icon: Calendar },
    { id: 'map', label: t('nav_map'), icon: MapPin },
    { id: 'bundles', label: t('nav_altars'), icon: Sparkles },
    { id: 'stats', label: t('nav_mastery'), icon: Award },
    { id: 'trivia', label: t('nav_trivia'), icon: Gamepad2 },
    { id: 'backoffice', label: t('nav_pins'), icon: Layers }
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <aside className="relative bg-[#182228] w-72 h-full p-4 flex flex-col justify-between border-r border-white/10 shadow-2xl z-10 text-xs">
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <img src={superCoralImg} alt="Super Coral Logo" className="w-7 h-7 object-contain" />
              <span className="font-bold text-white text-base">Coral Guide</span>
            </div>
            <button
              onClick={onClose}
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
                  onSelectTab(item.id);
                  onClose();
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
            onClick={() => { onOpenSaveImport(); onClose(); }}
            className="cg-pill w-full py-2 px-3 justify-center gap-2"
          >
            <FolderDown className="w-4 h-4 text-[#c4b5a0]" />
            <span>{t('nav_import_save')}</span>
          </button>

          <button
            onClick={() => { onOpenSettings(); onClose(); }}
            className="cg-pill w-full py-2 px-3 justify-center gap-2"
          >
            <Settings className="w-4 h-4" />
            <span>{t('nav_settings')}</span>
          </button>
        </div>
      </aside>
    </div>
  );
};
