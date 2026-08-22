import React from 'react';
import { Season, Weather, TimeOfDay, RodTier } from '../../types/fishing';
import { RODS_DATA } from '../../data/gearData';
import { ChevronLeft, ChevronRight, Check, Sparkles, Landmark } from 'lucide-react';
import sunnyIcon from '../../assets/icons/weather/Sunny.png';
import rainIcon from '../../assets/icons/weather/Rain.png';
import stormIcon from '../../assets/icons/weather/Storm.png';
import snowIcon from '../../assets/icons/weather/Snow.png';
import windyIcon from '../../assets/icons/weather/Windy.png';

interface DateWeatherProps {
  season: Season;
  day: number;
  timeOfDay: TimeOfDay;
  weather: Weather;
  setSeason: (s: Season) => void;
  setDay: (d: number) => void;
  setTimeOfDay: (t: TimeOfDay) => void;
  setWeather: (w: Weather) => void;
}

export const DateWeatherFilterSection: React.FC<DateWeatherProps> = ({
  season,
  day,
  timeOfDay,
  weather,
  setSeason,
  setDay,
  setTimeOfDay,
  setWeather
}) => {
  const seasons: Array<{ id: Season; label: string; icon: string }> = [
    { id: 'spring', label: 'Spring', icon: '🌸' },
    { id: 'summer', label: 'Summer', icon: '☀️' },
    { id: 'fall', label: 'Fall', icon: '🍂' },
    { id: 'winter', label: 'Winter', icon: '❄️' }
  ];

  const timeSlots: Array<{ id: TimeOfDay; label: string; icon: string }> = [
    { id: 'morning', label: 'Morning', icon: '🌅' },
    { id: 'afternoon', label: 'Afternoon', icon: '☀️' },
    { id: 'evening', label: 'Evening', icon: '🌇' },
    { id: 'night', label: 'Night', icon: '🌙' }
  ];

  const weathers: Array<{ id: Weather; label: string; iconImg: string }> = [
    { id: 'sunny', label: 'Sunny', iconImg: sunnyIcon },
    { id: 'rain', label: 'Rain', iconImg: rainIcon },
    { id: 'storm', label: 'Storm', iconImg: stormIcon },
    { id: 'snow', label: 'Snow', iconImg: snowIcon },
    { id: 'blizzard', label: 'Blizzard', iconImg: snowIcon },
    { id: 'windy', label: 'Windy', iconImg: windyIcon }
  ];

  return (
    <>
      {/* Season & Day Stepper */}
      <div className="border-t border-white/10 pt-3 space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#c4b5a0] block">
          In-Game Season & Date
        </span>
        <div className="grid grid-cols-4 gap-1.5">
          {seasons.map(s => (
            <button
              key={s.id}
              onClick={() => setSeason(s.id)}
              aria-label={s.label}
              className={`cg-pill py-1.5 px-1 text-[11px] flex flex-col items-center justify-center gap-0.5 ${
                season === s.id ? 'cg-pill-active' : ''
              }`}
            >
              <span className="text-xs">{s.icon}</span>
              <span className="text-[9px]">{s.label}</span>
            </button>
          ))}
        </div>

        {/* Day Stepper Capsule */}
        <div className="flex items-center justify-between cg-pill px-2.5 py-1 text-[#c4b5a0]">
          <button
            onClick={() => setDay(Math.max(1, day - 1))}
            disabled={day <= 1}
            aria-label="Previous Day"
            className="p-1 hover:text-white disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="font-bold text-white text-[11px]">
            Day {day} / 28
          </span>
          <button
            onClick={() => setDay(Math.min(28, day + 1))}
            disabled={day >= 28}
            aria-label="Next Day"
            className="p-1 hover:text-white disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Time of Day */}
      <div className="border-t border-white/10 pt-3 space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#c4b5a0] block">
          Time of Day
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          {timeSlots.map(t => (
            <button
              key={t.id}
              onClick={() => setTimeOfDay(t.id)}
              aria-label={t.label}
              className={`cg-pill py-1.5 px-2 text-[11px] ${
                timeOfDay === t.id ? 'cg-pill-active' : ''
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Weather */}
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#c4b5a0] block mt-2">
          Weather
        </span>
        <div className="grid grid-cols-3 gap-1.5">
          {weathers.map(w => (
            <button
              key={w.id}
              onClick={() => setWeather(w.id)}
              aria-label={w.label}
              title={w.label}
              className={`cg-pill py-1.5 px-1 text-[10px] ${
                weather === w.id ? 'cg-pill-active' : ''
              }`}
            >
              <img src={w.iconImg} alt={w.label} className="w-3.5 h-3.5 object-contain" />
              <span className="truncate">{w.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

interface GearProps {
  fishingLevel: number;
  equippedRod: RodTier;
  onLevelChange: (lvl: number) => void;
  onRodChange: (rod: RodTier) => void;
}

export const GearFilterSection: React.FC<GearProps> = ({
  fishingLevel,
  equippedRod,
  onLevelChange,
  onRodChange
}) => (
  <div className="border-t border-white/10 pt-3 space-y-2">
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-bold uppercase tracking-wider text-[#c4b5a0]">
        Fishing Level
      </span>
      <span className="font-bold text-white text-xs">Lvl {fishingLevel}</span>
    </div>
    <input
      type="range"
      min="0"
      max="10"
      value={fishingLevel}
      onChange={(e) => onLevelChange(parseInt(e.target.value, 10))}
      className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
    />

    <span className="text-[10px] font-bold uppercase tracking-wider text-[#c4b5a0] block pt-1">
      Equipped Rod
    </span>
    <div className="grid grid-cols-2 gap-1.5">
      {Object.values(RODS_DATA).map(rod => (
        <button
          key={rod.id}
          onClick={() => onRodChange(rod.id as RodTier)}
          aria-label={rod.name}
          className={`cg-pill py-1.5 px-1.5 text-[10px] text-center truncate ${
            equippedRod === rod.id ? 'cg-pill-active' : ''
          }`}
        >
          {rod.name.split(' ')[0]}
        </button>
      ))}
    </div>
  </div>
);

interface StatusProps {
  onlyUncaught: boolean;
  onlyNeededForOfferings: boolean;
  onlyMissingMuseum: boolean;
  onToggle: (key: string, val: boolean) => void;
}

export const StatusFilterSection: React.FC<StatusProps> = ({
  onlyUncaught,
  onlyNeededForOfferings,
  onlyMissingMuseum,
  onToggle
}) => (
  <div className="border-t border-white/10 pt-3 space-y-1.5">
    <span className="text-[10px] font-bold uppercase tracking-wider text-[#c4b5a0] block">
      Checklists
    </span>
    
    <button
      onClick={() => onToggle('onlyUncaught', !onlyUncaught)}
      className={`cg-pill w-full py-2 px-3 text-[11px] justify-between ${
        onlyUncaught ? 'cg-pill-active' : ''
      }`}
    >
      <div className="flex items-center gap-2">
        <Check className="w-3.5 h-3.5" />
        <span>Uncaught Only</span>
      </div>
      <span className="text-[10px] opacity-80">{onlyUncaught ? '✓' : ''}</span>
    </button>

    <button
      onClick={() => onToggle('onlyNeededForOfferings', !onlyNeededForOfferings)}
      className={`cg-pill w-full py-2 px-3 text-[11px] justify-between ${
        onlyNeededForOfferings ? 'cg-pill-active' : ''
      }`}
    >
      <div className="flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Temple Offerings</span>
      </div>
      <span className="text-[10px] opacity-80">{onlyNeededForOfferings ? '✓' : ''}</span>
    </button>

    <button
      onClick={() => onToggle('onlyMissingMuseum', !onlyMissingMuseum)}
      className={`cg-pill w-full py-2 px-3 text-[11px] justify-between ${
        onlyMissingMuseum ? 'cg-pill-active' : ''
      }`}
    >
      <div className="flex items-center gap-2">
        <Landmark className="w-3.5 h-3.5" />
        <span>Museum Missing</span>
      </div>
      <span className="text-[10px] opacity-80">{onlyMissingMuseum ? '✓' : ''}</span>
    </button>
  </div>
);
