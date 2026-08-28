import { SupportedLanguage } from './types';

export const ALTAR_TITLE_TRANSLATIONS: Record<string, Partial<Record<SupportedLanguage, string>>> = {
  CatchingBased: {
    pt: 'Altar de Captura',
    es: 'Altar de Captura',
    de: 'Fang-Altar',
    fr: 'Autel de Capture',
    zh: '捕捞祭坛',
    ja: '捕獲の祭壇',
    id: 'Altar Tangkapan'
  },
  CropBased: {
    pt: 'Altar de Culturas',
    es: 'Altar de Cultivos',
    de: 'Ernte-Altar',
    fr: 'Autel des Cultures',
    zh: '作物祭坛',
    ja: '作物の祭壇',
    id: 'Altar Tanaman'
  },
  SpecialityBased: {
    pt: 'Altar Avançado',
    es: 'Altar Avanzado',
    de: 'Fortgeschrittener Altar',
    fr: 'Autel Avancé',
    zh: '进阶祭坛',
    ja: '上級の祭壇',
    id: 'Altar Lanjutan'
  },
  RareBased: {
    pt: 'Altar Raro',
    es: 'Altar Raro',
    de: 'Seltener Altar',
    fr: 'Autel Rare',
    zh: '稀有祭坛',
    ja: 'レアの祭壇',
    id: 'Altar Langka'
  },
  DivingBased: {
    pt: 'Altar de Mergulho',
    es: 'Altar de Buceo',
    de: 'Tauch-Altar',
    fr: 'Autel de Plongée',
    zh: '潜水祭坛',
    ja: 'ダイビングの祭壇',
    id: 'Altar Menyelam'
  },
  HeritageBased: {
    pt: 'Altar dos Guardiões',
    es: 'Altar de los Guardianes',
    de: 'Wächter-Altar',
    fr: 'Autel des Gardiens',
    zh: '守护者祭坛',
    ja: '守護者の祭壇',
    id: 'Altar Penjaga'
  }
};

