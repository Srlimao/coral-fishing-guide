# 🎣 Coral Island Fishing Guide & Companion

An interactive, live-simulated fishing guide and progress tracker for **Coral Island (v1.3+)**, featuring real-time exclusivity calculations, interactive map spots, 28-day schedule matrix, temple altar bundles, and `.sav` save file imports.

🌐 **Live App**: [https://srlimao.github.io/cotal-fishing-guide/](https://srlimao.github.io/cotal-fishing-guide/)

---

## ✨ Features

- **🎯 Tri-Pane 3-Column Layout**: Collapsible left navigation sidebar, center adaptive catalog (1–3 cards), and collapsible right simulation/filter panel.
- **⚡ Live Game Simulation & Exclusivity**: Real-time Season, Day, Time, Weather, Fishing Level & Rod tier filters with pure exclusivity flags (`Spring Exclusive`, `Storm Exclusive`, etc.).
- **🗺️ Interactive Multi-Spot Map & Back Office**: Exact coordinates for all 13 fishing areas with support for multiple sub-spots and custom coordinate editor.
- **🎮 In-Game Minigame Simulation**: Interactive physics visualizer for fish swimming patterns (Stay, Dart, Dash, Floater, Sinker) with rod tension bar.
- **💾 Save File Importer (.sav)**: Drag & drop your Coral Island save file (`%LOCALAPPDATA%\ProjectCoral\Saved\SaveGames`) to instantly sync caught fish, museum donations, and current season.
- **🌐 8 Languages (i18n)**: English 🇬🇧, Português 🇧🇷, Español 🇪🇸, Deutsch 🇩🇪, Français 🇫🇷, 中文 🇨🇳, 日本語 🇯🇵, and Bahasa Indonesia 🇮🇩.
- **🔍 Global UI Scale Setting**: Responsive scaling slider and presets (85%–130%) for maximum readability on any screen.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + Vanilla Glassmorphism Design System
- **Icons & Visuals**: Lucide React + Official Min-Mined Assets
- **Testing**: Playwright (Cross-device suite for Desktop, Laptop, Tablet, Mobile Phone)

---

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/Srlimao/cotal-fishing-guide.git
cd cotal-fishing-guide

# Install dependencies
npm install

# Start local dev server
npm run dev

# Run Playwright responsive test suite
npx playwright test

# Build production bundle
npm run build
```

---

## 📄 License & Disclaimer

Coral Island is developed by Stairway Games. This is an open-source fan project built for the Coral Island community.
