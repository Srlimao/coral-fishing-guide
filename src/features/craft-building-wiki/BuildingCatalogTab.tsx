import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { BuildingInfo, BuildingTier } from './types';
import { BuildingCard } from './BuildingCard';
import { Home } from 'lucide-react';

interface BuildingCatalogTabProps {
  buildings: BuildingInfo[];
  onSelectBuilding: (building: BuildingInfo, activeTierIndex: number) => void;
  onAddToPlanner: (building: BuildingInfo, tier: BuildingTier, tierIndex: number) => void;
  plannedBuildingKeys: Set<string>;
}

export const BuildingCatalogTab: React.FC<BuildingCatalogTabProps> = ({
  buildings,
  onSelectBuilding,
  onAddToPlanner,
  plannedBuildingKeys
}) => {
  const { t } = useLanguage();

  if (buildings.length === 0) {
    return (
      <div className="bg-[#182228]/80 border border-white/10 rounded-2xl p-12 text-center space-y-3">
        <div className="text-4xl">🏡</div>
        <h3 className="text-base font-bold text-white">{t('wiki_empty_buildings')}</h3>
        <p className="text-xs text-[#c4b5a0] max-w-md mx-auto">
          No farm buildings or structures matched your active search query and filter criteria. Try clearing search or selecting "All Categories".
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Total Items Info Bar */}
      <div className="flex items-center justify-between text-xs text-[#c4b5a0] px-1">
        <div className="flex items-center gap-1.5 font-bold">
          <Home className="w-4 h-4 text-amber-400" />
          <span>{t('wiki_showing_count')} <strong className="text-white">{buildings.length}</strong> {t('wiki_structures_subtitle')}</span>
        </div>
        <span>Select upgrade levels to preview costs & materials</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {buildings.map(building => (
          <BuildingCard
            key={building.id}
            building={building}
            onSelect={onSelectBuilding}
            onAddToPlanner={onAddToPlanner}
            isPlanned={building.tiers.some((_, idx) => plannedBuildingKeys.has(`${building.id}_${idx}`))}
          />
        ))}
      </div>
    </div>
  );
};
