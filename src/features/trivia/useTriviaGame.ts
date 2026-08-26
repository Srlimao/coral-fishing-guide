import { useState, useEffect, useRef, useCallback } from 'react';
import {
  TriviaCategory,
  TriviaQuestion,
  TriviaRoundQuestionResult,
  TriviaGamePhase,
  TownieLeaderboardEntry,
  AllCategoryStats
} from './types';
import { generateTriviaRound } from './triviaGenerator';
import { generateTownLeaderboard } from '../../data/triviaTowniesData';

const LOCAL_STORAGE_KEY_TRIVIA_STATS = 'coral_fish_guide_trivia_stats_v1';

const defaultStats: AllCategoryStats = {
  Fish: { bestScore: 0, timesPlayed: 0, hasWon: false },
  Insect: { bestScore: 0, timesPlayed: 0, hasWon: false },
  Critter: { bestScore: 0, timesPlayed: 0, hasWon: false },
  Farm: { bestScore: 0, timesPlayed: 0, hasWon: false },
  Forage: { bestScore: 0, timesPlayed: 0, hasWon: false },
  Artisan: { bestScore: 0, timesPlayed: 0, hasWon: false },
  Fossil: { bestScore: 0, timesPlayed: 0, hasWon: false },
  Gem: { bestScore: 0, timesPlayed: 0, hasWon: false },
  Artifact: { bestScore: 0, timesPlayed: 0, hasWon: false }
};

export const useTriviaGame = () => {
  const [phase, setPhase] = useState<TriviaGamePhase>('category_select');
  const [activeCategory, setActiveCategory] = useState<TriviaCategory | null>(null);
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10.0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [roundResults, setRoundResults] = useState<TriviaRoundQuestionResult[]>([]);
  const [leaderboard, setLeaderboard] = useState<TownieLeaderboardEntry[]>([]);

  const [allStats, setAllStats] = useState<AllCategoryStats>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_TRIVIA_STATS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return defaultStats;
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const currentQuestion: TriviaQuestion | undefined = questions[currentIndex];

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const endRound = useCallback((finalScore: number, cat: TriviaCategory) => {
    clearTimer();
    setPhase('round_over');
    const isWin = finalScore >= 9;
    setLeaderboard(generateTownLeaderboard(finalScore));

    setAllStats(prev => {
      const currentCat = prev[cat] || { bestScore: 0, timesPlayed: 0, hasWon: false };
      const updated: AllCategoryStats = {
        ...prev,
        [cat]: {
          bestScore: Math.max(currentCat.bestScore, finalScore),
          timesPlayed: currentCat.timesPlayed + 1,
          hasWon: currentCat.hasWon || isWin,
          lastPlayedTimestamp: Date.now()
        }
      };
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY_TRIVIA_STATS, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const handleAnswer = useCallback((optionId: string | null) => {
    if (isAnswered || !currentQuestion || !activeCategory) return;
    clearTimer();
    setIsAnswered(true);
    setSelectedOptionId(optionId);

    const timeSpent = Math.min(10.0, (Date.now() - startTimeRef.current) / 1000);
    const isCorrect = optionId === currentQuestion.correctOptionId;

    const nextScore = isCorrect ? score + 1 : score;
    const nextHearts = isCorrect ? hearts : hearts - 1;

    if (isCorrect) {
      setScore(nextScore);
    } else {
      setHearts(nextHearts);
    }

    const newResult: TriviaRoundQuestionResult = {
      questionNumber: currentIndex + 1,
      targetItem: currentQuestion.targetItem,
      selectedOptionId: optionId,
      isCorrect,
      timeSpentSeconds: parseFloat(timeSpent.toFixed(1))
    };

    const updatedResults = [...roundResults, newResult];
    setRoundResults(updatedResults);

    // Delay for visual feedback before proceeding or ending
    setTimeout(() => {
      if (nextHearts <= 0 || currentIndex + 1 >= questions.length) {
        endRound(nextScore, activeCategory);
      } else {
        setCurrentIndex(prev => prev + 1);
        setIsAnswered(false);
        setSelectedOptionId(null);
        setTimeLeft(10.0);
        startTimeRef.current = Date.now();
      }
    }, isCorrect ? 900 : 1200);
  }, [isAnswered, currentQuestion, activeCategory, score, hearts, currentIndex, questions.length, roundResults, endRound]);

  // 10.0s Timer loop
  useEffect(() => {
    if (phase !== 'in_game' || isAnswered) return;

    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const remaining = Math.max(0, 10.0 - elapsed);
      setTimeLeft(parseFloat(remaining.toFixed(1)));

      if (remaining <= 0) {
        handleAnswer(null); // Timeout fail
      }
    }, 50);

    return () => clearTimer();
  }, [phase, currentIndex, isAnswered, handleAnswer]);

  const startTrivia = (cat: TriviaCategory) => {
    const roundQuestions = generateTriviaRound(cat);
    setActiveCategory(cat);
    setQuestions(roundQuestions);
    setCurrentIndex(0);
    setHearts(3);
    setScore(0);
    setTimeLeft(10.0);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setRoundResults([]);
    setPhase('in_game');
  };

  const returnToCategorySelect = () => {
    clearTimer();
    setPhase('category_select');
    setActiveCategory(null);
  };

  return {
    phase,
    activeCategory,
    currentQuestion,
    currentIndex,
    totalQuestions: questions.length,
    hearts,
    score,
    timeLeft,
    isAnswered,
    selectedOptionId,
    roundResults,
    leaderboard,
    allStats,
    startTrivia,
    handleAnswer,
    returnToCategorySelect
  };
};
