import { SupportedLanguage } from './types';

export const LOCATION_TRANSLATIONS: Record<string, Partial<Record<SupportedLanguage, string>>> = {
  'Estuary': { pt: 'Estuário', es: 'Estuario', de: 'Mündung', fr: 'Estuaire', zh: '河口', ja: '河口', id: 'Muara' },
  'Lake Temple': { pt: 'Templo do Lago', es: 'Templo del Lago', de: 'Seetempel', fr: 'Temple du Lac', zh: '湖中神庙', ja: '湖の寺院', id: 'Kuil Danau' },
  'River Farm': { pt: 'Rio da Fazenda', es: 'Río de la Granja', de: 'Farmfluss', fr: 'Rivière de la Ferme', zh: '农场河流', ja: '牧場の川', id: 'Sungai Pertanian' },
  'River Forest': { pt: 'Rio da Floresta', es: 'Río del Bosque', de: 'Waldfluss', fr: 'Rivière de la Forêt', zh: '森林河流', ja: '森の川', id: 'Sungai Hutan' },
  'River Town': { pt: 'Rio da Cidade', es: 'Río del Pueblo', de: 'Stadtfluss', fr: 'Rivière de la Ville', zh: '小镇河流', ja: '町の川', id: 'Sungai Kota' },
  'Ocean Lookout': { pt: 'Mirante do Oceano', es: 'Mirador del Océano', de: 'Ozean-Aussichtspunkt', fr: 'Belvédère de l’Océan', zh: '海景瞭望台', ja: '展望台の海', id: 'Pesisir Samudra' },
  'Ocean Beach': { pt: 'Praia do Oceano', es: 'Playa del Océano', de: 'Ozeanstrand', fr: 'Plage de l’Océan', zh: '海滩', ja: 'ビーチの海', id: 'Pantai Samudra' },
  'Ocean Docks': { pt: 'Docas do Oceano', es: 'Muelles del Océano', de: 'Ozean-Docks', fr: 'Quais de l’Océan', zh: '海港码头', ja: '港の海', id: 'Dermaga Samudra' },
  'Deep Forest': { pt: 'Floresta Profunda', es: 'Bosque Profundo', de: 'Tiefer Wald', fr: 'Forêt Profonde', zh: '森林深处', ja: '奥深い森', id: 'Hutan Belantara' },
  'Forest Pond': { pt: 'Lagoa da Floresta', es: 'Estanque del Bosque', de: 'Waldteich', fr: 'Étang de la Forêt', zh: '森林水塘', ja: '森の池', id: 'Kolam Hutan' },
  'Water Mine (Level 1-20)': { pt: 'Mina d’Água (Nv 1-20)', es: 'Mina de Agua (Niv 1-20)', de: 'Wassermine (Stufe 1-20)', fr: 'Mine d’Eau (Niv 1-20)', zh: '水之矿洞 (1-20层)', ja: '水の鉱山 (1-20階)', id: 'Tambang Air (Lt 1-20)' },
  'Wind Mine (Level 1-40)': { pt: 'Mina de Vento (Nv 1-40)', es: 'Mina de Viento (Niv 1-40)', de: 'Windmine (Stufe 1-40)', fr: 'Mine de Vent (Niv 1-40)', zh: '风之矿洞 (1-40层)', ja: '風の鉱山 (1-40階)', id: 'Tambang Angin (Lt 1-40)' },
  'Fire Mine (Level 1-40)': { pt: 'Mina de Fogo (Nv 1-40)', es: 'Mina de Fuego (Niv 1-40)', de: 'Feuermine (Stufe 1-40)', fr: 'Mine de Feu (Niv 1-40)', zh: '火之矿洞 (1-40层)', ja: '火の鉱山 (1-40階)', id: 'Tambang Api (Lt 1-40)' }
};

export function getLocalizedLocationName(locationName: string, lang: SupportedLanguage): string {
  if (lang === 'en') return locationName;
  const match = LOCATION_TRANSLATIONS[locationName];
  if (match && match[lang]) return match[lang]!;
  return locationName;
}
