import rawTownies from './triviaTownies.json';
import { TownieLeaderboardEntry } from '../features/trivia/types';

export interface RawTownie {
  name: string;
  portrait: string;
  title: string;
}

export const TOWNIES_DATA: RawTownie[] = rawTownies as RawTownie[];

/**
 * Generates a town leaderboard where:
 * - 1st position townsperson always has exactly 9 points.
 * - Remaining townspeople have realistic lower scores (8, 7, 6, 5, 4, 3, 2).
 */
export const generateTownLeaderboard = (
  playerScore?: number,
  playerName = 'Player'
): TownieLeaderboardEntry[] => {
  // Shuffle townies to give variety each round
  const shuffled = [...TOWNIES_DATA].sort(() => Math.random() - 0.5);

  const baseTownieScores = [9, 8, 7, 6, 5, 4, 3, 2];
  const entries: TownieLeaderboardEntry[] = [];

  baseTownieScores.forEach((score, index) => {
    const townie = shuffled[index % shuffled.length];
    entries.push({
      id: `townie_${index}_${townie.name}`,
      name: townie.name,
      score,
      portrait: townie.portrait,
      title: index === 0 ? 'Trivia Champion' : townie.title,
      isChampion: index === 0
    });
  });

  if (playerScore !== undefined) {
    // Insert player entry and sort descending
    entries.push({
      id: 'player_current',
      name: playerName,
      score: playerScore,
      portrait: '/cotal-fishing-guide/trivia/townies/T_QuestNPCTownDefault.png',
      title: 'Farmer',
      isPlayer: true
    });

    entries.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      // Player wins tie at 9 points
      if (a.isPlayer) return -1;
      if (b.isPlayer) return 1;
      return 0;
    });
  }

  return entries;
};
