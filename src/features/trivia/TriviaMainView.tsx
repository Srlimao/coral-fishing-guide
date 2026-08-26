import React from 'react';
import { useTriviaGame } from './useTriviaGame';
import { TriviaCategorySelect } from './TriviaCategorySelect';
import { TriviaQuestionCard } from './TriviaQuestionCard';
import { TriviaResultsModal } from './TriviaResultsModal';

export const TriviaMainView: React.FC = () => {
  const {
    phase,
    activeCategory,
    currentQuestion,
    currentIndex,
    totalQuestions,
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
  } = useTriviaGame();

  if (phase === 'category_select' || !activeCategory) {
    return (
      <TriviaCategorySelect
        allStats={allStats}
        onSelectCategory={startTrivia}
      />
    );
  }

  if (phase === 'in_game' && currentQuestion) {
    return (
      <TriviaQuestionCard
        category={activeCategory}
        question={currentQuestion}
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
        hearts={hearts}
        score={score}
        timeLeft={timeLeft}
        isAnswered={isAnswered}
        selectedOptionId={selectedOptionId}
        onSelectOption={handleAnswer}
        onQuit={returnToCategorySelect}
      />
    );
  }

  return (
    <TriviaResultsModal
      category={activeCategory}
      score={score}
      results={roundResults}
      leaderboard={leaderboard}
      onPlayAgain={() => startTrivia(activeCategory)}
      onChooseCategory={returnToCategorySelect}
    />
  );
};
