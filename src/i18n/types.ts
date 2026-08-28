export type SupportedLanguage = 'en' | 'pt' | 'es' | 'de' | 'fr' | 'zh' | 'ja' | 'id';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português (BR)', flag: '🇧🇷' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'zh', name: 'Chinese', nativeName: '简体中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' }
];

export interface TranslationDictionary {
  // Navigation
  nav_journal: string;
  nav_calendar: string;
  nav_map: string;
  nav_altars: string;
  nav_mastery: string;
  nav_pins: string;
  nav_trivia: string;
  nav_import_save: string;
  nav_settings: string;
  nav_caught_count: string;
  nav_museum_count: string;
  nav_profiles: string;

  // Profiles & Cloud Sync
  profile_title: string;
  profile_active: string;
  profile_create: string;
  profile_name_placeholder: string;
  profile_select_avatar: string;
  profile_switch: string;
  cloud_sync_title: string;
  cloud_sync_now: string;
  cloud_synced: string;
  cloud_syncing: string;
  cloud_offline: string;

  // Filters & Sidebar
  search_placeholder: string;
  active_right_now: string;
  season_date_header: string;
  time_of_day_header: string;
  weather_header: string;
  fishing_level_header: string;
  equipped_rod_header: string;
  checklists_header: string;
  filter_uncaught: string;
  filter_altars: string;
  filter_museum: string;
  filter_rarity: string;
  filter_size: string;
  reset_filters: string;

  // Seasons
  season_spring: string;
  season_summer: string;
  season_fall: string;
  season_winter: string;

  // Times
  time_morning: string;
  time_afternoon: string;
  time_evening: string;
  time_night: string;

  // Weathers
  weather_sunny: string;
  weather_rain: string;
  weather_storm: string;
  weather_snow: string;
  weather_blizzard: string;
  weather_windy: string;

  // Rarities
  rarity_all: string;
  rarity_common: string;
  rarity_uncommon: string;
  rarity_rare: string;
  rarity_legendary: string;

  // Sizes
  size_all: string;
  size_small: string;
  size_medium: string;
  size_large: string;

  // Difficulties
  diff_very_easy: string;
  diff_easy: string;
  diff_medium: string;
  diff_hard: string;
  diff_very_hard: string;

  // Rods
  rod_makeshift: string;
  rod_copper: string;
  rod_silver: string;
  rod_gold: string;
  rod_osmium: string;

  // Card & Detail Actions
  btn_caught: string;
  btn_uncaught: string;
  btn_museum_donated: string;
  btn_museum_missing: string;
  btn_altar_offered: string;
  btn_altar_needed: string;
  badge_active_now: string;
  badge_exclusive_season: string;
  badge_exclusive_weather: string;
  badge_exclusive_time: string;
  price_regular: string;
  price_bronze: string;
  price_silver: string;
  price_gold: string;
  price_osmium: string;
  gear_suitability: string;
  spawn_locations_title: string;
  times_weather_title: string;
  lake_temple_title: string;
  any_waters: string;

  // Calendar
  calendar_title: string;
  calendar_subtitle: string;
  selected_day: string;
  day_label: string;
  leaving_soon_title: string;
  leaving_soon_desc: string;
  seasonal_matrix_title: string;
  col_fish_name: string;
  col_rarity: string;
  col_active_times: string;
  col_primary_loc: string;
  col_status: string;
  col_value: string;

  // Altars
  altar_header_title: string;
  altar_header_desc: string;
  reward_label: string;
  bundle_complete: string;

  // Language Modal
  language_modal_title: string;
  language_modal_desc: string;

  // Craft & Building Wiki
  nav_crafting_building: string;
  wiki_title: string;
  wiki_subtitle: string;
  wiki_tab_crafting: string;
  wiki_tab_buildings: string;
  wiki_tab_planner: string;
  wiki_search_placeholder: string;
  wiki_filter_all_categories: string;
  wiki_filter_unlock_source: string;
  wiki_all_unlocks: string;
  wiki_planner_add: string;
  wiki_planner_remove: string;
  wiki_planner_view: string;
  wiki_planner_title: string;
  wiki_planner_empty: string;
  wiki_planner_clear: string;
  wiki_planner_copy: string;
  wiki_planner_copied: string;
  wiki_total_gold: string;
  wiki_total_materials: string;
  wiki_days_to_build: string;
  wiki_footprint: string;
  wiki_unlock_condition: string;
  wiki_yield: string;
  wiki_sell_price: string;
  wiki_materials_needed: string;
  wiki_upgrade_tier: string;
  wiki_benefits: string;
}
