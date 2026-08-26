const fs = require('fs');
const path = require('path');

const locBase = 'D:/Apps/coral-island-guide/coral-island-guide/pak-assets/live/ProjectCoral/Content/Localization/Game';
const texBase = 'D:/Apps/coral-island-guide/coral-island-guide/pak-assets/live/ProjectCoral/Content/ProjectCoral/Textures';
const npcBase = path.join(texBase, 'UI/NPCHeadPortraits');

const langs = [
  { code: 'en', file: 'en' },
  { code: 'pt', file: 'pt-BR' },
  { code: 'es', file: 'es' },
  { code: 'de', file: 'de' },
  { code: 'fr', file: 'fr' },
  { code: 'zh', file: 'zh-CN' },
  { code: 'ja', file: 'ja' },
  { code: 'id', file: 'id' }
];

console.log('Building key maps from Game.json...');
const keyMaps = {};
langs.forEach(l => {
  const p = path.join(locBase, l.file, 'Game.json');
  keyMaps[l.code] = {};
  if (fs.existsSync(p)) {
    const raw = JSON.parse(fs.readFileSync(p, 'utf8'));
    function flatten(obj) {
      if (!obj) return;
      if (typeof obj === 'object') {
        for (const k in obj) {
          if (typeof obj[k] === 'string') {
            keyMaps[l.code][k] = obj[k];
          } else if (typeof obj[k] === 'object') {
            flatten(obj[k]);
          }
        }
      }
    }
    flatten(raw);
  }
});

// Build English lookup index prioritizing DT_InventoryItems
const enValToKeys = {};
for (const [key, val] of Object.entries(keyMaps['en'] || {})) {
  const norm = val.trim().toLowerCase();
  if (!enValToKeys[norm]) enValToKeys[norm] = [];
  if (key.includes('item_') || key.includes('DT_InventoryItems')) {
    enValToKeys[norm].unshift(key);
  } else {
    enValToKeys[norm].push(key);
  }
}

function getBestTranslation(baseName) {
  const cleanName = baseName.trim().toLowerCase();
  const translations = {};

  let keys = enValToKeys[cleanName] || [];
  if (keys.length === 0) {
    const alt = cleanName.replace(/['’]/g, '').replace(/[-_]/g, ' ');
    for (const k in enValToKeys) {
      if (k.replace(/['’]/g, '').replace(/[-_]/g, ' ') === alt) {
        keys = enValToKeys[k];
        break;
      }
    }
  }

  langs.forEach(l => {
    if (l.code === 'en') {
      translations['en'] = baseName;
    } else {
      let found = null;
      for (const k of keys) {
        if (keyMaps[l.code] && keyMaps[l.code][k] && keyMaps[l.code][k].trim() !== '') {
          found = keyMaps[l.code][k];
          break;
        }
      }
      translations[l.code] = found || baseName;
    }
  });
  return translations;
}

const categories = [
  { name: 'Fish', folder: path.join(texBase, 'Inventory_Icons/Underwater_animals/Fish/Textures') },
  { name: 'Insect', folder: path.join(texBase, 'Inventory_Icons/Insects_Icons/Insect_textures') },
  { name: 'Critter', folder: path.join(texBase, 'Inventory_Icons/Underwater_animals/Ocean_critters/Textures') },
  {
    name: 'Farm',
    folders: [
      path.join(texBase, 'Inventory_Icons/Crops_icons/Textures'),
      path.join(texBase, 'Inventory_Icons/Animal_produces_icons/Textures')
    ]
  },
  { name: 'Forage', folder: path.join(texBase, 'Inventory_Icons/Scavangeables/Scavangeable_textures') },
  { name: 'Artisan', folder: path.join(texBase, 'Inventory_Icons/Artisan_machine_products/Artisan_produces/Artisan_Produces_Textures') },
  { name: 'Fossil', folder: path.join(texBase, 'Inventory_Icons/Gem_Artifacts_Fossils/Fossils/Fossils_textures') },
  {
    name: 'Gem',
    folders: [
      path.join(texBase, 'Inventory_Icons/Gem_Artifacts_Fossils/Gems/Gem_textures'),
      path.join(texBase, 'Inventory_Icons/Gem_Artifacts_Fossils/Geode_node/Geodes_textures')
    ]
  },
  { name: 'Artifact', folder: path.join(texBase, 'Inventory_Icons/Gem_Artifacts_Fossils/Artifacts/Artifact_textures') }
];

const publicItemsDir = path.join(__dirname, '../public/trivia/items');
const publicTowniesDir = path.join(__dirname, '../public/trivia/townies');
fs.mkdirSync(publicItemsDir, { recursive: true });
fs.mkdirSync(publicTowniesDir, { recursive: true });

const allItems = [];
let idCounter = 1;

categories.forEach(cat => {
  const folders = cat.folders || [cat.folder];
  folders.forEach(dir => {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));
      files.forEach(file => {
        const baseName = file.replace('.png', '').replace(/_/g, ' ');
        const destFile = cat.name.toLowerCase() + '_' + file;
        const destPath = path.join(publicItemsDir, destFile);
        fs.copyFileSync(path.join(dir, file), destPath);

        const translations = getBestTranslation(baseName);
        allItems.push({
          id: 'item_' + (idCounter++),
          category: cat.name,
          englishName: baseName,
          translations,
          imageName: destFile,
          imagePath: '/cotal-fishing-guide/trivia/items/' + destFile
        });
      });
    }
  });
});

console.log(`Generated ${allItems.length} trivia items across 9 categories!`);

// Save JSON
const outJson = path.join(__dirname, '../src/data/triviaItemsData.json');
fs.writeFileSync(outJson, JSON.stringify(allItems, null, 2), 'utf8');

// Copy Townies
const targetTownies = ['Walter', 'Scott', 'Millie', 'Noah', 'Lily', 'Surya', 'Raj', 'Nina', 'Pablo', 'Rafael', 'Zarah', 'Eva', 'Mark', 'Alice', 'Luke', 'Suki'];
const towniesData = [];

if (fs.existsSync(npcBase)) {
  const allNpcFiles = fs.readdirSync(npcBase);
  targetTownies.forEach(t => {
    const npcFile = allNpcFiles.find(f => f.toLowerCase().includes(t.toLowerCase()) && f.endsWith('.png') && !f.includes('Locked'));
    if (npcFile) {
      fs.copyFileSync(path.join(npcBase, npcFile), path.join(publicTowniesDir, npcFile));
      towniesData.push({
        name: t,
        portrait: '/cotal-fishing-guide/trivia/townies/' + npcFile,
        title: 'Starlet Townie'
      });
    }
  });
}

console.log(`Extracted ${towniesData.length} Townie portraits!`);
const outTowniesJson = path.join(__dirname, '../src/data/triviaTownies.json');
fs.writeFileSync(outTowniesJson, JSON.stringify(towniesData, null, 2), 'utf8');
