import { SupportedLanguage } from './types';
import fishTranslationsJson from './fishTranslations.json';

// Map fish ID to localized names (all 69 Coral Island fish)
export const FISH_NAME_TRANSLATIONS: Record<string, Partial<Record<SupportedLanguage, string>>> = fishTranslationsJson as Record<string, Partial<Record<SupportedLanguage, string>>>;

export function getLocalizedFishName(fishId: string, fallbackName: string, lang: SupportedLanguage): string {
  if (lang === 'en') return fallbackName;
  const match = FISH_NAME_TRANSLATIONS[fishId];
  if (match && match[lang]) return match[lang]!;
  return fallbackName;
}
