import React, { useState } from 'react';
import { useFishing } from '../../context/FishingContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { FISH_LIST } from '../../data/fishData';
import { isFishSpawnActive } from '../calculator/FishingCalculations';
import { FishingLocationPin, MapSpotCoordinate } from '../../types/fishing';
import { MapPin, Navigation, Check, Sparkles, Filter, Edit3 } from 'lucide-react';
import officialMapImg from '../../assets/images/coral_island_game_map.png';

export const InteractiveMapView: React.FC = () => {
  const { gameState, setSelectedFish, userProgress, customLocations, customMapImage, setActiveTab } = useFishing();
  const { t, getLocationName, getFishName } = useLanguage();
  const [activePin, setActivePin] = useState<FishingLocationPin>(customLocations[0] || {} as FishingLocationPin);
  const [filterActiveOnly, setFilterActiveOnly] = useState(false);

  const mapImageSrc = customMapImage || officialMapImg;

  // Find fish matching this location
  const locationFish = FISH_LIST.filter(fish => {
    const locId = (activePin.id || '').toLowerCase();
    const locName = (activePin.name || '').toLowerCase();

    let matchesLoc = fish.locations.some(l => {
      const lLow = l.toLowerCase();
      return lLow.includes(locId) || locId.includes(lLow) || lLow.includes(locName);
    });

    if (!matchesLoc) {
      if (activePin.id === 'Pond') {
        matchesLoc = fish.waterTypes.pond;
      } else if (activePin.id === 'Rice Field') {
        matchesLoc = fish.locations.some(l => l.toLowerCase().includes('rice')) || fish.waterTypes.pond;
      } else if (activePin.id === 'Lake Temple') {
        matchesLoc = fish.waterTypes.lake;
      } else if (activePin.category === 'Freshwater') {
        matchesLoc = fish.waterTypes.river;
      } else if (activePin.category === 'Ocean') {
        matchesLoc = fish.waterTypes.ocean;
      } else if (activePin.category === 'Cave') {
        matchesLoc = fish.waterTypes.cave;
      }
    }

    if (!matchesLoc) return false;

    if (filterActiveOnly) {
      return isFishSpawnActive(
        fish,
        gameState.season,
        gameState.day,
        gameState.timeOfDay,
        gameState.weather,
        gameState.equippedBait
      );
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Map Interactive Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left 2 Cols: Official Coral Island Map */}
        <div className="lg:col-span-2 glass-panel p-4 sm:p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Navigation className="w-5 h-5 text-amber-400" />
                <span>{t('map_main_title')}</span>
              </h2>
              <p className="text-xs text-neutral-300">
                Click any marker on the island to inspect species swimming in that water zone.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs bg-black/50 border border-amber-400/40 px-3 py-1 rounded-xl text-amber-400 font-extrabold shadow-sm">
                📍 {getLocationName(activePin.name)}
              </span>
              <button
                onClick={() => setActiveTab('backoffice')}
                className="btn-pill btn-pill-inactive flex items-center gap-1 text-xs py-1"
                title="Open Map Editor & Back Office"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('map_edit_pins')}</span>
              </button>
            </div>
          </div>

          {/* Map Visual Stage */}
          <div className="relative w-full aspect-[1000/780] rounded-2xl border-2 border-teal-500/30 overflow-hidden shadow-2xl bg-[#718096] group select-none">
            {/* In-Game Official Map Artwork */}
            <img
              src={mapImageSrc}
              alt="Starlet Island Official Game Map"
              className="w-full h-full object-contain rounded-2xl"
            />

            {/* Interactive Multi-Location Pins */}
            {customLocations.map(loc => {
              const isSelected = activePin.id === loc.id;
              
              let pinBg = 'bg-emerald-500';
              if (loc.category === 'Ocean') pinBg = 'bg-blue-500';
              else if (loc.category === 'Cave') pinBg = 'bg-purple-600';
              else if (loc.category === 'Special') pinBg = 'bg-amber-500';

              const spots: MapSpotCoordinate[] = loc.spots && loc.spots.length > 0
                ? loc.spots
                : [{ id: 'primary', x: loc.x, y: loc.y, label: loc.name }];

              return spots.map((spot, sIdx) => (
                <button
                  key={`${loc.id}-${spot.id}-${sIdx}`}
                  onClick={() => setActivePin(loc)}
                  aria-label={`${loc.name} - ${spot.label || `Spot ${sIdx + 1}`}`}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full p-2 transition-all duration-200 cursor-pointer shadow-lg group ${
                    isSelected
                      ? 'bg-amber-400 text-black scale-125 z-30 ring-4 ring-amber-300 shadow-amber-500/80'
                      : `${pinBg} text-white hover:scale-115 hover:z-20 border border-white/40`
                  }`}
                  style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                >
                  <MapPin className={`w-4 h-4 ${isSelected ? 'stroke-[2.5]' : ''}`} />

                  {/* Tooltip on Hover */}
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-black/95 text-white text-[11px] font-black px-2.5 py-1 rounded-lg whitespace-nowrap border border-white/20 shadow-xl pointer-events-none z-50">
                    {getLocationName(loc.name)} {spot.label ? `(${spot.label})` : ''}
                  </span>
                </button>
              ));
            })}
          </div>

          {/* Map Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-300 pt-1 border-t border-white/10">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5 font-semibold">
                <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white/30" /> Freshwater River
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <span className="w-3 h-3 rounded-full bg-blue-500 border border-white/30" /> Ocean Coast / Piers
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <span className="w-3 h-3 rounded-full bg-purple-600 border border-white/30" /> Cave Mines Water
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <span className="w-3 h-3 rounded-full bg-amber-500 border border-white/30" /> Savannah / Forest
              </span>
            </div>
            <span className="text-[11px] text-neutral-400">
              {customLocations.reduce((acc, l) => acc + (l.spots?.length || 1), 0)} Fishing Pins Across {customLocations.length} Zones
            </span>
          </div>
        </div>

        {/* Right 1 Col: Selected Location Details & Fish List */}
        <div className="glass-panel p-5 shadow-xl space-y-4">
          <div className="border-b border-white/10 pb-3">
            <span className="text-[10px] uppercase font-black tracking-wider text-amber-400 block">
              {activePin.category} Zone ({activePin.spots?.length || 1} Spots on Map)
            </span>
            <h3 className="text-xl font-black text-white mt-0.5">{getLocationName(activePin.name)}</h3>
            <p className="text-xs text-neutral-300 mt-1.5 leading-relaxed">{activePin.description}</p>
          </div>

          {/* Filter Toggle for Active Right Now */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-neutral-200">
              Catchable Species ({locationFish.length})
            </span>
            <button
              onClick={() => setFilterActiveOnly(!filterActiveOnly)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                filterActiveOnly
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-black/40 text-neutral-400 hover:text-white border border-white/10'
              }`}
            >
              <Filter className="w-3 h-3" />
              <span>{filterActiveOnly ? t('badge_active_now') : t('rarity_all')}</span>
            </button>
          </div>

          {/* List of Fish for this location */}
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {locationFish.map(fish => {
              const isCaught = !!userProgress.caught[fish.id];
              const isOffered = !!userProgress.offeredTemple[fish.id];
              const isActive = isFishSpawnActive(
                fish,
                gameState.season,
                gameState.day,
                gameState.timeOfDay,
                gameState.weather,
                gameState.equippedBait
              );

              return (
                <div
                  key={fish.id}
                  onClick={() => setSelectedFish(fish)}
                  className="bg-black/40 hover:bg-black/60 p-2.5 rounded-xl border border-white/10 flex items-center justify-between cursor-pointer transition-all text-xs group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg select-none">
                      {fish.rarity === 'Legendary' ? '👑' : fish.size === 'Large' ? '🦈' : '🐟'}
                    </span>
                    <div>
                      <strong className="text-white group-hover:text-amber-400 block font-bold text-xs">
                        {getFishName(fish)}
                      </strong>
                      <span className="text-[10px] text-neutral-400">
                        {fish.seasons.map(s => t(`season_${s}` as any, s)).join(', ')} • {fish.sellPrice}g
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" title="Active Now!" />
                    )}
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded badge-rarity-${fish.rarity}`}>
                      {t(`rarity_${fish.rarity.toLowerCase()}` as any, fish.rarity)}
                    </span>
                    {isCaught && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    {isOffered && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
