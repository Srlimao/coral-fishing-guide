import React, { useState, useRef } from 'react';
import { useFishing } from '../../context/FishingContext';
import { MapSpotCoordinate } from '../../types/fishing';
import {
  MapPin,
  Trash2,
  Upload,
  RotateCcw,
  Download,
  Crosshair,
  Layers
} from 'lucide-react';
import officialMapImg from '../../assets/images/coral_island_game_map.png';

export const MapEditorBackofficeView: React.FC = () => {
  const {
    customLocations,
    customMapImage,
    setCustomMapImage,
    addSpotToLocation,
    removeSpotFromLocation,
    resetLocationsToDefault
  } = useFishing();

  const [selectedLocationId, setSelectedLocationId] = useState<string>(customLocations[0]?.id || 'River Farm');
  const [newSpotLabel, setNewSpotLabel] = useState<string>('');
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [jsonModalOpen, setJsonModalOpen] = useState(false);
  const [jsonText, setJsonText] = useState('');

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeLocation = customLocations.find(l => l.id === selectedLocationId) || customLocations[0];
  const mapImageSrc = customMapImage || officialMapImg;

  // Handle clicking on the map canvas to place a new spot for active location
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    const label = newSpotLabel.trim() || `${activeLocation.name} Spot ${(activeLocation.spots?.length || 0) + 1}`;
    addSpotToLocation(activeLocation.id, { x, y, label });
    setNewSpotLabel('');
  };

  // Track cursor coordinates for precision alignment
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setCursorPos({ x, y });
  };

  // Handle custom map image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomMapImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExportJson = () => {
    setJsonText(JSON.stringify(customLocations, null, 2));
    setJsonModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Back Office Header */}
      <div className="glass-panel p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-black px-2 py-0.5 rounded text-[10px] font-black uppercase">
              Back Office
            </span>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <span>Map Pin & Fishing Spot Manager</span>
            </h2>
          </div>
          <p className="text-xs text-neutral-300 mt-1">
            Click anywhere on the map to add multiple fishing spots for the selected location zone.
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-pill btn-pill-inactive flex items-center gap-1.5"
            title="Upload custom map JPG/PNG"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>Upload Map Image</span>
          </button>

          {customMapImage && (
            <button
              onClick={() => setCustomMapImage(null)}
              className="btn-pill btn-pill-inactive text-neutral-300"
              title="Reset to default Coral Island game map"
            >
              Default Map
            </button>
          )}

          <button
            onClick={handleExportJson}
            className="btn-pill btn-pill-inactive flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset all map pins and locations back to factory defaults?')) {
                resetLocationsToDefault();
              }
            }}
            className="btn-pill btn-pill-inactive text-rose-300 hover:text-rose-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Pins</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left 2 Cols: Interactive Map Canvas with Click-to-Pin */}
        <div className="lg:col-span-2 glass-panel p-4 sm:p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-white flex items-center gap-1.5">
              <Crosshair className="w-4 h-4 text-amber-400" />
              <span>Click Map to Place Spot for: <strong className="text-amber-300">{activeLocation.name}</strong></span>
            </span>
            {cursorPos && (
              <span className="bg-black/50 border border-white/10 px-2.5 py-0.5 rounded font-mono text-[11px] text-amber-400">
                X: {cursorPos.x}%, Y: {cursorPos.y}%
              </span>
            )}
          </div>

          {/* Interactive Map Visual Stage */}
          <div
            ref={mapContainerRef}
            onClick={handleMapClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setCursorPos(null)}
            className="relative w-full aspect-[1000/780] rounded-2xl border-2 border-amber-500/40 overflow-hidden shadow-2xl bg-[#718096] cursor-crosshair select-none group"
          >
            <img
              src={mapImageSrc}
              alt="Back Office Official Map Canvas"
              className="w-full h-full object-contain rounded-2xl pointer-events-none"
            />

            {/* Render all spots from all locations */}
            {customLocations.map(loc => {
              const isActive = loc.id === activeLocation.id;
              const allSpots: MapSpotCoordinate[] = loc.spots && loc.spots.length > 0
                ? loc.spots
                : [{ id: 'primary', x: loc.x, y: loc.y, label: 'Primary Spot' }];

              let colorClass = 'bg-emerald-500';
              if (loc.category === 'Ocean') colorClass = 'bg-blue-500';
              else if (loc.category === 'Cave') colorClass = 'bg-purple-600';
              else if (loc.category === 'Special') colorClass = 'bg-orange-500';

              return allSpots.map((spot, idx) => (
                <div
                  key={`${loc.id}-${spot.id}-${idx}`}
                  style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-full shadow-lg transition-transform pointer-events-none ${
                    isActive
                      ? 'bg-amber-400 text-black scale-125 ring-4 ring-amber-300 z-30'
                      : `${colorClass} text-white opacity-70 z-10`
                  }`}
                  title={`${loc.name} - ${spot.label || `Spot ${idx + 1}`}`}
                >
                  <MapPin className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-black/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap border border-white/20">
                    {spot.label || loc.name}
                  </span>
                </div>
              ));
            })}
          </div>

          <p className="text-[11px] text-neutral-400 italic">
            💡 Tip: Click anywhere on the map to add a new spot. Each water body (e.g. Farm River or Beach) can have multiple spots along the shoreline.
          </p>
        </div>

        {/* Right 1 Col: Location Selector & Multi-Spots Manager */}
        <div className="glass-panel p-5 shadow-xl space-y-4 text-xs">
          
          {/* Active Location Dropdown */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
              1. Select Water Body to Edit
            </span>
            <select
              value={selectedLocationId}
              onChange={(e) => setSelectedLocationId(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-500"
            >
              {customLocations.map(loc => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} ({loc.category}) - {(loc.spots?.length || 1)} spot(s)
                </option>
              ))}
            </select>
          </div>

          {/* New Spot Custom Label Input */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
              2. Optional Custom Label for Next Click
            </span>
            <input
              type="text"
              value={newSpotLabel}
              onChange={(e) => setNewSpotLabel(e.target.value)}
              placeholder="e.g. North Bridge, Pier End, Waterfall"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Configured Spots List */}
          <div className="border-t border-white/10 pt-3 space-y-2">
            <div className="flex items-center justify-between font-bold text-neutral-200">
              <span>Configured Spots for {activeLocation.name}</span>
              <span className="text-amber-400">{(activeLocation.spots?.length || 0)} spot(s)</span>
            </div>

            <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
              {(activeLocation.spots || []).map((spot, index) => (
                <div
                  key={spot.id}
                  className="bg-black/40 p-2.5 rounded-xl border border-white/5 flex items-center justify-between gap-2 text-neutral-200"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center font-bold text-[10px]">
                      {index + 1}
                    </span>
                    <div>
                      <strong className="block font-bold text-white text-[11px]">
                        {spot.label || `Spot #${index + 1}`}
                      </strong>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        X: {spot.x}%, Y: {spot.y}%
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeSpotFromLocation(activeLocation.id, spot.id)}
                    className="p-1.5 text-neutral-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-all"
                    title="Remove this spot pin"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {(!activeLocation.spots || activeLocation.spots.length === 0) && (
                <p className="text-neutral-500 italic py-4 text-center">
                  No spots configured yet. Click on the map to place a pin!
                </p>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* JSON Export Modal */}
      {jsonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="cg-card p-6 rounded-2xl max-w-xl w-full space-y-4 border border-amber-400/40">
            <h3 className="text-lg font-black text-[#3d2f1a]">Export Locations JSON</h3>
            <textarea
              readOnly
              value={jsonText}
              rows={12}
              className="w-full bg-[#ede5d5] p-3 rounded-xl font-mono text-xs text-[#3d2f1a] border border-[#d1c2ab] focus:outline-none select-all"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setJsonModalOpen(false)}
                className="btn-amber text-xs py-1.5 px-4"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
