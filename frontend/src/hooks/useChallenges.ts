import { useState, useEffect } from 'react';
import { MOCK_CHALLENGES } from '../data/mockData';
import { filterChallenges, calculateChallengeStats } from '../utils/challengeUtils';
import { challengeService } from '../services/challengeService';
import { useAxios } from '../context/AxiosContext';
import { USE_MOCK } from '../config';
import type { ApiChallenge } from '../types/api';
import type { Challenge, ChallengeCategory, ChallengeDifficulty } from '../types';

const DIFFICULTY_MAP: Record<string, ChallengeDifficulty> = {
  Easy: 'Easy', Medium: 'Medium', Hard: 'Hard', Impossible: 'Hard',
};

function mapChallenge(api: ApiChallenge): Challenge {
  return {
    id: api.id,
    title: api.name,
    description: api.description,
    points: api.currentPoints,
    category: (api.category as unknown as string) as ChallengeCategory,
    difficulty: DIFFICULTY_MAP[api.difficulty as unknown as string] ?? 'Medium',
    isActive: api.isActive,
    isSolved: false,
  };
}

export function useChallenges() {
  const api = useAxios();
  const [challenges, setChallenges] = useState<Challenge[]>(USE_MOCK ? MOCK_CHALLENGES : []);
  const [loading, setLoading] = useState(!USE_MOCK);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'All' | ChallengeCategory>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | ChallengeDifficulty>('All');

  useEffect(() => {
    if (USE_MOCK) return;
    setLoading(true);
    challengeService.getAll(api)
      .then(data => setChallenges(data.map(mapChallenge)))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [api]);

  const filteredChallenges = filterChallenges(challenges, selectedCategory, selectedDifficulty);
  const stats = calculateChallengeStats(challenges);

  return {
    challenges,
    selectedCategory,
    setSelectedCategory,
    selectedDifficulty,
    setSelectedDifficulty,
    filteredChallenges,
    stats,
    loading,
    error,
  };
}
