import { SupportedLanguage } from './types';
import { TriviaCategory } from '../features/trivia/types';

export const TRIVIA_CATEGORY_NAMES: Record<TriviaCategory, Record<SupportedLanguage, string>> = {
  Fish: {
    en: 'Fish',
    pt: 'Peixes',
    es: 'Peces',
    de: 'Fische',
    fr: 'Poissons',
    zh: '鱼类',
    ja: '魚',
    id: 'Ikan'
  },
  Insect: {
    en: 'Insect',
    pt: 'Insetos',
    es: 'Insectos',
    de: 'Insekten',
    fr: 'Insectes',
    zh: '昆虫',
    ja: '虫',
    id: 'Serangga'
  },
  Critter: {
    en: 'Critter',
    pt: 'Bichos',
    es: 'Criaturas',
    de: 'Tierchen',
    fr: 'Bestioles',
    zh: '小动物',
    ja: '生き物',
    id: 'Binatang'
  },
  Farm: {
    en: 'Farm',
    pt: 'Fazenda',
    es: 'Agricultura',
    de: 'Farm',
    fr: 'Ferme',
    zh: '农业',
    ja: '農場',
    id: 'Perkebunan'
  },
  Forage: {
    en: 'Forage',
    pt: 'Coleta',
    es: 'Recolección',
    de: 'Sammeln',
    fr: 'Fourrage',
    zh: '觅食',
    ja: '採集',
    id: 'Pencarian'
  },
  Artisan: {
    en: 'Artisan',
    pt: 'Artesãos',
    es: 'Artesanía',
    de: 'Kunsthandwerk',
    fr: 'Artisans',
    zh: '手工产品',
    ja: '手作り製品',
    id: 'Artisan'
  },
  Fossil: {
    en: 'Fossil',
    pt: 'Fósseis',
    es: 'Fósiles',
    de: 'Fossilien',
    fr: 'Fossiles',
    zh: '化石',
    ja: '化石',
    id: 'Fosil'
  },
  Gem: {
    en: 'Gem',
    pt: 'Gemas',
    es: 'Gemas',
    de: 'Edelsteine',
    fr: 'Gemmes',
    zh: '宝石',
    ja: 'ジェム',
    id: 'Permata'
  },
  Artifact: {
    en: 'Artifact',
    pt: 'Artefatos',
    es: 'Artefactos',
    de: 'Artefakte',
    fr: 'Artefacts',
    zh: '文物',
    ja: '遺物',
    id: 'Artefak'
  }
};

