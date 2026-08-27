import React, { useState } from 'react';
import { FishingLocationPin, MapSpotCoordinate } from '../../types/fishing';
import { useLanguage } from '../../i18n/LanguageContext';
import { MapPin, Navigation, Compass, ZoomIn, ZoomOut } from 'lucide-react';
import officialMapImg from '../../assets/images/coral_island_game_map.png';

interface FishDetailMapLocationProps {
  locations: string[];
  customLocations: FishingLocationPin[];
  customMapImage?: string | null;
}

const LOCATION_ALIASES: Record<string, string[]> = {
  'Mine': ['mine', 'mining', 'cave', 'cavern', 'fire cave', 'water cave', 'wind cave', 'earth cave', 'lava', 'mina', 'caverna', 'mina de'],
  'Lake Temple': ['lake temple', 'lake', 'temple lake', 'lago do templo', 'lago da deusa', 'lago'],
  'River Forest': ['river forest', 'forest river', 'rio da floresta', 'floresta alta'],
  'River Farm': ['river farm', 'farm river', 'rio da fazenda'],
  'River Town': ['river town', 'town river', 'rio da cidade'],
  'Pond': ['pond', 'farm pond', 'forest pond', 'lagoa da fazenda', 'lagoa'],
  'Rice Field': ['rice field', 'rice terraces', 'arrozal', 'campo de arroz'],
  'Estuary': ['estuary', 'estuário', 'estuario'],
  'Ocean Dock': ['ocean dock', 'dock', 'docks', 'pier', 'porto', 'cais', 'doca'],
  'Ocean Beach': ['ocean beach', 'beach', 'praia', 'costa', 'ocean', 'oceano'],
  'Lookout': ['lookout', 'mirante', 'farol'],
  'Savannah': ['savannah', 'savana', 'savannah stream', 'savannah waterfall'],
  'Deep Forest': ['deep forest', 'floresta profunda', 'enchanted forest']
};