export const BUNDLE_TITLE_TRANSLATIONS: Record<string, Partial<Record<SupportedLanguage, string>>> = {
  'Fresh Water Fish': { pt: 'Peixes de Água Doce', es: 'Peces de agua dulce', de: 'Süßwasserfische', fr: "Poissons d'eau douce", zh: '淡水鱼', ja: '淡水魚', id: 'Ikan Air Tawar' },
  'Salt Water Fish': { pt: 'Peixes de Água Salgada', es: 'Peces de agua salada', de: 'Salzwasserfische', fr: "Poissons d'eau de mer", zh: '海水鱼', ja: '海水魚', id: 'Ikan Air Asin' },
  'Rare Fish': { pt: 'Peixes Raros', es: 'Peces raros', de: 'Seltene Fische', fr: 'Poissons rares', zh: '稀有鱼类', ja: '希少な魚', id: 'Ikan Langka' },
  'Night Insect': { pt: 'Insetos Noturnos', es: 'Insectos nocturnos', de: 'Nachtinsekten', fr: 'Insectes nocturnes', zh: '夜行昆虫', ja: '夜の昆虫', id: 'Serangga Malam' },
  'Essential Resources': { pt: 'Oferendas Essenciais', es: 'Ofrendas esenciales', de: 'Grundlegende Opfergaben', fr: 'Offrandes essentielles', zh: '基础祭品', ja: '基本的な奉纳', id: 'Persembahan Penting' },
  'Spring Sesajen': { pt: 'Oferendas de Primavera', es: 'Ofrendas de primavera', de: 'Frühling-Opfergaben', fr: 'Offrandes de printemps', zh: '春季祭品', ja: '春の奉納', id: 'Persembahan Musim Semi' },
  'Summer Sesajen': { pt: 'Oferendas de Verão', es: 'Ofrendas de verano', de: 'Sommer-Opfergaben', fr: "Offrandes d'été", zh: '夏季祭品', ja: '夏の奉納', id: 'Persembahan Musim Panas' },
  'Fall Sesajen': { pt: 'Oferendas de Outono', es: 'Ofrendas de otoño', de: 'Herbst-Opfergaben', fr: "Offrandes d'automne", zh: '秋季祭品', ja: '秋の奉納', id: 'Persembahan Musim Gugur' },
  'Winter Sesajen': { pt: 'Oferendas de Inverno', es: 'Ofrendas de invierno', de: 'Winter-Opfergaben', fr: "Offrandes d'hiver", zh: '冬季祭品', ja: '冬の奉納', id: 'Persembahan Musim Dingin' },
  'Ocean Loot': { pt: 'Oferendas do Oceano', es: 'Ofrendas oceánicas', de: 'Ozean-Opfergaben', fr: 'Offrandes océaniques', zh: '海洋祭品', ja: '海の奉納', id: 'Persembahan Laut' },
  'Se Pulu (10m)': { pt: 'Se Pulu (10m)', es: 'Se Pulu (10 m)', de: 'Se Pulu (10 m)', fr: 'Se Pulu (10 m)', zh: '瑟普卢 (10米)', ja: 'セ・プル (10m)', id: 'Se Pulu (10m)' },
  'Dua Pulu (20m)': { pt: 'Dua Pulu (20m)', es: 'Dua Pulu (20 m)', de: 'Dua Pulu (20 m)', fr: 'Dua Pulu (20 m)', zh: '杜阿普卢 (20米)', ja: 'ドゥア・プル (20m)', id: 'Dua Pulu (20m)' },
  'Empat Pulu (40m)': { pt: 'Empat Pulu (40m)', es: 'Empat Pulu (40 m)', de: 'Empat Pulu (40 m)', fr: 'Empat Pulu (40 m)', zh: '恩帕特普卢 (40米)', ja: 'エンパット・プル (40m)', id: 'Empat Pulu (40m)' },
  'Lima Pulu (50m)': { pt: 'Lima Pulu (50m)', es: 'Lima Pulu (50 m)', de: 'Lima Pulu (50 m)', fr: 'Lima Pulu (50 m)', zh: '利马普卢 (50米)', ja: 'リマ・プル (50m)', id: 'Lima Pulu (50m)' },
  'Barn Animals': { pt: 'Animais de Celeiro', es: 'Animales de establo', de: 'Stalltiere', fr: "Animaux d'étable", zh: '畜棚动物', ja: '家畜の動物', id: 'Hewan Kandang Besar' },
  'Coop Animals': { pt: 'Animais de Galinheiro', es: 'Animales de corral', de: 'Gehegetiere', fr: 'Animaux de poulailler', zh: '禽舍动物', ja: '小屋の動物', id: 'Hewan Kandang Kecil' },
  'Basic Cooking': { pt: 'Culinária Básica', es: 'Cocina básica', de: 'Einfaches Kochen', fr: 'Cuisine simple', zh: '基础烹饪', ja: '基本的な料理', id: 'Memasak Dasar' },
  'Basic Artisan': { pt: 'Produtos Artesanais Básicos', es: 'Artesanías básicas', de: 'Einfache Handwerkswaren', fr: 'Artisanat de base', zh: '基础加工品', ja: '基本の加工品', id: 'Produk Olahan Dasar' },
  'Fruit Plant': { pt: 'Árvores Frutíferas', es: 'Frutas de árboles', de: 'Obstbäume', fr: 'Arbres fruitiers', zh: '果树水果', ja: '果樹', id: 'Pohon Buah' },
  'Monster Loot': { pt: 'Espólios de Monstros', es: 'Botín de monstruos', de: 'Monsterbeute', fr: 'Butin de monstres', zh: '怪物掉落物', ja: 'モンスターの戦利品', id: 'Rampasan Monster' },
  'Rare Crops': { pt: 'Culturas Raras', es: 'Cultivos raros', de: 'Seltene Feldfrüchte', fr: 'Cultures rares', zh: '稀有农作物', ja: '珍しい作物', id: 'Tanaman Langka' },
  'Precious Gems': { pt: 'Gemas Preciosas', es: 'Gemas preciosas', de: 'Edelsteine', fr: 'Pierres précieuses', zh: '珍贵宝石', ja: '貴重な宝石', id: 'Permata Berharga' },
  'Rare Cooking': { pt: 'Culinária Rara', es: 'Cocina sofisticada', de: 'Seltene Gerichte', fr: 'Plats raffinés', zh: '珍奇料理', ja: '珍しい料理', id: 'Masakan Langka' },
  'Rare Artisan': { pt: 'Artesanato Raro', es: 'Artesanías raras', de: 'Seltene Handwerksprodukte', fr: 'Artisanat rare', zh: '稀有加工品', ja: '希少な加工品', id: 'Produk Olahan Langka' },
  'Rare Ranching Products': { pt: 'Pecuária Rara', es: 'Productos de granja raros', de: 'Seltene Nutztierprodukte', fr: 'Élevage rare', zh: '珍贵畜产品', ja: '希少な畜産物', id: 'Hasil Ternak Langka' },
  'Rare Resources': { pt: 'Recursos Raros', es: 'Recursos raros', de: 'Seltene Ressourcen', fr: 'Ressources rares', zh: '稀有资源', ja: 'レア資源', id: 'Sumber Daya Langka' },
  'Master Slime': { pt: 'Mestre Slime', es: 'Maestro Slime', de: 'Meister-Schleim', fr: 'Maître Slime', zh: '史莱姆大师', ja: 'マスタースライム', id: 'Master Slime' },
  'King Tan': { pt: 'Rei Tan', es: 'Rey Tan', de: 'König Tan', fr: 'Roi Tan', zh: '谭国王', ja: 'キング・タン', id: 'Raja Tan' },
  Pandazen: { pt: 'Pandazen', es: 'Pandazen', de: 'Pandazen', fr: 'Pandazen', zh: '熊猫禅师', ja: 'パンダゼン', id: 'Pandazen' },
  'Lady Lavanna': { pt: 'Lady Lavanna', es: 'Lady Lavanna', de: 'Lady Lavanna', fr: 'Lady Lavanna', zh: '拉瓦娜女士', ja: 'レディ・ラヴァンナ', id: 'Lady Lavanna' }
};

