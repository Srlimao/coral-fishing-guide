import { BuildingInfo } from './types';

export const BUILDING_CATALOGUE: BuildingInfo[] = [
  // 1. Animal Housing
  {
    id: 'coop',
    name: 'Coop',
    category: 'Animal Housing',
    builder: 'Carpenter (Dinda & Joko)',
    iconEmoji: '🐔',
    description: 'Housing for poultry and small animals. Protected from wild weather and predators.',
    tiers: [
      {
        tierNumber: 1,
        name: 'Basic Coop',
        goldCost: 2000,
        daysToBuild: 2,
        dimensions: '5x4 Tiles',
        unlock: { source: 'Default', description: 'Available from Day 1 at Carpenter' },
        capacityText: '4 Small Animals (Chickens, Ducks)',
        featuresUnlocked: ['Buy Chickens from Ranch', 'Egg Hatching Incubator', 'Hay trough feeding'],
        materials: [
          { name: 'Wood', amount: 100, iconEmoji: '🪵', source: 'Chopping Trees' },
          { name: 'Stone', amount: 50, iconEmoji: '🪨', source: 'Mining Rocks' },
          { name: 'Bronze Bar', amount: 5, iconEmoji: '🟤', source: 'Smelter' },
          { name: 'Fiber', amount: 10, iconEmoji: '🌿', source: 'Weeds' }
        ],
        description: 'Starter coop holding up to 4 chickens or ducks for daily egg production.'
      },
      {
        tierNumber: 2,
        name: 'Upgraded Coop',
        goldCost: 4500,
        daysToBuild: 2,
        dimensions: '5x4 Tiles',
        unlock: { source: 'TownRank', rank: 'D', description: 'Town Rank D' },
        capacityText: '8 Small Animals (Unlocks Quails)',
        featuresUnlocked: ['Buy Quails from Ranch', 'Automatic hay distribution system', 'Increased friendship growth rate'],
        materials: [
          { name: 'Wood', amount: 150, iconEmoji: '🪵', source: 'Chopping Trees' },
          { name: 'Stone', amount: 100, iconEmoji: '🪨', source: 'Mining Rocks' },
          { name: 'Silver Bar', amount: 5, iconEmoji: '⚪', source: 'Smelter' }
        ],
        description: 'Expands capacity to 8 animals and unlocks Quail purchases at Jack’s Ranch.'
      },
      {
        tierNumber: 3,
        name: 'Deluxe Coop',
        goldCost: 8000,
        daysToBuild: 3,
        dimensions: '5x4 Tiles',
        unlock: { source: 'TownRank', rank: 'C', description: 'Town Rank C' },
        capacityText: '12 Small Animals (Unlocks Peacocks)',
        featuresUnlocked: ['Buy Peacocks from Ranch', 'Integrated Auto-Feeder from Silo', 'Auto-collector slot compatibility'],
        materials: [
          { name: 'Hardwood', amount: 50, iconEmoji: '🪵', source: 'Hardwood Stumps' },
          { name: 'Gold Bar', amount: 5, iconEmoji: '🟡', source: 'Smelter' },
          { name: 'Scrap', amount: 20, iconEmoji: '⚙️', source: 'Recycling' }
        ],
        description: 'Top-tier poultry facility with 12 capacity, full auto-feeder pipe integration, and exotic Peacocks.'
      }
    ]
  },
  {
    id: 'barn',
    name: 'Barn',
    category: 'Animal Housing',
    builder: 'Carpenter (Dinda & Joko)',
    iconEmoji: '🐄',
    description: 'Sturdy shelter for livestock including cows, sheep, goats, llamas, and pigs.',
    tiers: [
      {
        tierNumber: 1,
        name: 'Basic Barn',
        goldCost: 3000,
        daysToBuild: 2,
        dimensions: '7x4 Tiles',
        unlock: { source: 'Default', description: 'Available from Day 1 at Carpenter' },
        capacityText: '4 Livestock (Cows, Sheep)',
        featuresUnlocked: ['Buy Cows & Sheep from Ranch', 'Milk Pail & Shears usage', 'Breeding pasture zone'],
        materials: [
          { name: 'Wood', amount: 200, iconEmoji: '🪵', source: 'Chopping Trees' },
          { name: 'Stone', amount: 100, iconEmoji: '🪨', source: 'Mining Rocks' },
          { name: 'Bronze Bar', amount: 5, iconEmoji: '🟤', source: 'Smelter' }
        ],
        description: 'Houses 4 large livestock for daily fresh milk and wool harvests.'
      },
      {
        tierNumber: 2,
        name: 'Upgraded Barn',
        goldCost: 6500,
        daysToBuild: 2,
        dimensions: '7x4 Tiles',
        unlock: { source: 'TownRank', rank: 'D', description: 'Town Rank D' },
        capacityText: '8 Livestock (Unlocks Goats & Llamas)',
        featuresUnlocked: ['Buy Goats & Llamas', 'Automatic Hay Distribution', 'Faster Wool & Milk replenishment'],
        materials: [
          { name: 'Wood', amount: 250, iconEmoji: '🪵', source: 'Chopping Trees' },
          { name: 'Stone', amount: 150, iconEmoji: '🪨', source: 'Mining Rocks' },
          { name: 'Silver Bar', amount: 5, iconEmoji: '⚪', source: 'Smelter' }
        ],
        description: 'Upgrades to 8 livestock capacity, unlocking high-profit Goats and fine Llama wool.'
      },
      {
        tierNumber: 3,
        name: 'Deluxe Barn',
        goldCost: 12000,
        daysToBuild: 3,
        dimensions: '7x4 Tiles',
        unlock: { source: 'TownRank', rank: 'C', description: 'Town Rank C' },
        capacityText: '12 Livestock (Unlocks Pigs & Luwak)',
        featuresUnlocked: ['Buy Pigs (Truffle hunters)', 'Buy Luwak (Coffee beans)', 'Automatic Hay Feeder from Silos', 'Auto-Collector compatibility'],
        materials: [
          { name: 'Hardwood', amount: 75, iconEmoji: '🪵', source: 'Hardwood Stumps' },
          { name: 'Gold Bar', amount: 8, iconEmoji: '🟡', source: 'Smelter' },
          { name: 'Scrap', amount: 30, iconEmoji: '⚙️', source: 'Recycling' }
        ],
        description: 'The ultimate livestock palace. Houses 12 animals and enables lucrative outdoor Truffle foraging.'
      }
    ]
  },

  // 2. Farm Production & Utilities
  {
    id: 'silo',
    name: 'Silo',
    category: 'Farm Production',
    builder: 'Carpenter (Dinda & Joko)',
    iconEmoji: '🌾',
    description: 'Stores harvested grass into dried hay feed, automatically piping nourishment to Coops and Barns.',
    tiers: [
      {
        tierNumber: 1,
        name: 'Silo',
        goldCost: 2500,
        daysToBuild: 2,
        dimensions: '3x3 Tiles',
        unlock: { source: 'Default', description: 'Available from Day 1 at Carpenter' },
        capacityText: 'Stores 100 Hay Feeds',
        featuresUnlocked: ['Scything grass converts directly into stored Hay', 'Piped auto-feed to connected upgraded barns/coops'],
        materials: [
          { name: 'Stone', amount: 100, iconEmoji: '🪨', source: 'Mining Rocks' },
          { name: 'Bronze Bar', amount: 5, iconEmoji: '🟤', source: 'Smelter' },
          { name: 'Scrap', amount: 10, iconEmoji: '⚙️', source: 'Recycling' }
        ],
        description: 'Stores 100 hay. Multiple silos aggregate their total hay capacity across the farm.'
      },
      {
        tierNumber: 2,
        name: 'Large Silo',
        goldCost: 5500,
        daysToBuild: 2,
        dimensions: '3x3 Tiles',
        unlock: { source: 'TownRank', rank: 'C', description: 'Town Rank C' },
        capacityText: 'Stores 300 Hay Feeds',
        featuresUnlocked: ['Triple storage capacity', 'Winter emergency drought reserve'],
        materials: [
          { name: 'Stone', amount: 200, iconEmoji: '🪨', source: 'Mining Rocks' },
          { name: 'Silver Bar', amount: 5, iconEmoji: '⚪', source: 'Smelter' },
          { name: 'Hardwood', amount: 30, iconEmoji: '🪵', source: 'Hardwood Logs' }
        ],
        description: 'Expands single silo capacity to 300 hay, ensuring your animals never go hungry through Winter.'
      }
    ]
  },
  {
    id: 'mill',
    name: 'Mill',
    category: 'Farm Production',
    builder: 'Carpenter (Dinda & Joko)',
    iconEmoji: '⚙️',
    description: 'Grinds harvested crops into fine culinary baking supplies.',
    tiers: [
      {
        tierNumber: 1,
        name: 'Mill',
        goldCost: 2000,
        daysToBuild: 2,
        dimensions: '4x2 Tiles',
        unlock: { source: 'Default', description: 'Available from Day 1 at Carpenter' },
        capacityText: 'Processes up to 50 batches overnight',
        featuresUnlocked: ['Wheat -> Flour', 'Sugarcane -> Sugar', 'Rice -> Rice Flour'],
        materials: [
          { name: 'Wood', amount: 50, iconEmoji: '🪵', source: 'Chopping Trees' },
          { name: 'Stone', amount: 100, iconEmoji: '🪨', source: 'Mining Rocks' },
          { name: 'Bronze Bar', amount: 2, iconEmoji: '🟤', source: 'Smelter' }
        ],
        description: 'Processes bulk grains and cane overnight for cooking recipes and artisan sales.'
      }
    ]
  },
  {
    id: 'stable',
    name: 'Stable',
    category: 'Farm Production',
    builder: 'Carpenter (Dinda & Joko)',
    iconEmoji: '🐎',
    description: 'Provides a sheltered stall for your personal Horse mount.',
    tiers: [
      {
        tierNumber: 1,
        name: 'Horse Stable',
        goldCost: 15000,
        daysToBuild: 3,
        dimensions: '4x3 Tiles',
        unlock: { source: 'TownRank', rank: 'C', description: 'Town Rank C' },
        capacityText: '1 Mount (Horse)',
        featuresUnlocked: ['Buy Horse from Jack’s Ranch', '2.5x Island Travel Speed', 'Horse Whistle summon tool'],
        materials: [
          { name: 'Hardwood', amount: 50, iconEmoji: '🪵', source: 'Hardwood Stumps' },
          { name: 'Gold Bar', amount: 5, iconEmoji: '🟡', source: 'Smelter' },
          { name: 'Fiber', amount: 30, iconEmoji: '🌿', source: 'Weeds' }
        ],
        description: 'Enables high-speed exploration across the entirety of Starlet Island.'
      }
    ]
  },
  {
    id: 'shed',
    name: 'Shed',
    category: 'Farm Production',
    builder: 'Carpenter (Dinda & Joko)',
    iconEmoji: '🛖',
    description: 'A customizable interior warehouse for optimizing artisan equipment without cluttering your farm.',
    tiers: [
      {
        tierNumber: 1,
        name: 'Basic Shed',
        goldCost: 4000,
        daysToBuild: 2,
        dimensions: '5x4 Tiles (Interior: 11x9)',
        unlock: { source: 'Default', description: 'Available from Day 1 at Carpenter' },
        capacityText: 'Holds up to 67 Artisan Machines',
        featuresUnlocked: ['Enclosed indoor processing floor', 'Custom flooring & wallpaper customization'],
        materials: [
          { name: 'Wood', amount: 150, iconEmoji: '🪵', source: 'Chopping Trees' },
          { name: 'Stone', amount: 100, iconEmoji: '🪨', source: 'Mining Rocks' },
          { name: 'Bronze Bar', amount: 5, iconEmoji: '🟤', source: 'Smelter' }
        ],
        description: 'Creates a dedicated indoor studio to organize Kegs, Jars, Looms, and Aging Barrels.'
      },
      {
        tierNumber: 2,
        name: 'Big Shed',
        goldCost: 10000,
        daysToBuild: 3,
        dimensions: '5x4 Tiles (Interior: 17x12)',
        unlock: { source: 'TownRank', rank: 'C', description: 'Town Rank C' },
        capacityText: 'Holds up to 137 Artisan Machines',
        featuresUnlocked: ['Doubled interior workspace', 'No increase to outdoor footprint footprint!'],
        materials: [
          { name: 'Hardwood', amount: 80, iconEmoji: '🪵', source: 'Hardwood Stumps' },
          { name: 'Gold Bar', amount: 5, iconEmoji: '🟡', source: 'Smelter' },
          { name: 'Glass', amount: 20, iconEmoji: '🪟', source: 'Kiln' }
        ],
        description: 'Doubles internal space while preserving the compact 5x4 footprint on your farm.'
      }
    ]
  },

  // 3. Specialty Facilities
  {
    id: 'fish_pond',
    name: 'Fish Pond',
    category: 'Specialty Facilities',
    builder: 'Carpenter (Dinda & Joko)',
    iconEmoji: '🐟',
    description: 'Aquaculture pond where caught fish and ocean critters reproduce and produce Roe.',
    tiers: [
      {
        tierNumber: 1,
        name: 'Fish Pond',
        goldCost: 5000,
        daysToBuild: 2,
        dimensions: '5x5 Tiles',
        unlock: { source: 'Fishing', level: 3, description: 'Fishing Mastery Level 3' },
        capacityText: 'Population up to 10 Fish',
        featuresUnlocked: ['Stock any caught Fish/Ocean critter', 'Harvest Fish Roe & Rare Kelp', 'Fish Quests to raise capacity'],
        materials: [
          { name: 'Stone', amount: 150, iconEmoji: '🪨', source: 'Mining Rocks' },
          { name: 'Bronze Kelp', amount: 10, iconEmoji: '🌿', source: 'Diving 0–20m' },
          { name: 'Glass', amount: 5, iconEmoji: '🪟', source: 'Kiln' }
        ],
        description: 'Breed valuable fish like Pink Snapper or Sturgeon to generate expensive Caviar in Mason Jars.'
      }
    ]
  },
  {
    id: 'insect_house',
    name: 'Insect House',
    category: 'Specialty Facilities',
    builder: 'Carpenter (Dinda & Joko)',
    iconEmoji: '🦋',
    description: 'Critter sanctuary where caught bugs and butterflies reproduce and produce specialty harvestables.',
    tiers: [
      {
        tierNumber: 1,
        name: 'Insect House',
        goldCost: 5000,
        daysToBuild: 2,
        dimensions: '5x5 Tiles',
        unlock: { source: 'Catching', level: 3, description: 'Catching Mastery Level 3' },
        capacityText: 'Population up to 10 Critters',
        featuresUnlocked: ['Stock caught bugs/butterflies', 'Harvest Silk, Royal Jelly, and Monster Scents'],
        materials: [
          { name: 'Wood', amount: 150, iconEmoji: '🪵', source: 'Chopping Trees' },
          { name: 'Hardwood', amount: 20, iconEmoji: '🪵', source: 'Hardwood Stumps' },
          { name: 'Bronze Bar', amount: 5, iconEmoji: '🟤', source: 'Smelter' }
        ],
        description: 'Breed rare bugs like Atlas Moth or Rove Beetles for continuous rare material yields.'
      }
    ]
  },
  {
    id: 'greenhouse',
    name: 'Greenhouse',
    category: 'Specialty Facilities',
    builder: 'Goddess Lake Temple',
    iconEmoji: '🏡',
    description: 'Magical glass sanctuary immune to seasons, allowing any crop or fruit tree to grow all year round.',
    tiers: [
      {
        tierNumber: 1,
        name: 'Restored Greenhouse',
        goldCost: 0,
        daysToBuild: 1,
        dimensions: '7x6 Tiles (Interior: 10x10)',
        unlock: { source: 'Altar', description: 'Complete First Catching Altar Bundle at Lake Temple' },
        capacityText: '100 Protected Crop Tiles + Fruit Tree Perimeter',
        featuresUnlocked: ['Multi-season crop farming 365 days/year', 'Protected against Winter frost and thunderstorms', 'Sprinkler & attachment full compatibility'],
        materials: [
          { name: 'Lake Temple Offering', amount: 1, iconEmoji: '✨', source: 'Complete First Altar' }
        ],
        description: 'Restores the ancient ruin on your farm into a perpetual summer growing environment.'
      }
    ]
  },

  // 4. House Upgrades
  {
    id: 'house_upgrade',
    name: 'Farmhouse Upgrades',
    category: 'House Upgrades',
    builder: 'Carpenter (Dinda & Joko)',
    iconEmoji: '🏠',
    description: 'Expands your home interior, unlocking the Kitchen cooking station, marriage suites, and attic.',
    tiers: [
      {
        tierNumber: 1,
        name: 'House Upgrade Level 1 (Kitchen)',
        goldCost: 5000,
        daysToBuild: 2,
        dimensions: 'Interior Expansion',
        unlock: { source: 'TownRank', rank: 'E', description: 'Town Rank E' },
        capacityText: 'Full Kitchen + Mini Fridge',
        featuresUnlocked: ['Cooking Station unlocked (cook with utensils & recipes)', 'Mini Fridge 20-slot storage for ingredients', 'Extended living room'],
        materials: [
          { name: 'Wood', amount: 100, iconEmoji: '🪵', source: 'Chopping Trees' },
          { name: 'Stone', amount: 100, iconEmoji: '🪨', source: 'Mining Rocks' },
          { name: 'Bronze Bar', amount: 5, iconEmoji: '🟤', source: 'Smelter' }
        ],
        description: 'Adds a complete culinary kitchen with utensil stations to prepare stamina-restoring meals.'
      },
      {
        tierNumber: 2,
        name: 'House Upgrade Level 2 (Second Floor & Nursery)',
        goldCost: 15000,
        daysToBuild: 3,
        dimensions: 'Interior Expansion',
        unlock: { source: 'TownRank', rank: 'D', description: 'Town Rank D' },
        capacityText: 'Spouse Suite + Baby Crib Room',
        featuresUnlocked: ['Marriage readiness (allows wedding proposal)', 'Crib & 2 Children beds', 'Second story bedroom floor'],
        materials: [
          { name: 'Hardwood', amount: 50, iconEmoji: '🪵', source: 'Hardwood Stumps' },
          { name: 'Silver Bar', amount: 5, iconEmoji: '⚪', source: 'Smelter' },
          { name: 'Glass', amount: 10, iconEmoji: '🪟', source: 'Kiln' }
        ],
        description: 'Expands to a 2nd floor with double bed and nursery, qualifying your house for marriage.'
      },
      {
        tierNumber: 3,
        name: 'House Upgrade Level 3 (Attic & Cellar)',
        goldCost: 30000,
        daysToBuild: 3,
        dimensions: 'Interior Expansion',
        unlock: { source: 'TownRank', rank: 'C', description: 'Town Rank C' },
        capacityText: 'Expanded Attic & Basement Cellar',
        featuresUnlocked: ['Basement Cellar aging capacity', 'Attic wardrobe and gallery rooms', 'Full exterior house style reskinning'],
        materials: [
          { name: 'Hardwood', amount: 100, iconEmoji: '🪵', source: 'Hardwood Stumps' },
          { name: 'Gold Bar', amount: 10, iconEmoji: '🟡', source: 'Smelter' },
          { name: 'Osmium Bar', amount: 2, iconEmoji: '🟣', source: 'Smelter' }
        ],
        description: 'The pinnacle of luxury island living with basement aging casks and customizable architecture.'
      }
    ]
  }
];
