import { Season, Weather, TimeOfDay } from '../../types/fishing';

export interface LiveGameState {
  connected: boolean;
  inGame?: boolean;
  timestamp: number;
  season: Season;
  day: number;
  year: number;
  hour: number;
  minute: number;
  formattedTime: string;
  timeOfDay: TimeOfDay;
  weather: Weather;
  fishingLevel: number;
  rodTier: string;
  caughtFish: string[];
  donatedFish: string[];
  offeredFish: string[];
}

export const INITIAL_LIVE_STATE: LiveGameState = {
  connected: false,
  inGame: false,
  timestamp: 0,
  season: 'spring',
  day: 1,
  year: 1,
  hour: 6,
  minute: 0,
  formattedTime: '06:00 AM',
  timeOfDay: 'morning',
  weather: 'sunny',
  fishingLevel: 0,
  rodTier: 'makeshift',
  caughtFish: [],
  donatedFish: [],
  offeredFish: []
};
