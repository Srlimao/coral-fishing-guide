import React from 'react';
import { useSaveEditor } from '../context/SaveEditorContext';
import { SaveDropzone } from './SaveDropzone';
import { SaveExportBar } from './SaveExportBar';
import { PlayerStatsModule } from '../modules/player/PlayerStatsModule';
import { InventoryGridModule } from '../modules/inventory/InventoryGridModule';
import { MuseumAltarsModule } from '../modules/museum-altars/MuseumAltarsModule';
import { NpcRelationshipsModule } from '../modules/npcs/NpcRelationshipsModule';
import { FarmWorldModule } from '../modules/farm-world/FarmWorldModule';
import { CalendarWorldModule } from '../modules/calendar-world/CalendarWorldModule';
import { MultiplayerCabinModule } from '../modules/multiplayer/MultiplayerCabinModule';
import { SaveEditorSubsystemTab } from '../types/saveEditor';
import {
  User,
  Package,
  Landmark,
  Users,
  Sprout,
  Calendar,
  Home,
  FolderOpen
} from 'lucide-react';

export const SaveEditorWorkbench: React.FC = () => {
  const { hasFile, activeSubsystem, setActiveSubsystem, loadFile } = useSaveEditor();

  if (!hasFile) {
    return <SaveDropzone />;
  }

  interface SubsystemTabItem {
    id: SaveEditorSubsystemTab;
    label: string;
    icon: React.ElementType;
  }

  const tabs: SubsystemTabItem[] = [
    { id: 'player', label: 'Player & Stats', icon: User },
    { id: 'inventory', label: 'Backpack & Spawner', icon: Package },
    { id: 'museum-altars', label: 'Museum & Altars', icon: Landmark },
    { id: 'npcs', label: 'NPCs & Romance', icon: Users },
    { id: 'farm-grid', label: 'Farm, Crops & Animals', icon: Sprout },
    { id: 'calendar-weather', label: 'Calendar & Weather', icon: Calendar },
    { id: 'multiplayer', label: 'Multiplayer Cabins', icon: Home }
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Top Subsystem Navigation Bar */}
      <div className="bg-black/30 p-2 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5 overflow-x-auto">
          {tabs.map(tab => {
            const isActive = activeSubsystem === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubsystem(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-amber-400 text-neutral-950 shadow-md font-extrabold'
                    : 'text-[#c4b5a0] hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Load Another Save Button */}
        <label className="cg-pill text-xs py-1.5 px-3 text-[#c4b5a0] hover:text-white cursor-pointer inline-flex items-center gap-1.5">
          <FolderOpen className="w-3.5 h-3.5" />
          <span>Open Another .sav</span>
          <input
            type="file"
            accept=".sav"
            onChange={(e) => e.target.files && e.target.files[0] && loadFile(e.target.files[0])}
            className="hidden"
          />
        </label>
      </div>

      {/* Center Canvas: Active Subsystem Module */}
      <div className="bg-[#182228]/80 backdrop-blur-md border border-white/10 p-5 sm:p-7 rounded-3xl shadow-xl min-h-[500px]">
        {activeSubsystem === 'player' && <PlayerStatsModule />}
        {activeSubsystem === 'inventory' && <InventoryGridModule />}
        {activeSubsystem === 'museum-altars' && <MuseumAltarsModule />}
        {activeSubsystem === 'npcs' && <NpcRelationshipsModule />}
        {activeSubsystem === 'farm-grid' && <FarmWorldModule />}
        {activeSubsystem === 'calendar-weather' && <CalendarWorldModule />}
        {activeSubsystem === 'multiplayer' && <MultiplayerCabinModule />}
      </div>

      {/* Floating Bottom Export Bar */}
      <SaveExportBar />
    </div>
  );
};
