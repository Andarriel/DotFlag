import { useState } from 'react';
import { MOCK_CHALLENGES } from '../data/mockData';
import { filterChallenges, calculateChallengeStats } from '../utils/challengeUtils';
import type { ChallengeCategory, ChallengeDifficulty } from '../types';

export function useChallenges() {
  const [selectedCategory, setSelectedCategory] = useState<"All" | ChallengeCategory>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"All" | ChallengeDifficulty>("All");

  const filteredChallenges = filterChallenges(MOCK_CHALLENGES, selectedCategory, selectedDifficulty);
  const stats = calculateChallengeStats(MOCK_CHALLENGES);

  return {
    selectedCategory,
    setSelectedCategory,
    selectedDifficulty,
    setSelectedDifficulty,
    filteredChallenges,
    stats,
  };
}