export const OFFERING_ITEM_NAME_TRANSLATIONS: Record<string, Partial<Record<SupportedLanguage, string>>> = {
  Wood: { pt: 'Madeira', es: 'Madera', de: 'Holz', fr: 'Bois', zh: '木材', ja: '木材', id: 'Kayu' },
  Stone: { pt: 'Pedra', es: 'Piedra', de: 'Stein', fr: 'Pierre', zh: '石头', ja: '石', id: 'Batu' },
  Fiber: { pt: 'Fibra', es: 'Fibra', de: 'Faser', fr: 'Fibre', zh: '纤维', ja: '繊維', id: 'Serat' },
  Sap: { pt: 'Seiva', es: 'Savia', de: 'Harz', fr: 'Sève', zh: '树汁', ja: '樹液', id: 'Getah' },
  'Maple seed': { pt: 'Semente de bordo', es: 'Semilla de arce', de: 'Ahornsamen', fr: "Graine d'érable", zh: '枫树种子', ja: 'カエデの種', id: 'Benih Maple' },
  'Oak seed': { pt: 'Semente de carvalho', es: 'Semilla de roble', de: 'Eichel', fr: 'Gland', zh: '橡树种子', ja: 'オークの種', id: 'Benih Ek' },
  'Pine cone': { pt: 'Pinha', es: 'Piña', de: 'Tannenzapfen', fr: 'Pomme de pin', zh: '松果', ja: '松ぼっくり', id: 'Kerucut Pinus' },
  Wasabi: { pt: 'Wasabi', es: 'Wasabi', de: 'Wasabi', fr: 'Wasabi', zh: '山葵', ja: 'ワサビ', id: 'Wasabi' },
  Morel: { pt: 'Morchela', es: 'Colmenilla', de: 'Morchel', fr: 'Morille', zh: '羊肚菌', ja: 'アミガサタケ', id: 'Morel' },
  Turnip: { pt: 'Nabo', es: 'Nabo', de: 'Rübe', fr: 'Navet', zh: '芜菁', ja: 'カブ', id: 'Lobak' },
  Carrot: { pt: 'Cenoura', es: 'Zanahoria', de: 'Karotte', fr: 'Carotte', zh: '胡萝卜', ja: 'ニンジン', id: 'Wortel' },
  Daisy: { pt: 'Margarida', es: 'Margarita', de: 'Gänseblümchen', fr: 'Pâquerette', zh: '雏菊', ja: 'デイジー', id: 'Bunga Aster' },
  Shallot: { pt: 'Chalota', es: 'Chalota', de: 'Schalotte', fr: 'Échalote', zh: '分葱', ja: 'エシャロット', id: 'Bawang Merah Kecil' },
  Hibiscus: { pt: 'Hibisco', es: 'Hibisco', de: 'Hibiskus', fr: 'Hibiscus', zh: '木槿花', ja: 'ハイビスカス', id: 'Kembang Sepatu' },
  Blueberry: { pt: 'Mirtilo', es: 'Arándano', de: 'Blaubeere', fr: 'Myrtille', zh: '蓝莓', ja: 'ブルーベリー', id: 'Bluberi' },
  'Hot pepper': { pt: 'Pimenta', es: 'Pimiento picante', de: 'Chilischote', fr: 'Piment', zh: '辣椒', ja: 'トウガラシ', id: 'Cabai' },
  Sunflower: { pt: 'Girassol', es: 'Girasol', de: 'Sonnenblume', fr: 'Tournesol', zh: '向日葵', ja: 'ヒマワリ', id: 'Bunga Matahari' },
  'Black trumpet': { pt: 'Trompete-negro', es: 'Trompeta negra', de: 'Totentrompete', fr: 'Trompette de la mort', zh: '黑虎掌菌', ja: 'クロラッパタケ', id: 'Black Trumpet' },
  Fig: { pt: 'Figo', es: 'Higo', de: 'Feige', fr: 'Figue', zh: '无花果', ja: 'イチジク', id: 'Ara' },
  Orchid: { pt: 'Orquídea', es: 'Orquídea', de: 'Orchidee', fr: 'Orchidée', zh: '兰花', ja: 'ラン', id: 'Anggrek' },
  Pumpkin: { pt: 'Abóbora', es: 'Calabaza', de: 'Kürbis', fr: 'Citrouille', zh: '南瓜', ja: 'カボチャ', id: 'Labu' },
  Rice: { pt: 'Arroz', es: 'Arroz', de: 'Reis', fr: 'Riz', zh: '水稻', ja: 'コメ', id: 'Beras' },
  'Brussels sprouts': { pt: 'Couve-de-bruxelas', es: 'Coles de Bruselas', de: 'Rosenkohl', fr: 'Choux de Bruxelles', zh: '抱子甘蓝', ja: 'メキャベツ', id: 'Kubis Brussel' },
  Kale: { pt: 'Couve', es: 'Col rizada', de: 'Grünkohl', fr: 'Chou frisé', zh: '羽衣甘蓝', ja: 'ケール', id: 'Kale' },
  'Rose hip': { pt: 'Rosa-mosqueta', es: 'Escaramujo', de: 'Hagebutte', fr: 'Églantier', zh: '玫瑰果', ja: 'ローズヒップ', id: 'Rose Hip' },
  Snowdrop: { pt: 'Floco-de-neve', es: 'Campanilla de invierno', de: 'Schneeglöckchen', fr: 'Perce-neige', zh: '雪花莲', ja: 'スノードロップ', id: 'Snowdrop' },
  'Tea leaf': { pt: 'Folha de chá', es: 'Hoja de té', de: 'Teeblatt', fr: 'Feuille de thé', zh: '茶叶', ja: '茶葉', id: 'Daun Teh' },
  'Sea salt': { pt: 'Sal marinho', es: 'Sal marina', de: 'Meersalz', fr: 'Sel de mer', zh: '海盐', ja: '海塩', id: 'Garam Laut' },
  'King scallop': { pt: 'Vieira-real', es: 'Vieira gigante', de: 'Kammuschel', fr: 'Coquille Saint-Jacques', zh: '巨型扇贝', ja: 'ホタテ', id: 'Kerang Raja' },
  'Eastern oyster': { pt: 'Ostra-oriental', es: 'Ostra americana', de: 'Amerikanische Auster', fr: 'Huître américaine', zh: '美洲牡蛎', ja: 'アメリカガキ', id: 'Tiram Timur' },
  'Blue mussel': { pt: 'Mexilhão-azul', es: 'Mejillón azul', de: 'Gemeine Miesmuschel', fr: 'Moule commune', zh: '紫贻贝', ja: 'ムールガイ', id: 'Kerang Biru' },
  'Green sea urchin': { pt: 'Ouriço-do-mar-verde', es: 'Erizo de mar verde', de: 'Grüner Seeigel', fr: 'Oursin vert', zh: '绿海胆', ja: 'グリーンシーアーチン', id: 'Bulu Babi Hijau' },
  'Any Mayonnaise': { pt: 'Qualquer Maionese', es: 'Cualquier Mayonesa', de: 'Beliebige Mayonnaise', fr: 'Toute Mayonnaise', zh: '任意蛋黄酱', ja: '任意のマヨネーズ', id: 'Semua Mayones' },
  'Any Fruit Juice': { pt: 'Qualquer Suco de Frutas', es: 'Cualquier Zumo de Frutas', de: 'Beliebiger Fruchtsaft', fr: 'Tout Jus de Fruits', zh: '任意果汁', ja: '任意のフルーツジュース', id: 'Semua Jus Buah' },
  'Any Butter': { pt: 'Qualquer Manteiga', es: 'Cualquier Mantequilla', de: 'Beliebige Butter', fr: 'Tout Beurre', zh: '任意黄油', ja: '任意のバター', id: 'Semua Mentega' },
  'Any Dried Scavengeables': { pt: 'Qualquer Coleta Desidratada', es: 'Cualquier Recolección Seca', de: 'Beliebiges getrocknetes Sammelgut', fr: 'Tout Fourrage Séché', zh: '任意脱水觅食物', ja: '任意の乾燥採集物', id: 'Semua Hasil Pungutan Kering' },
  'Any Pickle': { pt: 'Qualquer Conserva', es: 'Cualquier Encurtido', de: 'Beliebiges Eingelegtes', fr: 'Toutes Conserves', zh: '任意腌菜', ja: '任意の漬物', id: 'Semua Acar' },
  'Any Uncommon Gem': { pt: 'Qualquer Gema Incomum', es: 'Cualquier Gema Poco Común', de: 'Beliebiger ungewöhnlicher Edelstein', fr: 'Toute Gemme Peu Commune', zh: '任意罕见宝石', ja: '任意のアンコモンの宝石', id: 'Semua Permata Tidak Umum' },
  'Any Rare Gem': { pt: 'Qualquer Gema Rara', es: 'Cualquier Gema Rara', de: 'Beliebiger seltener Edelstein', fr: 'Toute Gemme Rare', zh: '任意稀有宝石', ja: '任意のレアの宝石', id: 'Semua Permata Langka' },
  'Any Super Rare Gem': { pt: 'Qualquer Gema Super Rara', es: 'Cualquier Gema Súper Rara', de: 'Beliebiger superseltener Edelstein', fr: 'Toute Gemme Super Rare', zh: '任意超稀有宝石', ja: '任意のスーパーレアの宝石', id: 'Semua Permata Sangat Langka' },
  'Any Kimchi': { pt: 'Qualquer Kimchi', es: 'Cualquier Kimchi', de: 'Beliebiges Kimchi', fr: 'Tout Kimchi', zh: '任意辣白菜', ja: '任意のキムチ', id: 'Semua Kimchi' },
  'Any Wine': { pt: 'Qualquer Vinho', es: 'Cualquier Vino', de: 'Beliebiger Wein', fr: 'Tout Vin', zh: '任意果酒', ja: '任意のワイン', id: 'Semua Anggur' },
  'Any Artifact': { pt: 'Qualquer Artefato', es: 'Cualquier Artefacto', de: 'Beliebiges Artefakt', fr: 'Tout Artefact', zh: '任意文物', ja: '任意の遺物', id: 'Semua Artefak' },
  'Any Fossil': { pt: 'Qualquer Fóssil', es: 'Cualquier Fósil', de: 'Beliebiges Fossil', fr: 'Tout Fossile', zh: '任意化石', ja: '任意の化石', id: 'Semua Fosil' },
  'Any Dino Print': { pt: 'Qualquer Pegada de Dinossauro', es: 'Cualquier Huella de Dinosaurio', de: 'Beliebiger Dinosaurierabdruck', fr: 'Toute Empreinte de Dinosaure', zh: '任意恐龙足迹', ja: '任意の恐竜の足跡', id: 'Semua Jejak Dinosaurus' },
  Rambutan: { pt: 'Rambutã', es: 'Rambután', de: 'Rambutan', fr: 'Ramboutan', zh: '红毛丹', ja: 'ランブータン', id: 'Rambutan' },
  Durian: { pt: 'Durião', es: 'Durián', de: 'Durian', fr: 'Durian', zh: '榴莲', ja: 'ドリアン', id: 'Durian' },
  Mango: { pt: 'Manga', es: 'Mango', de: 'Mango', fr: 'Mangue', zh: '芒果', ja: 'マンゴー', id: 'Mangga' },
  Lemon: { pt: 'Limão', es: 'Limón', de: 'Zitrone', fr: 'Citron', zh: '柠檬', ja: 'レモン', id: 'Lemon' },
  Smoothie: { pt: 'Smoothie', es: 'Batido', de: 'Smoothie', fr: 'Smoothie', zh: '冰沙', ja: 'スムージー', id: 'Smoothie' },
  Onigiri: { pt: 'Onigiri', es: 'Onigiri', de: 'Onigiri', fr: 'Onigiri', zh: '饭团', ja: 'おにぎり', id: 'Onigiri' },
  Serabi: { pt: 'Serabi', es: 'Serabi', de: 'Serabi', fr: 'Serabi', zh: '印度尼西亚薄煎饼', ja: 'スラビ', id: 'Serabi' },
  'Pad thai': { pt: 'Pad Thai', es: 'Pad Thai', de: 'Pad Thai', fr: 'Pad Thaï', zh: '泰式炒河粉', ja: 'パッタイ', id: 'Pad Thai' },
  'Es cendol': { pt: 'Es Cendol', es: 'Es Cendol', de: 'Es Cendol', fr: 'Es Cendol', zh: '珍多冰', ja: 'チェンドルアイス', id: 'Es Cendol' },
  Popiah: { pt: 'Popiah', es: 'Popiah', de: 'Popiah', fr: 'Popiah', zh: '薄饼', ja: 'ポピア', id: 'Popiah' },
  'Es doger': { pt: 'Es Doger', es: 'Es Doger', de: 'Es Doger', fr: 'Es Doger', zh: '多格冰', ja: 'ドゲルアイス', id: 'Es Doger' },
  Petalia: { pt: 'Petália', es: 'Petalia', de: 'Petalia', fr: 'Pétalia', zh: '花瓣海贝', ja: 'ペタリア', id: 'Petalia' },
  Cactus: { pt: 'Cacto', es: 'Cactus', de: 'Kaktus', fr: 'Cactus', zh: '仙人掌', ja: 'サボテン', id: 'Kaktus' },
  Lychee: { pt: 'Lichia', es: 'Lichi', de: 'Litschi', fr: 'Litchi', zh: '荔枝', ja: 'ライチ', id: 'Leci' },
  Jamu: { pt: 'Jamu', es: 'Jamu', de: 'Jamu', fr: 'Jamu', zh: '佳木草药', ja: 'ジャムウ', id: 'Jamu' }
};

export function getLocalizedAltarTitle(altarKey: string, fallback: string, lang: SupportedLanguage): string {
  if (lang === 'en') return fallback;
  const match = ALTAR_TITLE_TRANSLATIONS[altarKey];
  return (match && match[lang]) || fallback;
}

export function getLocalizedBundleTitle(bundleTitle: string, lang: SupportedLanguage): string {
  if (lang === 'en') return bundleTitle;
  const match = BUNDLE_TITLE_TRANSLATIONS[bundleTitle];
  return (match && match[lang]) || bundleTitle;
}

export function getLocalizedOfferingItemName(name: string, lang: SupportedLanguage): string {
  if (lang === 'en') return name;
  const match = OFFERING_ITEM_NAME_TRANSLATIONS[name];
  return (match && match[lang]) || name;
}
