import { Season } from '../../../types/fishing';

export interface SavePlayerEntry {
  index: number;
  name: string;
  farmName: string;
  gender: string;
  npcFriendships: Record<string, number>;
}

export interface EditableSaveModel {
  playerName: string;
  farmName: string;
  gender: string;
  money: number;
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  fishingLevel: number;
  farmingLevel: number;
  ranchingLevel: number;
  foragingLevel: number;
  miningLevel: number;
  catchingLevel: number;
  combatLevel: number;
  divingLevel: number;
  season: Season;
  day: number;
  year: number;
  weather: string;
  tomorrowWeather: string;
  inventorySlots: Array<{
    slotIndex: number;
    itemId: string;
    amount: number;
    quality: number; // 0=Normal, 1=Bronze, 2=Silver, 3=Gold, 4=Osmium
  }>;
  npcFriendships: Record<string, number>;
  npcRelationships?: Record<string, { hearts: number; rawPoints: number; status: string; talkedToday: boolean }>;
  townRankScore: number;
  donatedCount: number;
  offeredCount: number;
  completedQuestsCount: number;
  totalQuestsCount: number;
  availablePlayers?: SavePlayerEntry[];
  selectedPlayerIndex?: number;
}
