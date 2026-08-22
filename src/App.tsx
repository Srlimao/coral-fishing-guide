import React from 'react';
import { FishingProvider, useFishing } from './context/FishingContext';
import { LiveSyncProvider } from './features/save-import/LiveSyncContext';
import { AppHeader } from './features/header/AppHeader';
import { TimeWeatherBar } from './features/time-weather/TimeWeatherBar';
import { GearSelector } from './features/gear/GearSelector';
import { FishListView } from './features/fish-list/FishListView';
import { SeasonalCalendarView } from './features/calendar/SeasonalCalendarView';
import { InteractiveMapView } from './features/map/InteractiveMapView';
import { MapEditorBackofficeView } from './features/map/MapEditorBackofficeView';
import { OfferingsTrackerView } from './features/bundles/OfferingsTrackerView';
import { FishingStatsView } from './features/stats/FishingStatsView';
import { FishDetailModal } from './features/fish-list/FishDetailModal';
import { Heart } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, selectedFish, setSelectedFish } = useFishing();

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Top Header */}
      <AppHeader />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6 flex-1">
        {/* Top Controls only for Non-Catalog and Non-Backoffice tabs */}
        {activeTab !== 'catalog' && activeTab !== 'backoffice' && (
          <div className="space-y-4">
            <TimeWeatherBar />
            {activeTab === 'map' && <GearSelector />}
          </div>
        )}

        {/* Dynamic View Tab */}
        {activeTab === 'catalog' && <FishListView />}
        {activeTab === 'calendar' && <SeasonalCalendarView />}
        {activeTab === 'map' && <InteractiveMapView />}
        {activeTab === 'backoffice' && <MapEditorBackofficeView />}
        {activeTab === 'bundles' && <OfferingsTrackerView />}
        {activeTab === 'stats' && <FishingStatsView />}
      </main>

      {/* Selected Fish Modal */}
      {selectedFish && (
        <FishDetailModal
          fish={selectedFish}
          onClose={() => setSelectedFish(null)}
        />
      )}

      {/* Footer styled like Coral Guide */}
      <footer className="glass-header mt-12 py-6 px-4 text-center text-xs text-neutral-400 border-t border-white/10 space-y-2">
        <div className="flex items-center justify-center gap-1.5 text-neutral-300">
          <span>Made with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          <span>for Coral Island Townies</span>
        </div>
        <p className="text-[11px] text-neutral-400">
          Coral Island is developed by Stairway Games. Game data mined & synchronized with Live v1.3+ releases.
        </p>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <FishingProvider>
      <LiveSyncProvider>
        <MainContent />
      </LiveSyncProvider>
    </FishingProvider>
  );
}

export default App;
