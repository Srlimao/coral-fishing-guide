import React from 'react';
import { FishingLocationPin, MapSpotCoordinate } from '../../types/fishing';
import { MapPin } from 'lucide-react';
import officialMapImg from '../../assets/images/coral_island_game_map.png';

interface LocationMapHoverPopoverProps {
  locations: string[];
  customLocations: FishingLocationPin[];
  customMapImage?: string | null;
}

export const LocationMapHoverPopover: React.FC<LocationMapHoverPopoverProps> = ({
  locations,
  customLocations,
  customMapImage
}) => {
  const mapSrc = customMapImage || officialMapImg;

  // Find matching location objects from customLocations
  const matchedLocations = customLocations.filter(loc =>
    locations.some(l => {
      const lLow = l.toLowerCase();
      const idLow = loc.id.toLowerCase();
      const nameLow = loc.name.toLowerCase();
      return lLow.includes(idLow) || idLow.includes(lLow) || lLow.includes(nameLow);
    })
  );

  // If no direct matches, fallback to the first matching location or primary
  const displayLocations = matchedLocations.length > 0
    ? matchedLocations.slice(0, 3) // Show up to 3 location minimaps
    : customLocations.slice(0, 1);

  return (
    <div className="absolute bottom-full left-0 mb-2 z-50 pointer-events-none animate-fade-in">
      <div className="bg-[#181d20]/95 backdrop-blur-md p-2.5 rounded-2xl border-2 border-amber-400/50 shadow-2xl space-y-2 min-w-[200px] max-w-[280px]">
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1.5 px-0.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-amber-400" />
            <span>Map Locations ({displayLocations.length})</span>
          </span>
          <span className="text-[9px] text-neutral-400">Mini-Map View</span>
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
                  <span className="text-[9px] font-semibold text-neutral-400">{loc.category}</span>
                </div>

                {/* Zoomed-in Minimap Viewport */}
                <div className="relative w-full h-24 rounded-xl overflow-hidden border border-white/20 shadow-inner bg-[#718096]">
                  <img
                    src={mapSrc}
                    alt={loc.name}
                    className="w-full h-full object-cover select-none"
                    style={{
                      transform: 'scale(2.8)',
                      transformOrigin: `${primarySpot.x}% ${primarySpot.y}%`
                    }}
                  />

                  {/* Centered Pulsing Pin Indicator */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 border border-white"></span>
                    </span>
                    <span className="bg-black/90 text-white text-[8px] font-extrabold px-1.5 py-0.2 rounded shadow-md border border-white/20 whitespace-nowrap mt-0.5">
                      {primarySpot.label || loc.name}
                    </span>
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
