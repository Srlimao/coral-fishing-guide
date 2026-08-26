import { TriviaCategory, TriviaItem, TriviaQuestion } from './types';
import { getItemsByCategory } from '../../data/triviaItemsData';

/**
 * Extracts meaningful keyword tokens from an item name (min length 3)
 */
function getItemTokens(name: string): string[] {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 3);
}

/**
 * Calculates similarity between two items in the same category
 * to generate challenging, confusing distractors (50% harder quiz).
 */
function calculateItemSimilarity(target: TriviaItem, candidate: TriviaItem): number {
  if (target.id === candidate.id) return -1;

  let score = 0;
  const targetTokens = getItemTokens(target.englishName);
  const candidateTokens = getItemTokens(candidate.englishName);

  // 1. Shared word tokens (e.g., 'moth', 'beetle', 'skull', 'coffee', 'beer', 'jam')
  const shared = targetTokens.filter(t => candidateTokens.includes(t));
  score += shared.length * 12;

  // 2. Substring containment (e.g. 'Coffee' in 'Gesha Coffee')
  const targetLower = target.englishName.toLowerCase();
  const candidateLower = candidate.englishName.toLowerCase();
  if (targetLower.includes(candidateLower) || candidateLower.includes(targetLower)) {
    score += 8;
  }

  // 3. Similar name length
  const lenDiff = Math.abs(target.englishName.length - candidate.englishName.length);
  score += Math.max(0, 4 - lenDiff * 0.2);

  // 4. Add small random jitter (0 to 2) so different runs have variety among top similar candidates
  score += Math.random() * 2;

  return score;
}

export const generateTriviaRound = (category: TriviaCategory): TriviaQuestion[] => {
  const categoryItems = getItemsByCategory(category);
  if (categoryItems.length === 0) {
    return [];
  }

  // Shuffle category items to pick 15 targets
  const shuffledItems = [...categoryItems].sort(() => Math.random() - 0.5);

  const selectedTargets: TriviaItem[] = [];
  for (let i = 0; i < 15; i++) {
    const item = shuffledItems[i % shuffledItems.length];
    selectedTargets.push(item);
  }

  const questions: TriviaQuestion[] = selectedTargets.map((target, idx) => {
    // Score all candidates by similarity
    const candidates = categoryItems.filter(item => item.id !== target.id);
    const scoredCandidates = candidates.map(item => ({
      item,
      score: calculateItemSimilarity(target, item)
    }));

    // Sort by similarity descending
    scoredCandidates.sort((a, b) => b.score - a.score);

    // Pick top 3 similar distractors
    const distractors: TriviaItem[] = scoredCandidates.slice(0, 3).map(s => s.item);

    // Combine target + 3 distractors and shuffle
    const options = [target, ...distractors].sort(() => Math.random() - 0.5);

    return {
      id: `q_${category}_${idx}_${target.id}`,
      targetItem: target,
      options,
      correctOptionId: target.id
    };
  });

  return questions;
};
