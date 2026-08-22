import React from 'react';
import { FishingProvider, useFishing } from './context/FishingContext';
import { LanguageProvider } from './i18n/LanguageContext';
import { AppLeftSidebar } from './features/navigation/AppLeftSidebar';
import { FishListRightSidebar } from './features/fish-list/FishListRightSidebar';
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

const MainLayout: React.FC = () => {
  const { activeTab, selectedFish, setSelectedFish } = useFishing();

  return (
    <div className="min-h-screen flex flex-col lg:flex-row w-full max-w-[100vw] overflow-x-hidden">
      
      {/* 1. Left Column: Navigation Sidebar */}
      <AppLeftSidebar />

      {/* 2. Center Column: Main Content Area */}
      <div className="flex-1 flex flex-col justify-between min-w-0 min-h-screen">
        <main className="p-4 sm:p-6 space-y-6 flex-1 w-full max-w-[1800px] mx-auto">
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

        {/* Footer */}
        <footer className="glass-header mt-12 py-5 px-4 text-center text-xs text-neutral-400 border-t border-white/10 space-y-1.5">
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

      {/* 3. Right Column: Filters & Simulation Panel (Shown on Fish Journal Catalog) */}
      {activeTab === 'catalog' && (
        <div className="p-4 sm:p-6 lg:pl-0 flex-shrink-0">
          <FishListRightSidebar />
        </div>
      )}

      {/* Selected Fish Modal */}
      {selectedFish && (
        <FishDetailModal
          fish={selectedFish}
          onClose={() => setSelectedFish(null)}
        />
      )}

    </div>
  );
};

export function App() {
  return (
    <LanguageProvider>
      <FishingProvider>
        <MainLayout />
      </FishingProvider>
    </LanguageProvider>
  );
}

export default App;
