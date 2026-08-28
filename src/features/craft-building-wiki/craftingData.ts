import { CraftingRecipe } from './types';

export const CRAFTING_RECIPES: CraftingRecipe[] = [
  // 1. Artisan & Processing
  {
    id: 'mason_jar',
    name: 'Mason Jar',
    category: 'Artisan & Processing',
    yieldCount: 1,
    sellPrice: 150,
    unlock: { source: 'Farming', level: 3, description: 'Farming Mastery Level 3' },
    materials: [
      { name: 'Wood', amount: 30, iconEmoji: '🪵', source: 'Chopping Trees / Debris' },
      { name: 'Glass', amount: 10, iconEmoji: '🪟', source: 'Kiln / Diving Sand' },
      { name: 'Scrap', amount: 2, iconEmoji: '⚙️', source: 'Recycling Ocean Trash' }
    ],
    description: 'Pickles vegetables or makes jams from fruits to dramatically boost sell value and stamina restore.',
    usageNotes: 'Processing takes approx. 12 in-game hours.',
    iconEmoji: '🏺'
  },
  {
    id: 'keg',
    name: 'Keg',
    category: 'Artisan & Processing',
    yieldCount: 1,
    sellPrice: 350,
    unlock: { source: 'Farming', level: 6, description: 'Farming Mastery Level 6' },
    materials: [
      { name: 'Wood', amount: 20, iconEmoji: '🪵', source: 'Chopping Trees' },
      { name: 'Bronze Bar', amount: 1, iconEmoji: '🟤', source: 'Smelt 5 Bronze Ore + 1 Coal' },
      { name: 'Glass', amount: 2, iconEmoji: '🪟', source: 'Kiln' },
      { name: 'Resin', amount: 1, iconEmoji: '🍯', source: 'Tree Tapper on Pine Tree' }
    ],
    description: 'Ferments crops and fruits into artisanal beverages, juices, wines, beers, and coffee.',
    usageNotes: 'Processing takes 1–3 in-game days depending on input ingredient.',
    iconEmoji: '🛢️'
  },
  {
    id: 'beehive',
    name: 'Beehive',
    category: 'Artisan & Processing',
    yieldCount: 1,
    sellPrice: 200,
    unlock: { source: 'Farming', level: 4, description: 'Farming Mastery Level 4' },
    materials: [
      { name: 'Wood', amount: 20, iconEmoji: '🪵', source: 'Chopping Trees' },
      { name: 'Scrap', amount: 5, iconEmoji: '⚙️', source: 'Recycling Trash' },
      { name: 'Bronze Bar', amount: 2, iconEmoji: '🟤', source: 'Smelt 5 Bronze Ore' }
    ],
    description: 'Place any harvested flower inside to produce valuable specialty Honey.',
    usageNotes: 'Takes 1–2 days. Honey type and value depends on the flower inserted.',
    iconEmoji: '🐝'
  },
  {
    id: 'cheese_press',
    name: 'Cheese Press',
    category: 'Artisan & Processing',
    yieldCount: 1,
    sellPrice: 250,
    unlock: { source: 'Farming', level: 2, description: 'Farming Mastery Level 2' },
    materials: [
      { name: 'Wood', amount: 20, iconEmoji: '🪵', source: 'Chopping Trees' },
      { name: 'Bronze Bar', amount: 5, iconEmoji: '🟤', source: 'Smelting Furnace' },
      { name: 'Scrap', amount: 5, iconEmoji: '⚙️', source: 'Recycling Machine' }
    ],
    description: 'Processes milk from cows and goats into artisan cheese wheels.',
    usageNotes: 'Large Milk yields Gold-star quality cheese.',
    iconEmoji: '🧀'
  },
  {
    id: 'mayonnaise_machine',
    name: 'Mayonnaise Machine',
    category: 'Artisan & Processing',
    yieldCount: 1,
    sellPrice: 220,
    unlock: { source: 'Farming', level: 2, description: 'Farming Mastery Level 2' },
    materials: [
      { name: 'Wood', amount: 20, iconEmoji: '🪵', source: 'Chopping Trees' },
      { name: 'Scrap', amount: 5, iconEmoji: '⚙️', source: 'Recycling' },
      { name: 'Bronze Bar', amount: 2, iconEmoji: '🟤', source: 'Smelter' }
    ],
    description: 'Converts chicken, duck, and quail eggs into premium artisanal mayonnaise jars.',
    usageNotes: 'Large eggs produce double or gold-tier mayo.',
    iconEmoji: '🥚'
  },
  {
    id: 'aging_barrel',
    name: 'Aging Barrel',
    category: 'Artisan & Processing',
    yieldCount: 1,
    sellPrice: 800,
    unlock: { source: 'TownRank', rank: 'C', description: 'Town Rank C & Lab Research' },
    materials: [
      { name: 'Hardwood', amount: 30, iconEmoji: '🪵', source: 'Hardwood Stumps / Logs' },
      { name: 'Silver Bar', amount: 2, iconEmoji: '⚪', source: 'Smelt Silver Ore' },
      { name: 'Bronze Bar', amount: 5, iconEmoji: '🟤', source: 'Smelt Bronze Ore' }
    ],
    description: 'Ages artisan goods (Wine, Cheese, Mead) up to Osmium 4-star quality, multiplying sell price.',
    usageNotes: 'Takes 7–14 in-game days for maximum quality upgrade.',
    iconEmoji: '🍷'
  },
  {
    id: 'smelter',
    name: 'Smelter / Furnace',
    category: 'Artisan & Processing',
    yieldCount: 1,
    sellPrice: 100,
    unlock: { source: 'Mining', level: 1, description: 'Mining Mastery Level 1' },
    materials: [
      { name: 'Stone', amount: 20, iconEmoji: '🪨', source: 'Mining Rocks' },
      { name: 'Bronze Ore', amount: 5, iconEmoji: '⛏️', source: 'Earth Mine (1–40)' }
    ],
    description: 'Smelts 5 raw ores and 1 coal into refined metal bars (Bronze, Silver, Gold, Osmium).',
    usageNotes: 'Essential for all high-tier tool and equipment crafting.',
    iconEmoji: '🔥'
  },
  {
    id: 'oil_press',
    name: 'Oil Press',
    category: 'Artisan & Processing',
    yieldCount: 1,
    sellPrice: 450,
    unlock: { source: 'Farming', level: 8, description: 'Farming Mastery Level 8' },
    materials: [
      { name: 'Hardwood', amount: 20, iconEmoji: '🪵', source: 'Hardwood Stumps' },
      { name: 'Gold Bar', amount: 2, iconEmoji: '🟡', source: 'Smelt Gold Ore' },
      { name: 'Scrap', amount: 10, iconEmoji: '⚙️', source: 'Recycling' }
    ],
    description: 'Presses Truffles, Canola, Corn, and Sunflowers into high-value oils.',
    usageNotes: 'Truffle Oil is one of the highest-earning artisan products in the game.',
    iconEmoji: '🌻'
  },
  {
    id: 'loom',
    name: 'Loom',
    category: 'Artisan & Processing',
    yieldCount: 1,
    sellPrice: 300,
    unlock: { source: 'Farming', level: 4, description: 'Farming Mastery Level 4' },
    materials: [
      { name: 'Wood', amount: 20, iconEmoji: '🪵', source: 'Chopping Trees' },
      { name: 'Silver Bar', amount: 5, iconEmoji: '⚪', source: 'Smelt Silver Ore' },
      { name: 'Scrap', amount: 10, iconEmoji: '⚙️', source: 'Recycling' }
    ],
    description: 'Weaves raw Wool and Cotton into premium Cloth and Silk.',
    usageNotes: 'Llama Wool produces high-tier fine cloth.',
    iconEmoji: '🧵'
  },

  // 2. Farming & Sprinklers
  {
    id: 'sprinkler_1',
    name: 'Sprinkler I',
    category: 'Farming & Sprinklers',
    yieldCount: 1,
    sellPrice: 150,
    unlock: { source: 'Farming', level: 2, description: 'Farming Mastery Level 2' },
    materials: [
      { name: 'Scrap', amount: 5, iconEmoji: '⚙️', source: 'Recycling' },
      { name: 'Bronze Bar', amount: 1, iconEmoji: '🟤', source: 'Smelter' },
      { name: 'Bronze Kelp', amount: 5, iconEmoji: '🌿', source: 'Diving 0–20m' }
    ],
    description: 'Automatically waters the 8 adjacent crop tiles (3x3 grid) every morning at 6:00 AM.',
    usageNotes: 'Area: 3x3 (8 crops watered).',
    iconEmoji: '🚿'
  },
  {
    id: 'sprinkler_2',
    name: 'Sprinkler II',
    category: 'Farming & Sprinklers',
    yieldCount: 1,
    sellPrice: 350,
    unlock: { source: 'Farming', level: 5, description: 'Farming Mastery Level 5' },
    materials: [
      { name: 'Scrap', amount: 5, iconEmoji: '⚙️', source: 'Recycling' },
      { name: 'Silver Bar', amount: 1, iconEmoji: '⚪', source: 'Smelter' },
      { name: 'Silver Kelp', amount: 5, iconEmoji: '🌿', source: 'Diving 20–40m' }
    ],
    description: 'Automatically waters the 24 adjacent crop tiles (5x5 grid) every morning at 6:00 AM.',
    usageNotes: 'Area: 5x5 (24 crops watered).',
    iconEmoji: '💦'
  },
  {
    id: 'sprinkler_3',
    name: 'Sprinkler III',
    category: 'Farming & Sprinklers',
    yieldCount: 1,
    sellPrice: 750,
    unlock: { source: 'Farming', level: 9, description: 'Farming Mastery Level 9' },
    materials: [
      { name: 'Scrap', amount: 5, iconEmoji: '⚙️', source: 'Recycling' },
      { name: 'Gold Bar', amount: 1, iconEmoji: '🟡', source: 'Smelter' },
      { name: 'Gold Kelp', amount: 5, iconEmoji: '🌿', source: 'Diving 40m+ Trench' }
    ],
    description: 'Automatically waters 48 adjacent crop tiles (7x7 / 9x9 grid) every morning at 6:00 AM.',
    usageNotes: 'Area: 7x7 (48 crops watered).',
    iconEmoji: '🌊'
  },
  {
    id: 'sprinkler_auto_seed',
    name: 'Auto-Seed Attachment',
    category: 'Farming & Sprinklers',
    yieldCount: 1,
    sellPrice: 500,
    unlock: { source: 'Lab', rank: 'B', description: 'Ling’s Lab Research (Rank B)' },
    materials: [
      { name: 'Scrap', amount: 5, iconEmoji: '⚙️', source: 'Recycling' },
      { name: 'Silver Bar', amount: 1, iconEmoji: '⚪', source: 'Smelter' },
      { name: 'Wild Seeds', amount: 10, iconEmoji: '🌱', source: 'Foraging / Sam’s Store' }
    ],
    description: 'Attach to any Sprinkler to automatically plant loaded seeds onto freshly tilled soil.',
    usageNotes: 'Eliminates manual replanting entirely.',
    iconEmoji: '🌱'
  },
  {
    id: 'super_scarecrow',
    name: 'Super Scarecrow',
    category: 'Farming & Sprinklers',
    yieldCount: 1,
    sellPrice: 200,
    unlock: { source: 'Farming', level: 4, description: 'Farming Mastery Level 4' },
    materials: [
      { name: 'Wood', amount: 25, iconEmoji: '🪵', source: 'Chopping Trees' },
      { name: 'Bronze Bar', amount: 5, iconEmoji: '🟤', source: 'Smelter' },
      { name: 'Trash', amount: 10, iconEmoji: '🗑️', source: 'Cleaning farm/ocean' }
    ],
    description: 'Protects a massive 19x19 tile radius against crow attacks and crop theft.',
    usageNotes: 'Coverage: 19x19 area around the scarecrow.',
    iconEmoji: '🌾'
  },
  {
    id: 'tree_tapper',
    name: 'Tree Tapper',
    category: 'Farming & Sprinklers',
    yieldCount: 1,
    sellPrice: 120,
    unlock: { source: 'Foraging', level: 3, description: 'Foraging Mastery Level 3' },
    materials: [
      { name: 'Wood', amount: 20, iconEmoji: '🪵', source: 'Chopping Trees' },
      { name: 'Bronze Bar', amount: 2, iconEmoji: '🟤', source: 'Smelter' }
    ],
    description: 'Attach to Maple, Oak, or Pine trees to harvest Maple Syrup, Resin, or Sap regularly.',
    usageNotes: 'Harvest ready every 3–4 days.',
    iconEmoji: '🌲'
  },

  // 3. Storage & Chests
  {
    id: 'wooden_chest',
    name: 'Wooden Chest',
    category: 'Storage & Chests',
    yieldCount: 1,
    sellPrice: 50,
    unlock: { source: 'Default', description: 'Available at start of game' },
    materials: [
      { name: 'Wood', amount: 25, iconEmoji: '🪵', source: 'Chopping Trees' },
      { name: 'Trash', amount: 10, iconEmoji: '🗑️', source: 'Cleaning farm' }
    ],
    description: 'Stores up to 20 item stacks. Can be colored and labeled for farm organization.',
    usageNotes: 'Capacity: 20 item slots.',
    iconEmoji: '📦'
  },
  {
    id: 'stone_chest',
    name: 'Stone Chest',
    category: 'Storage & Chests',
    yieldCount: 1,
    sellPrice: 75,
    unlock: { source: 'Mining', level: 1, description: 'Mining Mastery Level 1' },
    materials: [
      { name: 'Stone', amount: 25, iconEmoji: '🪨', source: 'Mining Rocks' },
      { name: 'Trash', amount: 10, iconEmoji: '🗑️', source: 'Cleaning farm' }
    ],
    description: 'Durable stone chest holding 20 item stacks with fire and bomb resistance.',
    usageNotes: 'Capacity: 20 item slots.',
    iconEmoji: '🪨'
  },
  {
    id: 'large_chest',
    name: 'Large Chest',
    category: 'Storage & Chests',
    yieldCount: 1,
    sellPrice: 400,
    unlock: { source: 'Foraging', level: 7, description: 'Foraging Mastery Level 7' },
    materials: [
      { name: 'Hardwood', amount: 50, iconEmoji: '🪵', source: 'Chopping Hardwood Stumps' },
      { name: 'Bronze Bar', amount: 10, iconEmoji: '🟤', source: 'Smelter' }
    ],
    description: 'Expanded farm storage chest with a whopping 40 inventory slots.',
    usageNotes: 'Capacity: 40 item slots (double of basic chest).',
    iconEmoji: '🧰'
  },

  // 4. Combat & Mining
  {
    id: 'small_bomb',
    name: 'Small Bomb',
    category: 'Bombs & Mining',
    yieldCount: 1,
    sellPrice: 40,
    unlock: { source: 'Mining', level: 2, description: 'Mining Mastery Level 2' },
    materials: [
      { name: 'Coal', amount: 5, iconEmoji: '⬛', source: 'Mining Rocks / Kiln' },
      { name: 'Bronze Ore', amount: 2, iconEmoji: '⛏️', source: 'Earth Caverns' }
    ],
    description: 'Detonates a 3x3 circle in caverns, instantly breaking rocks and revealing down-ladders.',
    usageNotes: 'Radius: 3x3. Run clear before 3-second fuse.',
    iconEmoji: '💣'
  },
  {
    id: 'large_bomb',
    name: 'Large Bomb',
    category: 'Bombs & Mining',
    yieldCount: 1,
    sellPrice: 120,
    unlock: { source: 'Mining', level: 8, description: 'Mining Mastery Level 8' },
    materials: [
      { name: 'Coal', amount: 5, iconEmoji: '⬛', source: 'Mining / Kiln' },
      { name: 'Gold Ore', amount: 2, iconEmoji: '⛏️', source: 'Fire / Wind Caverns' },
      { name: 'Silver Bar', amount: 1, iconEmoji: '⚪', source: 'Smelter' }
    ],
    description: 'Massive blast clearing a 7x7 radius in caverns to quickly farm ore nodes and geodes.',
    usageNotes: 'Radius: 7x7 explosion.',
    iconEmoji: '💥'
  },
  {
    id: 'rope',
    name: 'Rope',
    category: 'Bombs & Mining',
    yieldCount: 1,
    sellPrice: 30,
    unlock: { source: 'Mining', level: 1, description: 'Mining Mastery Level 1' },
    materials: [
      { name: 'Fiber', amount: 10, iconEmoji: '🌿', source: 'Cutting Weeds' },
      { name: 'Sap', amount: 5, iconEmoji: '💧', source: 'Chopping Trees' }
    ],
    description: 'Instantly spawns a shaft ladder down to the next cavern floor.',
    usageNotes: 'Single-use emergency descent tool.',
    iconEmoji: '🪢'
  },

  // 5. Fishing & Catching
  {
    id: 'small_bait',
    name: 'Small Bait',
    category: 'Baits & Traps',
    yieldCount: 5,
    sellPrice: 20,
    unlock: { source: 'Fishing', level: 2, description: 'Fishing Mastery Level 2' },
    materials: [
      { name: 'Bug Meat', amount: 1, iconEmoji: '🐛', source: 'Combat / Bug catching' },
      { name: 'Trash', amount: 1, iconEmoji: '🗑️', source: 'Ocean / Lake debris' }
    ],
    description: 'Increases bite rate and targets Small fish species.',
    usageNotes: 'Equip on Fishing Rod.',
    iconEmoji: '🪱'
  },
  {
    id: 'magic_bait',
    name: 'Magic Bait',
    category: 'Baits & Traps',
    yieldCount: 2,
    sellPrice: 250,
    unlock: { source: 'Fishing', level: 8, description: 'Fishing Mastery Level 8' },
    materials: [
      { name: 'Bug Meat', amount: 5, iconEmoji: '🐛', source: 'Combat' },
      { name: 'Gold Kelp', amount: 1, iconEmoji: '🌿', source: 'Diving 40m+' },
      { name: 'Osmium Essence', amount: 1, iconEmoji: '✨', source: 'Lab / Alchemy' }
    ],
    description: 'Allows catching ANY fish regardless of current season, time of day, or weather.',
    usageNotes: 'Crucial for out-of-season temple altar completion.',
    iconEmoji: '🔮'
  },
  {
    id: 'insect_trap',
    name: 'Ground Insect Trap',
    category: 'Baits & Traps',
    yieldCount: 1,
    sellPrice: 180,
    unlock: { source: 'Catching', level: 3, description: 'Catching Mastery Level 3' },
    materials: [
      { name: 'Wood', amount: 10, iconEmoji: '🪵', source: 'Chopping Trees' },
      { name: 'Fiber', amount: 5, iconEmoji: '🌿', source: 'Weeds' },
      { name: 'Insect Scent', amount: 1, iconEmoji: '🧪', source: 'Crafting' }
    ],
    description: 'Place in wild areas to passively trap beetles, crawlers, and ground critters overnight.',
    usageNotes: 'Check every morning.',
    iconEmoji: '🕸️'
  },

  // 6. Consumables & Survival
  {
    id: 'field_snack',
    name: 'Field Snack',
    category: 'Consumables & Survival',
    yieldCount: 1,
    sellPrice: 25,
    unlock: { source: 'Foraging', level: 1, description: 'Foraging Mastery Level 1' },
    materials: [
      { name: 'Maple Seed', amount: 1, iconEmoji: '🍁', source: 'Shaking / Chopping Maple' },
      { name: 'Pine Cone', amount: 1, iconEmoji: '🌲', source: 'Pine Trees' },
      { name: 'Oak Seed', amount: 1, iconEmoji: '🌳', source: 'Oak Trees' }
    ],
    description: 'A quick energy booster crafted from tree seeds. Restores +45 Stamina and +15 Health.',
    usageNotes: 'Essential for early-game stamina management.',
    iconEmoji: '🌰'
  },
  {
    id: 'healing_tonic',
    name: 'Healing Tonic',
    category: 'Consumables & Survival',
    yieldCount: 1,
    sellPrice: 150,
    unlock: { source: 'Combat', level: 4, description: 'Combat Mastery Level 4' },
    materials: [
      { name: 'Red Mushroom', amount: 2, iconEmoji: '🍄', source: 'Foraging / Caverns' },
      { name: 'Ginseng', amount: 1, iconEmoji: '🌱', source: 'Foraging' },
      { name: 'Honey', amount: 1, iconEmoji: '🍯', source: 'Beehive' }
    ],
    description: 'Restores +150 Health and +80 Stamina. Vital for deep Cavern exploration.',
    usageNotes: 'Instant consumable.',
    iconEmoji: '🧪'
  },

  // 7. Ocean & Diving
  {
    id: 'vortex_trap',
    name: 'Ocean Vortex Trap',
    category: 'Ocean & Diving',
    yieldCount: 1,
    sellPrice: 320,
    unlock: { source: 'Diving', level: 5, description: 'Diving Mastery Level 5' },
    materials: [
      { name: 'Scrap', amount: 20, iconEmoji: '⚙️', source: 'Recycling' },
      { name: 'Bronze Kelp', amount: 5, iconEmoji: '🌿', source: 'Diving' },
      { name: 'Battery', amount: 1, iconEmoji: '🔋', source: 'Solar Panel' }
    ],
    description: 'Anchors on ocean floor to passively collect rare sea critters, crabs, and ocean relics.',
    usageNotes: 'Submerged placement only.',
    iconEmoji: '🌀'
  }
];