export const FishDetailMapLocation: React.FC<FishDetailMapLocationProps> = ({
  locations,
  customLocations,
  customMapImage
}) => {
  const { getLocationName } = useLanguage();
  const mapSrc = customMapImage || officialMapImg;

  // Accurately find matching location pins by ID and semantic aliases
  const matchedLocations = customLocations.filter(loc => {
    const locIdLow = loc.id.toLowerCase();
    const locNameLow = loc.name.toLowerCase();
    const aliases = LOCATION_ALIASES[loc.id] || [locIdLow, locNameLow];

    return locations.some(rawLoc => {
      const lLow = rawLoc.toLowerCase().trim();
      if (lLow === locIdLow || lLow === locNameLow || lLow.includes(locNameLow)) {
        return true;
      }
      return aliases.some(alias => lLow.includes(alias) || alias.includes(lLow));
    });
  });

  const [selectedLocIndex, setSelectedLocIndex] = useState(0);
  const [selectedSpotIndex, setSelectedSpotIndex] = useState(0);
  const [isFullMap, setIsFullMap] = useState(false);

  const activeLoc = matchedLocations[selectedLocIndex] || matchedLocations[0];

  const allSpots: MapSpotCoordinate[] = activeLoc
    ? (activeLoc.spots && activeLoc.spots.length > 0
        ? activeLoc.spots
        : [{ id: 'main', x: activeLoc.x, y: activeLoc.y, label: activeLoc.name }])
    : [];

  const activeSpot = allSpots[selectedSpotIndex] || allSpots[0];

  // Mathematical camera viewport scaling & translation
  const scale = isFullMap ? 1.0 : 2.5;
  const translateX = isFullMap || !activeSpot ? 0 : 50 - activeSpot.x * scale;
  const translateY = isFullMap || !activeSpot ? 0 : 50 - activeSpot.y * scale;

  return (
    <div className="bg-[#182228] text-white p-3.5 sm:p-4 rounded-2xl border border-white/10 shadow-lg space-y-3">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-xs sm:text-sm text-white">Spawn Map Location</span>
          {matchedLocations.length > 0 && (
            <span className="bg-amber-400/20 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-400/30">
              {matchedLocations.length} {matchedLocations.length === 1 ? 'Area' : 'Areas'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {activeLoc && (
            <span className="text-[11px] font-semibold text-[#c4b5a0] flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>{getLocationName(activeLoc.name)}</span>
            </span>
          )}

          <button
            onClick={() => setIsFullMap(!isFullMap)}
            className="cg-pill px-2 py-1 text-[10px] font-bold flex items-center gap-1 text-[#c4b5a0] hover:text-white"
            title={isFullMap ? 'Zoom to Spot' : 'View Full Map'}
          >
            {isFullMap ? <ZoomIn className="w-3 h-3 text-amber-400" /> : <ZoomOut className="w-3 h-3 text-amber-400" />}
            <span>{isFullMap ? 'Zoom In' : 'Full Map'}</span>
          </button>
        </div>
      </div>

      {/* Multiple Location Tabs */}
      {matchedLocations.length > 1 && (
        <div className="flex flex-wrap gap-1.5">
          {matchedLocations.map((loc, idx) => (
            <button
              key={loc.id}
              onClick={() => {
                setSelectedLocIndex(idx);
                setSelectedSpotIndex(0);
              }}
              className={`cg-pill px-2.5 py-1 text-[11px] font-bold ${
                idx === selectedLocIndex ? 'cg-pill-active' : ''
              }`}
            >
              <Navigation className="w-3 h-3" />
              <span>{getLocationName(loc.name)}</span>
            </button>
          ))}
        </div>
      )}

      {/* Multiple Spots Switcher (for locations with multiple fishing spots) */}
      {allSpots.length > 1 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-[10px] text-[#c4b5a0] font-bold">Fishing Spots:</span>
          {allSpots.map((spot, sIdx) => (
            <button
              key={spot.id}
              onClick={() => setSelectedSpotIndex(sIdx)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold border transition-all ${
                sIdx === selectedSpotIndex
                  ? 'bg-amber-400 text-black border-amber-300 shadow-xs'
                  : 'bg-white/5 text-[#c4b5a0] border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              📍 {spot.label || `Spot ${sIdx + 1}`}
            </button>
          ))}
        </div>
      )}

      {/* Map Viewport Area */}
      {activeSpot ? (
        <div className="relative w-full aspect-[1000/620] max-h-56 rounded-xl overflow-hidden border border-white/20 shadow-inner bg-[#4a5568] select-none">
          {/* Inner Scaled & Translated Map Canvas Layer */}
          <div
            className="absolute top-0 left-0 w-full aspect-[1000/780] transition-transform duration-500 origin-top-left"
            style={{
              transform: `translate(${translateX}%, ${translateY}%) scale(${scale})`
            }}
          >
            {/* Map Artwork */}
            <img
              src={mapSrc}
              alt={activeLoc.name}
              className="w-full h-full object-contain block select-none pointer-events-none"
            />

            {/* Exactly Anchored Spots on the Map Artwork */}
            {allSpots.map((spot, sIdx) => {
              const isCurrent = spot.x === activeSpot.x && spot.y === activeSpot.y;
              return (
                <div
                  key={`${spot.id}-${sIdx}`}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none"
                  style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                >
                  <span className="relative flex h-3.5 w-3.5 sm:h-4 sm:w-4">
                    {isCurrent && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    )}
                    <span
                      className={`relative inline-flex rounded-full h-full w-full border-2 border-white shadow-lg ${
                        isCurrent ? 'bg-amber-400 ring-2 ring-amber-300' : 'bg-emerald-500 opacity-90'
                      }`}
                    />
                  </span>
                  <span className="bg-[#13181b]/95 text-white text-[8px] sm:text-[9px] font-extrabold px-1.5 py-0.2 rounded shadow-md border border-white/30 whitespace-nowrap mt-0.5">
                    {spot.label || getLocationName(activeLoc.name)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Map Corner Badge */}
          <div className="absolute bottom-2 left-2 z-20 bg-black/75 backdrop-blur-xs text-white/90 text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/15">
            {isFullMap ? 'Starlet Island Full Map' : 'Zoomed Spot Viewport'}
          </div>
        </div>
      ) : (
        /* Fallback for general water types without specific point */
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center space-y-1.5">
          <MapPin className="w-6 h-6 text-amber-400 mx-auto" />
          <p className="text-xs font-bold text-white">
            {locations.map(loc => getLocationName(loc)).join(', ') || 'Any Waters'}
          </p>
          <p className="text-[11px] text-neutral-400">
            This fish can be found across all general waters and shorelines of Starlet Island.
          </p>
        </div>
      )}

      {/* Location Area Tags */}
      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#c4b5a0]">Locations:</span>
        {locations.map(loc => (
          <span
            key={loc}
            className="bg-white/10 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/10"
          >
            {getLocationName(loc)}
          </span>
        ))}
      </div>
    </div>
  );
};
