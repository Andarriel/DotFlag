import { useState, useEffect } from 'react';
import { MOCK_CHALLENGES } from '../data/mockData';
import { filterChallenges, calculateChallengeStats } from '../utils/challengeUtils';
import { challengeService } from '../services/challengeService';
import { useAxios } from '../context/AxiosContext';
import { useAuth } from '../context/AuthContext';
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
    isSolved: api.isSolved,
  };
}

export function useChallenges() {
  const api = useAxios();
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin' || user?.role === 'Owner';
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

  const visibleChallenges = isAdmin ? challenges : challenges.filter(c => c.isActive);
  const filteredChallenges = filterChallenges(visibleChallenges, selectedCategory, selectedDifficulty);
  const stats = calculateChallengeStats(visibleChallenges);

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