export const TRIVIA_UI_STRINGS: Record<string, Record<SupportedLanguage, string>> = {
  title: {
    en: 'Coral Trivia Night',
    pt: 'Noite de Curiosidades de Coral',
    es: 'Noche de Trívial de Coral',
    de: 'Coral Insel-Quiznacht',
    fr: 'Soirée Quiz de Coral Island',
    zh: '科罗尔知识问答之夜',
    ja: 'コーラルトリビアナイト',
    id: 'Malam Trivia Coral Island'
  },
  subtitle: {
    en: 'Answer 15 items! 3 Hearts. Beat the 9-point town record to WIN!',
    pt: 'Responda 15 itens! 3 Vidas. Supere o recorde de 9 pontos da cidade para VENCER!',
    es: '¡Responde 15 objetos! 3 Vidas. ¡Supera el récord de 9 puntos para GANAR!',
    de: 'Beantworte 15 Gegenstände! 3 Herzen. Schlage den 9-Punkte-Rekord!',
    fr: 'Identifiez 15 objets ! 3 Vies. Battez le record de 9 points pour GAGNER !',
    zh: '回答15个物品！3颗心。超过小镇9分记录即可获胜！',
    ja: '15問に挑戦！ライフ3つ。町の9点記録を超えて勝利をつかもう！',
    id: 'Jawab 15 item! 3 Nyawa. Kalahkan rekor 9 poin kota untuk MENANG!'
  },
  play_category: {
    en: 'Start Trivia',
    pt: 'Iniciar Quiz',
    es: 'Comenzar Trívial',
    de: 'Quiz Starten',
    fr: 'Commencer le Quiz',
    zh: '开始问答',
    ja: 'クイズ開始',
    id: 'Mulai Trivia'
  },
  hearts_label: {
    en: 'Hearts',
    pt: 'Vidas',
    es: 'Vidas',
    de: 'Herzen',
    fr: 'Vies',
    zh: '生命',
    ja: 'ライフ',
    id: 'Nyawa'
  },
  time_remaining: {
    en: 'Time',
    pt: 'Tempo',
    es: 'Tiempo',
    de: 'Zeit',
    fr: 'Temps',
    zh: '时间',
    ja: '時間',
    id: 'Waktu'
  },
  timeout_fail: {
    en: "Time's Up!",
    pt: 'Tempo Esgotado!',
    es: '¡Tiempo agotado!',
    de: 'Zeit abgelaufen!',
    fr: 'Temps écoulé !',
    zh: '时间到！',
    ja: '時間切れ！',
    id: 'Waktu Habis!'
  },
  correct_feedback: {
    en: 'Correct!',
    pt: 'Correto!',
    es: '¡Correcto!',
    de: 'Richtig!',
    fr: 'Correct !',
    zh: '正确！',
    ja: '正解！',
    id: 'Benar!'
  },
  wrong_feedback: {
    en: 'Incorrect!',
    pt: 'Incorreto!',
    es: '¡Incorrecto!',
    de: 'Falsch!',
    fr: 'Incorrect !',
    zh: '错误！',
    ja: '不正解！',
    id: 'Salah!'
  },
  victory_title: {
    en: '🎉 YOU WON!',
    pt: '🎉 VOCÊ VENCEU!',
    es: '🎉 ¡HAS GANADO!',
    de: '🎉 DU HAST GEWONNEN!',
    fr: '🎉 VICTOIRE !',
    zh: '🎉 你获胜了！',
    ja: '🎉 勝利！',
    id: '🎉 KAMU MENANG!'
  },
  defeat_title: {
    en: 'GAME OVER',
    pt: 'FIM DE JOGO',
    es: 'FIN DE LA PARTIDA',
    de: 'SPIEL VORBEI',
    fr: 'PARTIE TERMINÉE',
    zh: '游戏结束',
    ja: 'ゲームオーバー',
    id: 'PERMAINAN BERAKHIR'
  },
  victory_desc: {
    en: 'Congratulations! You scored 9+ points and beat the town champion!',
    pt: 'Parabéns! Você fez 9+ pontos e superou o campeão da cidade!',
    es: '¡Enhorabuena! ¡Conseguiste 9+ puntos y venciste al campeón del pueblo!',
    de: 'Glückwunsch! Du hast 9+ Punkte erzielt und den Dorfmeister geschlagen!',
    fr: 'Félicitations ! Vous avez marqué 9+ points et battu le champion de la ville !',
    zh: '恭喜！你获得了9分以上，击败了小镇冠军！',
    ja: 'おめでとう！9点以上を獲得し、町のチャンピオンを破りました！',
    id: 'Selamat! Kamu mendapat 9+ poin dan mengalahkan juara kota!'
  },
  defeat_desc: {
    en: 'You needed at least 9 points to beat the town champion.',
    pt: 'Você precisava de pelo menos 9 pontos para vencer o campeão da cidade.',
    es: 'Necesitabas al menos 9 puntos para vencer al campeón del pueblo.',
    de: 'Du hast mindestens 9 Punkte gebraucht, um den Dorfmeister zu schlagen.',
    fr: 'Il vous fallait au moins 9 points pour battre le champion de la ville.',
    zh: '你需要至少9分才能击败小镇冠军。',
    ja: '町のチャンピオンを倒すには少なくとも9点が必要でした。',
    id: 'Kamu butuh minimal 9 poin untuk mengalahkan juara kota.'
  },
  play_again: {
    en: 'Play Again',
    pt: 'Jogar Novamente',
    es: 'Jugar de Nuevo',
    de: 'Nochmal Spielen',
    fr: 'Rejouer',
    zh: '再玩一次',
    ja: 'もう一度プレイ',
    id: 'Main Lagi'
  },
  choose_category: {
    en: 'Choose Category',
    pt: 'Escolher Categoria',
    es: 'Elegir Categoría',
    de: 'Kategorie Wählen',
    fr: 'Choisir une Catégorie',
    zh: '选择类别',
    ja: 'カテゴリー選択',
    id: 'Pilih Kategori'
  },
  town_leaderboard: {
    en: 'Starlet Town Leaderboard',
    pt: 'Classificação da Cidade Starlet',
    es: 'Clasificación de Villa Starlet',
    de: 'Starlet Town Rangliste',
    fr: 'Classement de Starlet Town',
    zh: '星光镇排行榜',
    ja: 'スターレットタウン順位表',
    id: 'Papan Peringkat Kota Starlet'
  },
  score_label: {
    en: 'Final Score',
    pt: 'Pontuação Final',
    es: 'Puntuación Final',
    de: 'Endstand',
    fr: 'Score Final',
    zh: '最终得分',
    ja: '最終スコア',
    id: 'Skor Akhir'
  }
};

export const getTriviaString = (key: string, lang: SupportedLanguage): string => {
  return TRIVIA_UI_STRINGS[key]?.[lang] || TRIVIA_UI_STRINGS[key]?.['en'] || key;
};

export const getTriviaCategoryName = (cat: TriviaCategory, lang: SupportedLanguage): string => {
  return TRIVIA_CATEGORY_NAMES[cat]?.[lang] || TRIVIA_CATEGORY_NAMES[cat]?.['en'] || cat;
};
