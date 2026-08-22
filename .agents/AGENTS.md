# Technical Architecture & Developer Guide

This document defines the technical architecture, data pipelines, and development rules for the **Coral Island Fishing Guide** codebase.

---

## 🏛️ Architecture & Directory Structure

The project follows a **Feature-Driven Vertical Slice Architecture** with a **strict hard limit of 300 lines per file**.

```
CoralFishGuide/
├── .agents/
│   └── AGENTS.md                  # Technical architecture reference
├── src/
│   ├── assets/                    # Static fonts, icons, min-mined map & images
│   ├── context/
│   │   ├── FishingContext.tsx      # Main application state, persistence & progress
│   │   └── fishingContextHelpers.ts# Search filtering, sorting & multi-language matching
│   ├── data/
│   │   ├── fishData.json          # 69 mined fish with spawnSettings & pricing tables
│   │   ├── bundlesData.ts         # Goddess Lake Temple catch altar offerings
│   │   ├── locationsData.ts       # 13 default map locations with multi-spot pins
│   │   └── raw/                   # Raw mined game json files
│   ├── features/
│   │   ├── bundles/               # Lake Temple Altars offering tracker view
│   │   ├── calculator/            # Pure calculation engine (exclusivity, chances)
│   │   ├── calendar/              # 28-day schedule matrix view
│   │   ├── fish-list/             # Fish card grid, modal, filters & minigame visualizer
│   │   ├── gear/                  # Rod tiers, baits, and tackle selector
│   │   ├── header/                # Top brand header & utility bar
│   │   ├── map/                   # Interactive map and Back Office multi-pin editor
│   │   ├── navigation/            # Collapsible 3-column Left Sidebar & mobile drawer
│   │   ├── save-import/           # UE4 .sav GVAS file dropzone and import modal
│   │   ├── settings/              # Save manager modal, backup export & UI scale slider
│   │   ├── stats/                 # Fishing mastery, level XP milestones & sell revenue
│   │   └── time-weather/          # Simulation controls (Season, Day, Weather, Time)
│   ├── i18n/                      # 8-language localization system & dictionaries
│   │   ├── LanguageContext.tsx    # Context provider & translation lookup hook
│   │   ├── fishTranslations.ts    # 69+ fish names & descriptions in 8 languages
│   │   ├── locationTranslations.ts# Spawn areas & cave names in 8 languages
│   │   └── locales/               # en, pt, es, de, fr, zh, ja, id string dictionaries
│   ├── types/
│   │   └── fishing.ts             # Global TypeScript interfaces & enums
│   ├── App.tsx                    # 3-Column Tri-Pane Shell
│   ├── index.css                  # Tailwind v4 theme, glassmorphism & --ui-scale
│   └── main.tsx                   # App entry point
├── tests/
│   └── style-and-responsiveness.spec.ts # Playwright responsive suite (4 device viewports)
├── playwright.config.ts           # Playwright cross-device test matrix configuration
└── vite.config.ts                 # Vite config with base /cotal-fishing-guide/
```

---

## ⚙️ Core Engines & Systems

### 1. Calculation Engine (`src/features/calculator/FishingCalculations.ts`)
- **Exclusivity Logic (`getFishExclusivityInfo`)**:
  - `Season Exclusivity`: Flagged when `fish.seasons.length === 1` (`[Season] Exclusive`).
  - `Weather Exclusivity`: Flagged when fish spawns exclusively in `storm`, `blizzard`, `rain`, or `windy`.
  - `Time Exclusivity`: Flagged when `fish.times.length === 1` (`Night Exclusive`, `Morning Exclusive`, etc.).
  - `Date Range Exclusivity`: Flagged when `spawnSettings[i].isUsingSpecificDate === true`.
- **Catch Rate & Odds Calculator (`calculateFishOdds`)**:
  - Multipliers based on player `fishingLevel` (0–10), equipped `RodTier` (Makeshift $\rightarrow$ Osmium), `BaitType`, and `TackleType`.

### 2. Binary Save File Parser (`src/utils/saveFileParser.ts`)
- **Format**: Unreal Engine 4 `GVAS` binary save files (`.sav`).
- **Parsing Flow**:
  1. Searches for ASCII/UTF-16 property headers (`CaughtFish`, `JournalFish`, `DonatedFish`, `CurrentSeason`, `CurrentDay`).
  2. Parses item struct arrays containing fish IDs (`item_72xxx` / `Fish_xxx`).
  3. Seamlessly updates `userProgress.caught`, `userProgress.donatedMuseum`, and `gameState`.

### 3. Internationalization (i18n) Engine (`src/i18n/`)
- Supports **8 languages**: `en` (English), `pt` (Português), `es` (Español), `de` (Deutsch), `fr` (Français), `zh` (简体中文), `ja` (日本語), `id` (Bahasa Indonesia).
- Multi-token lookup:
  - `t(key)`: Looks up UI string keys.
  - `getFishName(fish)` / `getFishDescription(fish)`: Retrieves localized game text.
  - `getLocationName(locationId)`: Translates map spots and mining caves.
  - `fishingContextHelpers.ts`: Evaluates searches against all languages simultaneously so users can search in English or native language.

### 4. Interactive Multi-Pin Map Engine (`src/features/map/`)
- Coordinates are stored as percentages `x: 0–100%`, `y: 0–100%` relative to `coral_island_game_map.png`.
- **Multi-Spot Structure**: Each location pin contains `spots: MapSpotCoordinate[]`, allowing multiple sub-points (e.g. `River Town Spot 1`, `River Town Spot 2`).
- **Minimap Popover**: Dynamic zooming (`transform: scale(2.8)`) centering on `transformOrigin: ${x}% ${y}%`.

### 5. UI Scaling Engine (`--ui-scale`)
- Controlled via CSS custom property: `:root { --ui-scale: 1.05; }`.
- `html { font-size: calc(16px * var(--ui-scale)); }`.
- Changing `--ui-scale` scales all `rem` values across fonts, paddings, margins, buttons, and sidebars proportionately.

---

## 📏 Code Quality & Strict Architecture Rules

1. **File Size Limit**: No file in `src/` may exceed **300 lines**. Large features must be split into modular components or helper hooks.
2. **Vertical Slicing**: Keep components colocated inside their respective `features/<name>/` directories.
3. **Immutability & Persistence**: State changes in `FishingContext` must persist to `localStorage`.
4. **Automated Testing**: Before committing, run `npx playwright test` to ensure 100% pass rate across Desktop, Laptop, Tablet, and Mobile devices.
