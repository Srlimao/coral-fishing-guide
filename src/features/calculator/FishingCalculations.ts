import {
  FishItem,
  Season,
  TimeOfDay,
  Weather,
  RodTier,
  BaitType,
  TackleType,
  FishDifficulty,
  UserProgress,
  ExclusivityInfo
} from '../../types/fishing';
import { RODS_DATA } from '../../data/gearData';

export interface CatchViabilityResult {
  score: number;
  status: 'optimal' | 'good' | 'challenging' | 'risky' | 'undergeared';
  statusLabel: string;
  badgeColor: string;
  tensionResistance: number;
  reelingPowerText: string;
  rodWarning?: string;
  tackleAdvise?: string;
  baitEffect?: string;
}

const DIFFICULTY_VALUES: Record<FishDifficulty, number> = {
  VeryEasy: 1,
  Easy: 2,
  Medium: 3,
  Hard: 4,
  VeryHard: 5
};

const ROD_TIER_VALUES: Record<RodTier, number> = {
  makeshift: 1,
  copper: 2,
  silver: 3,
  gold: 4,
  osmium: 5
};

export function isFishSpawnActive(
  fish: FishItem,
  season: Season,
  day: number,
  time: TimeOfDay,
  weather: Weather,
  bait: BaitType
): boolean {
  if (bait === 'magic') {
    return true;
  }

  for (const setting of fish.spawnSettings) {
    const seasonMatch = setting.spawnSeason ? setting.spawnSeason[season] : fish.seasons.includes(season);
    const weatherMatch = setting.spawnWeather ? setting.spawnWeather[weather] : fish.weathers.includes(weather);
    const timeMatch = setting.spawnTime ? setting.spawnTime[time] : fish.times.includes(time);

    let dateMatch = true;
    if (setting.isUsingSpecificDate && setting.dateRangeList && setting.dateRangeList.length > 0) {
      dateMatch = setting.dateRangeList.some(r => {
        if (r.from !== undefined && r.to !== undefined) {
          return day >= r.from && day <= r.to;
        }
        if (r.startsFrom && r.lastsTill) {
          return day >= r.startsFrom.day && day <= r.lastsTill.day;
        }
        return true;
      });
    }

    if (seasonMatch && weatherMatch && timeMatch && dateMatch) {
      return true;
    }
  }

  return false;
}

export function getFishExclusivityInfo(
  fish: FishItem,
  currentSeason: Season,
  userProgress: UserProgress
): ExclusivityInfo {
  const flags: string[] = [];
  let exclusivityWeight = 0;

  const isCaught = !!userProgress.caught[fish.id];
  const isNeededMuseum = !userProgress.donatedMuseum[fish.id];
  const isNeededTemple = fish.offerings.length > 0 && !userProgress.offeredTemple[fish.id];

  // 1. Leaving Soon Alert
  const nextSeason =
    currentSeason === 'spring'
      ? 'summer'
      : currentSeason === 'summer'
      ? 'fall'
      : currentSeason === 'fall'
      ? 'winter'
      : 'spring';
  const isCurrentSeason = fish.seasons.includes(currentSeason);
  const isLeavingSoon = isCurrentSeason && !fish.seasons.includes(nextSeason);

  if (isLeavingSoon) {
    flags.push(`Leaving end of ${currentSeason.toUpperCase()}`);
    exclusivityWeight += 600;
  }

  // 2. Season Exclusivity (Single Season)
  if (fish.seasons.length === 1) {
    flags.push(`${fish.seasons[0].toUpperCase()} Exclusive`);
    exclusivityWeight += 400;
  }

  // 3. Climate / Weather Exclusivity
  const isStormOnly = fish.weathers.includes('storm') && !fish.weathers.includes('sunny') && !fish.weathers.includes('rain');
  const isBlizzardOnly = fish.weathers.includes('blizzard') && !fish.weathers.includes('sunny');
  const isRainOnly = fish.weathers.includes('rain') && !fish.weathers.includes('sunny') && fish.weathers.length <= 2;

  if (isStormOnly) {
    flags.push(`Thunderstorm Only`);
    exclusivityWeight += 350;
  } else if (isBlizzardOnly) {
    flags.push(`Blizzard Only`);
    exclusivityWeight += 350;
  } else if (isRainOnly) {
    flags.push(`Rain/Storm Only`);
    exclusivityWeight += 300;
  } else if (fish.weathers.length === 1 && fish.weathers[0] === 'windy') {
    flags.push(`Windy Only`);
    exclusivityWeight += 300;
  }

  // 4. Time of Day Exclusivity
  if (fish.times.length === 1) {
    flags.push(`${fish.times[0].toUpperCase()} Only`);
    exclusivityWeight += 200;
  }

  // 5. Specific Date Window Exclusivity
  const hasSpecificDates = fish.spawnSettings.some(
    s => s.isUsingSpecificDate && s.dateRangeList && s.dateRangeList.length > 0
  );
  if (hasSpecificDates) {
    flags.push(`Date Window Exclusive`);
    exclusivityWeight += 250;
  }

  // 6. Legendary Rarity
  if (fish.rarity === 'Legendary') {
    flags.push(`Legendary King`);
    exclusivityWeight += 500;
  }

  const isExclusive = flags.length > 0;

  // Categorize Tier
  let tier: ExclusivityInfo['tier'] = 'completion';
  let priorityScore = 0;

  if (isExclusive) {
    tier = 'exclusive';
    // Priority: Exclusives first, with uncaught boosted highest
    priorityScore = (isCaught ? 1000 : 10000) + exclusivityWeight;
  } else if (isNeededTemple || isNeededMuseum) {
    tier = 'temple_museum';
    priorityScore = (isCaught ? 500 : 5000) + (isNeededTemple ? 800 : 400);
  } else {
    tier = 'completion';
    priorityScore = isCaught ? 100 : 1000;
  }

  return {
    isExclusive,
    flags,
    primaryTag: flags[0],
    tier,
    priorityScore
  };
}

