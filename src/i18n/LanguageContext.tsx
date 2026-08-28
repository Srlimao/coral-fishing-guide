import React, { createContext, useContext, useState, useCallback } from 'react';
import { SupportedLanguage, TranslationDictionary, SUPPORTED_LANGUAGES, LanguageInfo } from './types';
import { en } from './locales/en';
import { pt } from './locales/pt';
import { es } from './locales/es';
import { de } from './locales/de';
import { fr } from './locales/fr';
import { zh } from './locales/zh';
import { ja } from './locales/ja';
import { id } from './locales/id';
import {
  getLocalizedFishName,
  getLocalizedItemName,
  getLocalizedBuildingName,
  getLocalizedLocationName,
  getLocalizedAltarTitle,
  getLocalizedBundleTitle,
  getLocalizedOfferingItemName,
  getLocalizedSeason,
  getLocalizedWeather,
  getLocalizedTime,
  getLocalizedCategory,
  getLocalizedUnlockSource
} from './gameTranslations';

const DICTIONARIES: Record<SupportedLanguage, TranslationDictionary> = {
  en,
  pt,
  es,
  de,
  fr,
  zh,
  ja,
  id
};

const LOCAL_STORAGE_KEY_LANG = 'coral_fish_guide_lang_v1';

interface LanguageContextType {
  language: SupportedLanguage;
  currentLanguageInfo: LanguageInfo;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: keyof TranslationDictionary, fallback?: string) => string;
  getFishName: (fish: { id: string; name: string }) => string;
  getItemName: (nameOrId: string, fallback?: string) => string;
  getBuildingName: (nameOrId: string, fallback?: string) => string;
  getLocationName: (locationName: string) => string;
  getAltarTitle: (altarKey: string, fallback: string) => string;
  getBundleTitle: (bundleTitle: string) => string;
  getOfferingItemName: (itemName: string) => string;
  getCategoryName: (category: string) => string;
  getUnlockSourceName: (source: string) => string;
  getSeasonName: (season: string) => string;
  getWeatherName: (weather: string) => string;
  getTimeName: (time: string) => string;
  supportedLanguages: LanguageInfo[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_LANG) as SupportedLanguage;
      if (saved && DICTIONARIES[saved]) return saved;
      
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('pt')) return 'pt';
      if (browserLang.startsWith('es')) return 'es';
      if (browserLang.startsWith('de')) return 'de';
      if (browserLang.startsWith('fr')) return 'fr';
      if (browserLang.startsWith('zh')) return 'zh';
      if (browserLang.startsWith('ja')) return 'ja';
      if (browserLang.startsWith('id')) return 'id';
      return 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_LANG, lang);
    } catch (e) {
      console.warn('Could not save language to localStorage', e);
    }
  };

  const t = useCallback((key: keyof TranslationDictionary, fallback?: string): string => {
    const dict = DICTIONARIES[language] || DICTIONARIES.en;
    return dict[key] || DICTIONARIES.en[key] || fallback || key;
  }, [language]);

  const getFishName = useCallback((fish: { id: string; name: string }): string => {
    return getLocalizedFishName(fish.id, fish.name, language);
  }, [language]);

  const getItemName = useCallback((nameOrId: string, fallback?: string): string => {
    return getLocalizedItemName(nameOrId, fallback || nameOrId, language);
  }, [language]);

  const getBuildingName = useCallback((nameOrId: string, fallback?: string): string => {
    return getLocalizedBuildingName(nameOrId, fallback || nameOrId, language);
  }, [language]);

  const getLocationName = useCallback((locationName: string): string => {
    return getLocalizedLocationName(locationName, language);
  }, [language]);

  const getAltarTitle = useCallback((altarKey: string, fallback: string): string => {
    return getLocalizedAltarTitle(altarKey, fallback, language);
  }, [language]);

  const getBundleTitle = useCallback((bundleTitle: string): string => {
    return getLocalizedBundleTitle(bundleTitle, language);
  }, [language]);

  const getOfferingItemName = useCallback((itemName: string): string => {
    return getLocalizedOfferingItemName(itemName, language);
  }, [language]);

  const getCategoryName = useCallback((category: string): string => {
    return getLocalizedCategory(category, language);
  }, [language]);

  const getUnlockSourceName = useCallback((source: string): string => {
    return getLocalizedUnlockSource(source, language);
  }, [language]);

  const getSeasonName = useCallback((season: string): string => {
    return getLocalizedSeason(season, language);
  }, [language]);

  const getWeatherName = useCallback((weather: string): string => {
    return getLocalizedWeather(weather, language);
  }, [language]);

  const getTimeName = useCallback((time: string): string => {
    return getLocalizedTime(time, language);
  }, [language]);

  const currentLanguageInfo = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        currentLanguageInfo,
        setLanguage,
        t,
        getFishName,
        getItemName,
        getBuildingName,
        getLocationName,
        getAltarTitle,
        getBundleTitle,
        getOfferingItemName,
        getCategoryName,
        getUnlockSourceName,
        getSeasonName,
        getWeatherName,
        getTimeName,
        supportedLanguages: SUPPORTED_LANGUAGES
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
