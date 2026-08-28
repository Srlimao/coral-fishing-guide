import { SupportedLanguage } from './types';
import rawData from './gameDataTranslations.json';
import fishTranslationsJson from './fishTranslations.json';
import { LOCATION_TRANSLATIONS } from './locationTranslations';
import {
  ALTAR_TITLE_TRANSLATIONS,
  BUNDLE_TITLE_TRANSLATIONS,
  OFFERING_ITEM_NAME_TRANSLATIONS
} from './altarTranslations';

interface EntityTranslationMap {
  items?: Record<string, Partial<Record<SupportedLanguage, string>>>;
  fish?: Record<string, Partial<Record<SupportedLanguage, string>>>;
  buildings?: Record<string, Partial<Record<SupportedLanguage, string>>>;
  locations?: Record<string, Partial<Record<SupportedLanguage, string>>>;
  altars?: Record<string, Partial<Record<SupportedLanguage, string>>>;
  weather?: Record<string, Partial<Record<SupportedLanguage, string>>>;
  seasons?: Record<string, Partial<Record<SupportedLanguage, string>>>;
  times?: Record<string, Partial<Record<SupportedLanguage, string>>>;
  categories?: Record<string, Partial<Record<SupportedLanguage, string>>>;
  unlock_sources?: Record<string, Partial<Record<SupportedLanguage, string>>>;
}

const GAME_DATA = rawData as EntityTranslationMap;
const FISH_NAME_TRANSLATIONS = fishTranslationsJson as Record<string, Partial<Record<SupportedLanguage, string>>>;

export function getLocalizedFishName(idOrName: string, fallbackName: string, lang: SupportedLanguage): string {
  if (lang === 'en') return fallbackName;
  
  // 1. Check official mined fish translations by ID or fallbackName
  const directMatch = FISH_NAME_TRANSLATIONS[idOrName] || FISH_NAME_TRANSLATIONS[fallbackName];
  if (directMatch && directMatch[lang]) return directMatch[lang]!;

  // 2. Check game data translations
  const match = GAME_DATA.fish?.[idOrName] || GAME_DATA.fish?.[fallbackName] || GAME_DATA.items?.[idOrName] || GAME_DATA.items?.[fallbackName];
  if (match && match[lang]) return match[lang]!;

  return fallbackName;
}

export function getLocalizedItemName(nameOrId: string, fallbackName: string, lang: SupportedLanguage): string {
  if (lang === 'en') return fallbackName;
  const match = GAME_DATA.items?.[nameOrId] || GAME_DATA.items?.[fallbackName] || GAME_DATA.fish?.[nameOrId];
  if (match && match[lang]) return match[lang]!;
  return fallbackName;
}

export function getLocalizedBuildingName(nameOrId: string, fallbackName: string, lang: SupportedLanguage): string {
  if (lang === 'en') return fallbackName;
  const match = GAME_DATA.buildings?.[nameOrId] || GAME_DATA.buildings?.[fallbackName] || GAME_DATA.items?.[nameOrId];
  if (match && match[lang]) return match[lang]!;

  // Check base name without tier prefixes (Basic, Upgraded, Deluxe)
  const baseName = fallbackName.replace(/^(Basic|Upgraded|Deluxe)\s+/i, '');
  const baseMatch = GAME_DATA.buildings?.[baseName] || GAME_DATA.items?.[baseName];
  if (baseMatch && baseMatch[lang]) {
    const baseLocalized = baseMatch[lang]!;
    if (/^Basic\s+/i.test(fallbackName)) {
      return lang === 'pt' ? `${baseLocalized} Básico` : lang === 'es' ? `${baseLocalized} Básico` : `${baseLocalized} (I)`;
    }
    if (/^Upgraded\s+/i.test(fallbackName)) {
      return lang === 'pt' ? `${baseLocalized} Aprimorado` : lang === 'es' ? `${baseLocalized} Mejorado` : `${baseLocalized} (II)`;
    }
    if (/^Deluxe\s+/i.test(fallbackName)) {
      return lang === 'pt' ? `${baseLocalized} de Luxo` : lang === 'es' ? `${baseLocalized} de Lujo` : `${baseLocalized} (III)`;
    }
    return baseLocalized;
  }
  return fallbackName;
}

