import React from 'react';
import { CatalogDomain } from './wikiConstants';
import { Hammer, Home, Wrench, FlaskConical, Waves, Sparkles } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface WikiHeaderNavProps {
  activeMode: CatalogDomain;
  onSwitchMode: (mode: CatalogDomain) => void;
}

export const WikiHeaderNav: React.FC<WikiHeaderNavProps> = ({
  activeMode,
  onSwitchMode
}) => {
  const { t } = useLanguage();

  return (
    <div className="bg-gradient-to-r from-[#182228] via-[#1a2b34] to-[#182228] p-5 sm:p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Island Encyclopedia
            </span>
            <span className="text-xs text-[#c4b5a0] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Complete Recipes, Builds & Research
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
            {t('wiki_title')}
          </h1>
          <p className="text-xs text-[#c4b5a0] max-w-2xl mt-1 leading-relaxed">
            {t('wiki_subtitle')}
          </p>
        </div>

        {/* 5-Domain Tab Switcher */}
        <div className="flex items-center gap-1 bg-[#13181b] p-1.5 rounded-2xl border border-white/15 overflow-x-auto scrollbar-none flex-shrink-0">
          <button
            onClick={() => onSwitchMode('crafting')}
            data-wiki-tab="crafting"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeMode === 'crafting'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25'
                : 'text-[#c4b5a0] hover:text-white hover:bg-white/5'
            }`}
          >
            <Hammer className="w-3.5 h-3.5" />
            <span>{t('wiki_tab_crafting')}</span>
          </button>

          <button
            onClick={() => onSwitchMode('buildings')}
            data-wiki-tab="buildings"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeMode === 'buildings'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/25'
                : 'text-[#c4b5a0] hover:text-white hover:bg-white/5'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>{t('wiki_tab_buildings')}</span>
          </button>

          <button
            onClick={() => onSwitchMode('tools')}
            data-wiki-tab="tools"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeMode === 'tools'
                ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/25'
                : 'text-[#c4b5a0] hover:text-white hover:bg-white/5'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>{t('wiki_tab_tools', 'Tools & Upgrades')}</span>
          </button>

          <button
            onClick={() => onSwitchMode('lab')}
            data-wiki-tab="lab"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeMode === 'lab'
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                : 'text-[#c4b5a0] hover:text-white hover:bg-white/5'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>{t('wiki_tab_lab', 'Lab & Research')}</span>
          </button>

          <button
            onClick={() => onSwitchMode('ocean')}
            data-wiki-tab="ocean"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeMode === 'ocean'
                ? 'bg-teal-500 text-black shadow-lg shadow-teal-500/25'
                : 'text-[#c4b5a0] hover:text-white hover:bg-white/5'
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>{t('wiki_tab_ocean', 'Ocean & Diving')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
