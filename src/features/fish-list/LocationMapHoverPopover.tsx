import React from 'react';
import { FishingLocationPin, MapSpotCoordinate } from '../../types/fishing';
import { MapPin } from 'lucide-react';
import officialMapImg from '../../assets/images/coral_island_game_map.png';

interface LocationMapHoverPopoverProps {
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
  'Ocean Beach': ['ocean beach', 'beach', 'praia', 'costa'],
  'Lookout': ['lookout', 'mirante', 'farol'],
  'Savannah': ['savannah', 'savana', 'savannah stream', 'savannah waterfall'],
  'Deep Forest': ['deep forest', 'floresta profunda', 'enchanted forest']
};

export const LocationMapHoverPopover: React.FC<LocationMapHoverPopoverProps> = ({
  locations,
  customLocations,
  customMapImage
}) => {
  const mapSrc = customMapImage || officialMapImg;

  // Accurately find matching location pins by ID and semantic aliases
  const matchedLocations = customLocations.filter(loc => {
    const locIdLow = loc.id.toLowerCase();
    const locNameLow = loc.name.toLowerCase();
    const aliases = LOCATION_ALIASES[loc.id] || [locIdLow, locNameLow];

    return locations.some(rawLoc => {
      const lLow = rawLoc.toLowerCase().trim();
      
      // Direct exact or substring match
      if (lLow === locIdLow || lLow === locNameLow || lLow.includes(locNameLow)) {
        return true;
      }

      // Alias matches
      return aliases.some(alias => lLow.includes(alias) || alias.includes(lLow));
    });
  });

  // If no matching map locations exist, don't show misleading false map coordinates
  if (matchedLocations.length === 0) {
    return null;
  }

  const displayLocations = matchedLocations.slice(0, 2); // Show up to 2 primary spot viewports

  return (
    <div className="absolute bottom-full left-0 mb-2 z-50 pointer-events-none animate-fade-in">
      <div className="bg-[#181d20]/95 backdrop-blur-md p-2.5 rounded-2xl border-2 border-amber-400/50 shadow-2xl space-y-2 min-w-[220px] max-w-[280px]">
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1.5 px-0.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-amber-400" />
            <span>Map Spots ({displayLocations.length})</span>
          </span>
          <span className="text-[9px] text-neutral-400">Mini-Map Preview</span>
        </div>

        <div className="space-y-2">
          {displayLocations.map(loc => {
            const primarySpot: MapSpotCoordinate = loc.spots && loc.spots.length > 0
              ? loc.spots[0]
              : { id: 'main', x: loc.x, y: loc.y, label: loc.name };

            return (
              <div key={loc.id} className="space-y-1">
                <div className="flex items-center justify-between text-[10px] px-1 font-bold text-white">
                  <span className="truncate">{loc.name}</span>
                  <span className="text-[9px] font-semibold text-amber-300/80">{loc.category}</span>
                </div>

                {/* Zoomed-in Minimap Viewport */}
                <div className="relative w-full h-24 rounded-xl overflow-hidden border border-white/20 shadow-inner bg-[#4a5568] select-none">
                  <div
                    className="absolute top-0 left-0 w-full aspect-[1000/780] transition-transform duration-300 origin-top-left"
                    style={{
                      transform: `translate(${50 - primarySpot.x * 2.5}%, ${50 - primarySpot.y * 2.5}%) scale(2.5)`
                    }}
                  >
                    <img
                      src={mapSrc}
                      alt={loc.name}
                      className="w-full h-full object-contain select-none pointer-events-none block"
                    />

                    {/* Anchored Pin Indicator */}
                    <div
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none"
                      style={{ left: `${primarySpot.x}%`, top: `${primarySpot.y}%` }}
                    >
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 border border-white shadow-md"></span>
                      </span>
                      <span className="bg-black/90 text-white text-[8px] font-extrabold px-1.5 py-0.2 rounded shadow-md border border-white/20 whitespace-nowrap mt-0.5">
                        {primarySpot.label || loc.name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
