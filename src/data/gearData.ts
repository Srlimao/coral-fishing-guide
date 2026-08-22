import { RodData, BaitData, TackleData } from '../types/fishing';

export const RODS_DATA: Record<string, RodData> = {
  makeshift: {
    id: 'makeshift',
    name: 'Makeshift Fishing Rod',
    minLevel: 0,
    lineStrength: 100,
    reelingMultiplier: 1.0,
    maxDistance: 'Short (3-4 tiles)',
    recommendedDifficulty: 'Easy',
    description: 'A starter rod gifted by Sunny. Best suited for small, calm fish like Tilapia or Bluegill.',
    color: '#a89f91'
  },
  copper: {
    id: 'copper',
    name: 'Copper Fishing Rod',
    minLevel: 1,
    lineStrength: 160,
    reelingMultiplier: 1.25,
    maxDistance: 'Moderate (5-6 tiles)',
    recommendedDifficulty: 'Medium',
    description: 'Upgraded with copper ore. Moderately faster reeling and higher tension resistance.',
    color: '#d97736'
  },
  silver: {
    id: 'silver',
    name: 'Silver Fishing Rod',
    minLevel: 3,
    lineStrength: 240,
    reelingMultiplier: 1.55,
    maxDistance: 'Long (7-8 tiles)',
    recommendedDifficulty: 'Hard',
    description: 'Forged with silver bars. Significantly improves reeling speed and tension tolerance against fighting fish.',
    color: '#b0bec5'
  },
  gold: {
    id: 'gold',
    name: 'Gold Fishing Rod',
    minLevel: 5,
    lineStrength: 330,
    reelingMultiplier: 1.9,
    maxDistance: 'Very Long (9-10 tiles)',
    recommendedDifficulty: 'Hard',
    description: 'A luxurious gold-reinforced rod. Casts deep into the water and holds strong against rare, elusive fish.',
    color: '#e5a93b'
  },
  osmium: {
    id: 'osmium',
    name: 'Osmium Fishing Rod',
    minLevel: 8,
    lineStrength: 450,
    reelingMultiplier: 2.35,
    maxDistance: 'Maximum (Full Reach)',
    recommendedDifficulty: 'VeryHard',
    description: 'The pinnacle of Starlet Island craftsmanship. Effortlessly controls Legendary and high-tension fish.',
    color: '#805ad5'
  }
};

export const BAITS_DATA: Record<string, BaitData> = {
  none: {
    id: 'none',
    name: 'No Bait',
    bonusText: 'Standard bite rate',
    description: 'Fishing with an empty hook.'
  },
  regular: {
    id: 'regular',
    name: 'Regular Bait',
    bonusText: '-30% Fish Bite Delay',
    description: 'Crafted from trash/meat. Speeds up initial bite time.'
  },
  small: {
    id: 'small',
    name: 'Small Fish Bait',
    targetedSize: 'Small',
    bonusText: '+65% Small Fish Attraction & -25% Bite Delay',
    description: 'Attracts smaller fish species like Sardines, Anchovies, and Tilapia.'
  },
  medium: {
    id: 'medium',
    name: 'Medium Fish Bait',
    targetedSize: 'Medium',
    bonusText: '+65% Medium Fish Attraction & -25% Bite Delay',
    description: 'Lures medium game fish like Salmon, Catfish, Rainbow Fish, and Silver Arowana.'
  },
  large: {
    id: 'large',
    name: 'Large Fish Bait',
    targetedSize: 'Large',
    bonusText: '+65% Large Fish Attraction & -25% Bite Delay',
    description: 'Draws massive apex fish like Gator Gar, Sturgeon, Tuna, and Giant Mudskipper.'
  },
  magic: {
    id: 'magic',
    name: 'Magic Bait',
    bonusText: 'Ignores Weather & Time Restrictions',
    description: 'Enchanted bait from the Merfolk kingdom. Allows catching out-of-season/time fish.'
  }
};

export const TACKLES_DATA: Record<string, TackleData> = {
  none: {
    id: 'none',
    name: 'No Tackle',
    bonusText: 'Standard mechanics',
    description: 'No special attached lure.'
  },
  floating_lure: {
    id: 'floating_lure',
    name: 'Floating Lure',
    bonusText: 'Calms fish erratic movement by 35%',
    description: 'Stabilizes the minigame bobber and slows down sudden darts.'
  },
  heavy_lure: {
    id: 'heavy_lure',
    name: 'Heavy Lure',
    bonusText: 'Halves line decay speed when not actively reeling',
    description: 'Prevents the catch progress bar from draining quickly during thrashing.'
  },
  titanium_line: {
    id: 'titanium_line',
    name: 'Titanium Line',
    bonusText: '+40% Maximum Line Tension tolerance',
    description: 'Reinforced line that prevents sudden snaps when fish pull violently.'
  },
  curved_hook: {
    id: 'curved_hook',
    name: 'Curved Hook',
    bonusText: 'Starts minigame with 25% instant catch progress',
    description: 'Hooks deep into fish mouth, giving an immediate head start.'
  }
};
