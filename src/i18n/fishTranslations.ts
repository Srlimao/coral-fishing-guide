import { SupportedLanguage } from './types';

// Map fish ID or Key to localized names
export const FISH_NAME_TRANSLATIONS: Record<string, Partial<Record<SupportedLanguage, string>>> = {
  // Fresh Water
  item_71002: { pt: 'Bagre', es: 'Bagre', de: 'Wels', fr: 'Poisson-chat', zh: '鲶鱼', ja: 'ナマズ', id: 'Lele' },
  item_71004: { pt: 'Tilápia', es: 'Tilapia', de: 'Tilapia', fr: 'Tilapia', zh: '罗非鱼', ja: 'ティラピア', id: 'Nila' },
  item_71009: { pt: 'Peixe-arco-íris', es: 'Pez arcoíris', de: 'Regenbogenfisch', fr: 'Poisson arc-en-ciel', zh: '彩虹鱼', ja: 'レインボーフィッシュ', id: 'Ikan Pelangi' },
  item_71005: { pt: 'Aruanã-prata', es: 'Arowana plateada', de: 'Silber-Arowana', fr: 'Arowana argenté', zh: '银龙鱼', ja: 'シルバーアロワナ', id: 'Arwana Perak' },
  item_71001: { pt: 'Cabeça-de-cobra-gigante', es: 'Cabeza de serpiente gigante', de: 'Riesen-Schlangenkopffisch', fr: 'Tête de serpent géante', zh: '巨鳢', ja: 'ジャイアントスネークヘッド', id: 'Toman' },
  item_71003: { pt: 'Carpa-cruciana', es: 'Carpín', de: 'Karausche', fr: 'Carassin', zh: '鲫鱼', ja: 'フナ', id: 'Ikan Mas Carassius' },
  item_71006: { pt: 'Koi', es: 'Koi', de: 'Koi', fr: 'Koï', zh: '锦鲤', ja: 'コイ', id: 'Ikan Koi' },
  item_71007: { pt: 'Peixe-fantasma-negro', es: 'Pez fantasma negro', de: 'Schwarzer Geisterfisch', fr: 'Poisson fantôme noir', zh: '黑魔鬼鱼', ja: 'ブラックゴースト', id: 'Ghost Knife Hitam' },
  item_71008: { pt: 'Peixe-jacaré', es: 'Pejelagarto', de: 'Kaimanfisch', fr: 'Gaspareau alligator', zh: '鳄雀鳝', ja: 'アリゲーターガー', id: 'Aligator Gar' },
  item_71010: { pt: 'Esturjão', es: 'Esturión', de: 'Stör', fr: 'Esturgeon', zh: '鲟鱼', ja: 'チョウザメ', id: 'Sturgeon' },
  item_71011: { pt: 'Peixe-lua-azul', es: 'Mojarra azul', de: 'Sonnenbarsch', fr: 'Crapet arlequin', zh: '蓝鳃太阳鱼', ja: 'ブルーギル', id: 'Bluegill' },
  item_71012: { pt: 'Perca-amarela', es: 'Perca amarilla', de: 'Gelbbarsch', fr: 'Perchaude', zh: '黄鲈', ja: 'イエローパーチ', id: 'Perch Kuning' },
  item_71013: { pt: 'Truta-arco-íris', es: 'Trucha arcoíris', de: 'Regenbogenforelle', fr: 'Truite arc-en-ciel', zh: '虹鳟', ja: 'ニジマス', id: 'Trout Pelangi' },
  item_71014: { pt: 'Lúcio-do-norte', es: 'Lucio del norte', de: 'Hecht', fr: 'Grand brochet', zh: '白斑狗鱼', ja: 'ノーザンパイク', id: 'Pike Utara' },
  item_71015: { pt: 'Enguia-elétrica', es: 'Anguila eléctrica', de: 'Zitteraal', fr: 'Anguille électrique', zh: '电鳗', ja: 'デンキウナギ', id: 'Belut Listrik' },
  item_71016: { pt: 'Pirarucu', es: 'Arapaima', de: 'Arapaima', fr: 'Arapaïma', zh: '巨骨舌鱼', ja: 'ピラルク', id: 'Arapaima' },
  item_71017: { pt: 'Acanthicus', es: 'Acanthicus', de: 'Acanthicus', fr: 'Acanthicus', zh: '棘甲鲶', ja: 'アカンティクス', id: 'Acanthicus' },
  item_71018: { pt: 'Chub', es: 'Cacho', de: 'Döbel', fr: 'Chevesne', zh: '白鲑', ja: 'チャブ', id: 'Chub' },
  item_71019: { pt: 'Dourado', es: 'Dorado', de: 'Dorado', fr: 'Dorado', zh: '黄金河虎', ja: 'ドラド', id: 'Dorado' },
  item_71020: { pt: 'Gudgeon', es: 'Gobio', de: 'Gründling', fr: 'Goujon', zh: '麦穗鱼', ja: 'ヒガイ', id: 'Gudgeon' },
  item_71021: { pt: 'Carpa-prateada', es: 'Carpa plateada', de: 'Silberkarpfen', fr: 'Carpe argentée', zh: '鲢鱼', ja: 'ハクレン', id: 'Ikan Mas Perak' },
  item_71022: { pt: 'Bagre-vermelho', es: 'Pez gato de cola roja', de: 'Rotflossen-Antennenwels', fr: 'Silure à queue rouge', zh: '红尾鲶', ja: 'レッドテールキャットフィッシュ', id: 'Lele Ekor Merah' },
  item_71023: { pt: 'Truta-marrom', es: 'Trucha marrón', de: 'Bachforelle', fr: 'Truite fario', zh: '褐鳟', ja: 'ブラウントラウト', id: 'Trout Cokelat' },
  item_71024: { pt: 'Perca-gigante', es: 'Perca gigante', de: 'Riesenbarsch', fr: 'Perche du Nil', zh: '尼罗河鲈', ja: 'ナイルパーチ', id: 'Kakap Nil' },
  item_71025: { pt: 'Truta-dourada', es: 'Trucha dorada', de: 'Goldforelle', fr: 'Truite dorée', zh: '金鳟', ja: 'ゴールデントラウト', id: 'Trout Emas' },
  item_71026: { pt: 'Bagre-canal', es: 'Bagre de canal', de: 'Getüpfelter Gabelwels', fr: 'Barbue de rivière', zh: '斑点叉尾鲯', ja: 'チャネルキャットフィッシュ', id: 'Lele Saluran' },
  item_71027: { pt: 'Carpa-cabeçuda', es: 'Carpa cabezona', de: 'Marmorkarpfen', fr: 'Carpe à grosse tête', zh: '鳙鱼', ja: 'コクレン', id: 'Ikan Mas Kepala Besar' },
  item_71028: { pt: 'Snakehead-ocellata', es: 'Cabeza de serpiente ocelado', de: 'Augenfleck-Schlangenkopffisch', fr: 'Tête de serpent ocellée', zh: '眼斑鳢', ja: 'フラワートーマン', id: 'Channa Maru' },
  item_71029: { pt: 'Peixe-espátula', es: 'Pez espátula', de: 'Löffelstör', fr: 'Poisson-spatule', zh: '匙吻鲟', ja: 'ヘラチョウザメ', id: 'Paddlefish' },
  item_71030: { pt: 'Cichla-azul', es: 'Tucunaré azul', de: 'Blauer Pfauenbarsch', fr: 'Cichla bleu', zh: '蓝孔雀鲈', ja: 'ブルーピーコックバス', id: 'Peacock Bass Biru' },

  // Salt Water
  item_72001: { pt: 'Pargo-rosa', es: 'Pargo rosado', de: 'Rosa Schnapper', fr: 'Vivaneau rose', zh: '粉红笛鲷', ja: 'ピンクスナッパー', id: 'Kakap Merah Muda' },
  item_72002: { pt: 'Peixe-leão', es: 'Pez león', de: 'Rotfeuerfisch', fr: 'Poisson-lion', zh: '狮子鱼', ja: 'ミノカサゴ', id: 'Ikan Singa' },
  item_72003: { pt: 'Atum', es: 'Atún', de: 'Thunfisch', fr: 'Thon', zh: '金枪鱼', ja: 'マグロ', id: 'Tuna' },
  item_72004: { pt: 'Sardinha', es: 'Sardina', de: 'Sardine', fr: 'Sardine', zh: '沙丁鱼', ja: 'イワシ', id: 'Sarden' },
  item_72005: { pt: 'Saltador-do-lodo-gigante', es: 'Saltarín del fango gigante', de: 'Riesenschlammspringer', fr: 'Périophtalme géant', zh: '大弹涂鱼', ja: 'オオトビハゼ', id: 'Tembakul Raksasa' },
  item_72006: { pt: 'Moreia-amarela', es: 'Morena amarilla', de: 'Gelbe Muräne', fr: 'Murène jaune', zh: '黄斑海鳝', ja: 'キバラムネエソ', id: 'Belut Moray Kuning' },
  item_72007: { pt: 'Cabeça-de-ovelha-asiática', es: 'Vieja asiática', de: 'Asiatischer Schafskopf', fr: 'Labre à tête de mouton', zh: '金黄拟开普鲷', ja: 'コブダイ', id: 'Kobudai' },
  item_72008: { pt: 'Moreia', es: 'Morena', de: 'Muräne', fr: 'Murène', zh: '海鳝', ja: 'ウツボ', id: 'Belut Moray' },
  item_72009: { pt: 'Barramundi', es: 'Barramundi', de: 'Barramundi', fr: 'Barramundi', zh: '尖吻鲈', ja: 'バラマンディ', id: 'Barramundi' },
  item_72010: { pt: 'Baiacu', es: 'Pez globo', de: 'Kugelfisch', fr: 'Poisson-globe', zh: '河豚', ja: 'フグ', id: 'Ikan Buntal' },
  item_72011: { pt: 'Peixe-serra-verde', es: 'Pez sierra verde', de: 'Grüner Sägefisch', fr: 'Poisson-scie vert', zh: '绿锯鳐', ja: 'オオノコギリエイ', id: 'Pari Gergaji Hijau' },
  item_72012: { pt: 'Anchova', es: 'Anchoa', de: 'Sardelle', fr: 'Anchois', zh: '凤尾鱼', ja: 'アンチョビ', id: 'Teri' },
  item_72013: { pt: 'Bonito', es: 'Bonito', de: 'Bonito', fr: 'Bonite', zh: '鲣鱼', ja: 'カツオ', id: 'Cakalang' },
  item_72014: { pt: 'Peixe-papagaio', es: 'Pez loro', de: 'Papageifisch', fr: 'Poisson-perroquet', zh: '鹦嘴鱼', ja: 'ブダイ', id: 'Ikan Kakatua' },
  item_72015: { pt: 'Cavala', es: 'Caballa', de: 'Makrele', fr: 'Maquereau', zh: '鲭鱼', ja: 'サバ', id: 'Kembung' },
  item_72016: { pt: 'Mahi-mahi', es: 'Mahi-mahi', de: 'Goldmakrele', fr: 'Mahi-mahi', zh: '鲯鳅', ja: 'シイラ', id: 'Mahi-mahi' },
  item_72017: { pt: 'Robalo', es: 'Lubina', de: 'Wolfsbarsch', fr: 'Bar commun', zh: '海鲈', ja: 'スズキ', id: 'Kakap Putih' },
  item_72018: { pt: 'Peixe-anjo', es: 'Pez ángel', de: 'Skalar', fr: 'Scalaire', zh: '神仙鱼', ja: 'エンゼルフィッシュ', id: 'Ikan Bidadari' },
  item_72019: { pt: 'Peixe-palhaço', es: 'Pez payaso', de: 'Clownfisch', fr: 'Poisson-clown', zh: '小丑鱼', ja: 'カクレクマノミ', id: 'Ikan Badut' },
  item_72020: { pt: 'Badejo', es: 'Abadejo', de: 'Pollack', fr: 'Lieu jaune', zh: '青鳕', ja: 'ポラック', id: 'Pollock' },
  item_72021: { pt: 'Tubarão-martelo', es: 'Tiburón martillo', de: 'Hammerhai', fr: 'Requin-marteau', zh: '双髻鲨', ja: 'シュモクザメ', id: 'Hiu Martil' },
  item_72022: { pt: 'Tubarão-branco', es: 'Gran tiburón blanco', de: 'Weißer Hai', fr: 'Grand requin blanc', zh: '大白鲨', ja: 'ホホジロザメ', id: 'Hiu Putih Besar' },
  item_72023: { pt: 'Barracuda', es: 'Barracuda', de: 'Barrakuda', fr: 'Barracuda', zh: '梭子鱼', ja: 'バラクーダ', id: 'Barakuda' },
  item_72024: { pt: 'Arenque', es: 'Arenque', de: 'Hering', fr: 'Hareng', zh: '鲱鱼', ja: 'ニシン', id: 'Herring' },
  item_72025: { pt: 'Peixe-lua', es: 'Pez luna', de: 'Mondfisch', fr: 'Poisson-lune', zh: '翻车鱼', ja: 'マンボウ', id: 'Ikan Mola-mola' },
  item_72026: { pt: 'Peixe-trombeta', es: 'Pez trompeta', de: 'Trompetenfisch', fr: 'Poisson-trompette', zh: '管口鱼', ja: 'ヘラヤガラ', id: 'Ikan Terompet' },
  item_72027: { pt: 'Cirurgião-patela', es: 'Cirujano azul', de: 'Paletten-Doktorfisch', fr: 'Chirurgien bleu', zh: '拟刺尾鲷', ja: 'ナンヨウハギ', id: 'Letter Six' },
  item_72028: { pt: 'Manta-diabo', es: 'Manta raya', de: 'Riesenmanta', fr: 'Raie manta', zh: '蝠鲼', ja: 'マンタ', id: 'Pari Manta' },
  item_72029: { pt: 'Peixe-gato-marinho', es: 'Siluro marino', de: 'Meerwels', fr: 'Poisson-chat marin', zh: '海鲶', ja: 'ゴンズイ', id: 'Sembilang' },
  item_72030: { pt: 'Salmão', es: 'Salmón', de: 'Lachs', fr: 'Saumon', zh: '三文鱼', ja: 'サケ', id: 'Salmon' },

  // Legendary & Cave
  item_74001: { pt: 'Aruanã-rei-vermelho', es: 'Arowana rey rojo', de: 'Roter Königs-Arowana', fr: 'Arowana royal rouge', zh: '红龙鱼', ja: 'スーパーレッドアロワナ', id: 'Arwana Super Red' },
  item_74002: { pt: 'Peixe-espátula-gigante', es: 'Pez espátula gigante', de: 'Riesen-Löffelstör', fr: 'Espadon-spatule géant', zh: '白鲟', ja: 'ハシナガチョウザメ', id: 'Giant Paddlefish' },
  item_74003: { pt: 'Gator-gar-albino', es: 'Pejelagarto albino', de: 'Albino-Kaimanfisch', fr: 'Gaspareau alligator albinos', zh: '白化鳄雀鳝', ja: 'アルビノアリゲーターガー', id: 'Albino Alligator Gar' }
};

export function getLocalizedFishName(fishId: string, fallbackName: string, lang: SupportedLanguage): string {
  if (lang === 'en') return fallbackName;
  const match = FISH_NAME_TRANSLATIONS[fishId];
  if (match && match[lang]) return match[lang]!;
  return fallbackName;
}