export function calculateCatchViability(
  fish: FishItem,
  rod: RodTier,
  level: number,
  tackle: TackleType,
  bait: BaitType
): CatchViabilityResult {
  const rodData = RODS_DATA[rod] || RODS_DATA.makeshift;
  const rodTierValue = ROD_TIER_VALUES[rod] || 1;
  const fishDiffValue = DIFFICULTY_VALUES[fish.difficulty] || 2;
  const isLegendary = fish.rarity === 'Legendary';

  let baseScore = 60 + (rodTierValue - fishDiffValue) * 20 + level * 2.5;

  if (tackle === 'titanium_line') baseScore += 12;
  if (tackle === 'floating_lure') baseScore += 10;
  if (tackle === 'heavy_lure') baseScore += 8;
  if (tackle === 'curved_hook') baseScore += 10;

  if (isLegendary) {
    baseScore -= 20;
  }

  const score = Math.max(5, Math.min(100, Math.round(baseScore)));

  let status: CatchViabilityResult['status'] = 'good';
  let statusLabel = 'Good Match';
  let badgeColor = '#10b981';
  let rodWarning: string | undefined;

  if (score >= 80) {
    status = 'optimal';
    statusLabel = 'Easy Catch';
    badgeColor = '#10b981';
  } else if (score >= 60) {
    status = 'good';
    statusLabel = 'Capable';
    badgeColor = '#06b6d4';
  } else if (score >= 40) {
    status = 'challenging';
    statusLabel = 'Challenging';
    badgeColor = '#f59e0b';
    if (rodTierValue < fishDiffValue) {
      rodWarning = `Recommended upgrade to ${getRecommendedRod(fish.difficulty)} for smoother control.`;
    }
  } else if (score >= 25) {
    status = 'risky';
    statusLabel = 'High Tension Risk';
    badgeColor = '#ef4444';
    rodWarning = `Your ${rodData.name} line will snap rapidly against ${fish.name}'s tension! Use Titanium Line or upgrade rod.`;
  } else {
    status = 'undergeared';
    statusLabel = 'Severely Undergeared';
    badgeColor = '#881337';
    rodWarning = `Almost impossible with ${rodData.name}. Upgrade to Silver/Gold Rod before attempting.`;
  }

  let tackleAdvise: string | undefined;
  if (fish.pattern === 'Circle' || fish.pattern === 'Star') {
    tackleAdvise = 'Fast pattern: Floating Lure is highly effective at steadying movement.';
  } else if (fish.difficulty === 'Hard' || fish.difficulty === 'VeryHard' || isLegendary) {
    tackleAdvise = 'High tension: Titanium Line prevents line breakage during sudden rushes.';
  }

  let baitEffect: string | undefined;
  if (bait === 'magic') {
    baitEffect = '✨ Magic Bait Active: Spawns in any season/weather!';
  } else if (bait === 'small' && fish.size === 'Small') {
    baitEffect = '🎯 Bait match: +65% small fish attraction rate!';
  } else if (bait === 'medium' && fish.size === 'Medium') {
    baitEffect = '🎯 Bait match: +65% medium fish attraction rate!';
  } else if (bait === 'large' && fish.size === 'Large') {
    baitEffect = '🎯 Bait match: +65% large apex fish attraction rate!';
  }

  return {
    score,
    status,
    statusLabel,
    badgeColor,
    tensionResistance: rodData.lineStrength + (tackle === 'titanium_line' ? 80 : 0) + level * 5,
    reelingPowerText: `${rodData.reelingMultiplier}x Speed`,
    rodWarning,
    tackleAdvise,
    baitEffect
  };
}

function getRecommendedRod(diff: FishDifficulty): string {
  switch (diff) {
    case 'VeryEasy':
    case 'Easy':
      return 'Copper Rod';
    case 'Medium':
      return 'Silver Rod';
    case 'Hard':
      return 'Gold Rod';
    case 'VeryHard':
      return 'Osmium Rod';
  }
}

export function getFishCalendarSchedule(
  fish: FishItem,
  season: Season,
  time: TimeOfDay,
  weather: Weather,
  bait: BaitType
): boolean[] {
  const schedule: boolean[] = [];
  for (let day = 1; day <= 28; day++) {
    schedule.push(isFishSpawnActive(fish, season, day, time, weather, bait));
  }
  return schedule;
}
