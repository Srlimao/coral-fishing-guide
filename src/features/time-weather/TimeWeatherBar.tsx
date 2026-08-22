import React from 'react';
import { useFishing } from '../../context/FishingContext';
import { Season, Weather, TimeOfDay } from '../../types/fishing';
import { Flame, ChevronLeft, ChevronRight } from 'lucide-react';
import sunnyIcon from '../../assets/icons/weather/Sunny.png';
import rainIcon from '../../assets/icons/weather/Rain.png';
import stormIcon from '../../assets/icons/weather/Storm.png';
import snowIcon from '../../assets/icons/weather/Snow.png';
import windyIcon from '../../assets/icons/weather/Windy.png';

export const TimeWeatherBar: React.FC = () => {
  const { gameState, setSeason, setDay, setTimeOfDay, setWeather, setGameState } = useFishing();

  const seasons: Array<{ id: Season; label: string; icon: string }> = [
    { id: 'spring', label: 'Spring', icon: '🌸' },
    { id: 'summer', label: 'Summer', icon: '☀️' },
    { id: 'fall', label: 'Fall', icon: '🍂' },
    { id: 'winter', label: 'Winter', icon: '❄️' }
  ];

  const timeSlots: Array<{ id: TimeOfDay; label: string; hours: string; icon: string }> = [
    { id: 'morning', label: 'Morning', hours: '06:00 - 12:00', icon: '🌅' },
    { id: 'afternoon', label: 'Afternoon', hours: '12:00 - 16:00', icon: '☀️' },
    { id: 'evening', label: 'Evening', hours: '16:00 - 20:00', icon: '🌇' },
    { id: 'night', label: 'Night', hours: '20:00 - 02:00', icon: '🌙' }
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
    <div className="glass-panel p-4 sm:p-5 shadow-xl">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        
        {/* Season & Day Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Season Selector */}
          <div className="flex items-center gap-1.5">
            {seasons.map(s => (
              <button
                key={s.id}
                onClick={() => setSeason(s.id)}
                aria-label={s.label}
                title={s.label}
                className={`cg-pill px-3 py-1.5 text-xs font-bold ${
                  gameState.season === s.id ? 'cg-pill-active' : ''
                }`}
              >
                <span>{s.icon}</span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            ))}
          </div>

          {/* Day Stepper Capsule */}
          <div className="flex items-center cg-pill px-2.5 py-1 text-[#c4b5a0] gap-1.5">
            <button
              onClick={() => setDay(Math.max(1, gameState.day - 1))}
              disabled={gameState.day <= 1}
              aria-label="Previous Day"
              className="p-1 hover:text-white disabled:opacity-30 transition-colors"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="text-center min-w-[70px]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#c4b5a0] block">Day</span>
              <span className="text-sm font-bold text-white">{gameState.day} / 28</span>
            </div>
            <button
              onClick={() => setDay(Math.min(28, gameState.day + 1))}
              disabled={gameState.day >= 28}
              aria-label="Next Day"
              className="p-1 hover:text-white disabled:opacity-30 transition-colors"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Time of Day */}
        <div className="flex flex-wrap items-center gap-1.5">
          {timeSlots.map(t => (
            <button
              key={t.id}
              onClick={() => setTimeOfDay(t.id)}
              aria-label={t.label}
              title={`${t.label} (${t.hours})`}
              className={`cg-pill px-2.5 py-1.5 text-xs font-bold ${
                gameState.timeOfDay === t.id ? 'cg-pill-active' : ''
              }`}
            >
              <span>{t.icon}</span>
              <span className="hidden md:inline">{t.label}</span>
              <span className="text-[10px] opacity-75 hidden xl:inline">({t.hours})</span>
            </button>
          ))}
        </div>

        {/* Weather Selection */}
        <div className="flex flex-wrap items-center gap-1.5">
          {weathers.map(w => (
            <button
              key={w.id}
              onClick={() => setWeather(w.id)}
              aria-label={w.label}
              title={w.label}
              className={`cg-pill px-2.5 py-1.5 text-xs font-bold ${
                gameState.weather === w.id ? 'cg-pill-active' : ''
              }`}
            >
              <img src={w.iconImg} alt={w.label} className="w-4 h-4 object-contain" />
              <span className="hidden sm:inline text-[11px]">{w.label}</span>
            </button>
          ))}
        </div>

        {/* Active Now Live Toggle */}
        <button
          onClick={() =>
            setGameState(prev => ({ ...prev, liveFilterOnlyActive: !prev.liveFilterOnlyActive }))
          }
          className={`cg-pill px-3.5 py-2 text-xs font-bold ${
            gameState.liveFilterOnlyActive ? 'cg-pill-active' : ''
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Active RIGHT NOW</span>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
            gameState.liveFilterOnlyActive ? 'bg-[#13181b] text-white' : 'bg-white/15 text-white'
          }`}>
            {gameState.liveFilterOnlyActive ? 'ON' : 'OFF'}
          </span>
        </button>

      </div>
    </div>
  );
};