export function getLocalizedLocationName(locationName: string, lang: SupportedLanguage): string {
  if (lang === 'en') return locationName;

  // 1. Check official location translations dictionary
  const locMatch = LOCATION_TRANSLATIONS[locationName];
  if (locMatch && locMatch[lang]) return locMatch[lang]!;

  // 2. Check game data locations
  const match = GAME_DATA.locations?.[locationName];
  if (match && match[lang]) return match[lang]!;

  return locationName;
}

export function getLocalizedAltarTitle(altarKey: string, fallback: string, lang: SupportedLanguage): string {
  if (lang === 'en') return fallback;

  // 1. Check altar title translations
  const altarMatch = ALTAR_TITLE_TRANSLATIONS[altarKey] || ALTAR_TITLE_TRANSLATIONS[fallback];
  if (altarMatch && altarMatch[lang]) return altarMatch[lang]!;

  // 2. Check game data altars
  const match = GAME_DATA.altars?.[altarKey] || GAME_DATA.altars?.[fallback];
  if (match && match[lang]) return match[lang]!;

  return fallback;
}

export function getLocalizedBundleTitle(bundleTitle: string, lang: SupportedLanguage): string {
  if (lang === 'en') return bundleTitle;

  // 1. Check bundle title translations
  const bundleMatch = BUNDLE_TITLE_TRANSLATIONS[bundleTitle];
  if (bundleMatch && bundleMatch[lang]) return bundleMatch[lang]!;

  // 2. Check game data altars
  const match = GAME_DATA.altars?.[bundleTitle];
  if (match && match[lang]) return match[lang]!;

  return bundleTitle;
}

export function getLocalizedOfferingItemName(name: string, lang: SupportedLanguage): string {
  if (lang === 'en') return name;

  // 1. Check offering item translations
  const offeringMatch = OFFERING_ITEM_NAME_TRANSLATIONS[name];
  if (offeringMatch && offeringMatch[lang]) return offeringMatch[lang]!;

  // 2. Fall back to generic item translation
  return getLocalizedItemName(name, name, lang);
}

export function getLocalizedSeason(season: string, lang: SupportedLanguage): string {
  if (lang === 'en') return season;
  const capitalized = season.charAt(0).toUpperCase() + season.slice(1);
  const match = GAME_DATA.seasons?.[capitalized] || GAME_DATA.seasons?.[season];
  if (match && match[lang]) return match[lang]!;
  return season;
}

export function getLocalizedWeather(weather: string, lang: SupportedLanguage): string {
  if (lang === 'en') return weather;
  const capitalized = weather.charAt(0).toUpperCase() + weather.slice(1);
  const match = GAME_DATA.weather?.[capitalized] || GAME_DATA.weather?.[weather];
  if (match && match[lang]) return match[lang]!;
  return weather;
}

export function getLocalizedTime(timeOfDay: string, lang: SupportedLanguage): string {
  if (lang === 'en') return timeOfDay;
  const capitalized = timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1);
  const match = GAME_DATA.times?.[capitalized] || GAME_DATA.times?.[timeOfDay];
  if (match && match[lang]) return match[lang]!;
  return timeOfDay;
}

export function getLocalizedCategory(category: string, lang: SupportedLanguage): string {
  if (lang === 'en') return category;
  const match = GAME_DATA.categories?.[category];
  if (match && match[lang]) return match[lang]!;
  return category;
}

export function getLocalizedUnlockSource(source: string, lang: SupportedLanguage): string {
  if (lang === 'en') return source;
  const match = GAME_DATA.unlock_sources?.[source];
  if (match && match[lang]) return match[lang]!;
  return source;
}
