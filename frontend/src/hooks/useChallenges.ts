import { useState, useEffect } from 'react';
import { MOCK_CHALLENGES } from '../data/mockData';
import { filterChallenges, calculateChallengeStats } from '../utils/challengeUtils';
import { challengeService } from '../services/challengeService';
import { useAxios } from '../context/AxiosContext';
import { USE_MOCK } from '../config';
import type { ApiChallenge } from '../types/api';
import type { Challenge, ChallengeCategory, ChallengeDifficulty } from '../types';

const CATEGORY_MAP: Record<number, ChallengeCategory> = {
  0: 'Web',
  1: 'Pwn',
  2: 'Crypto',
  3: 'Reverse',
  4: 'Forensics',
  5: 'Misc',
  6: 'OSINT',
};

function getDifficulty(maxPoints: number): ChallengeDifficulty {
  if (maxPoints <= 200) return 'Easy';
  if (maxPoints <= 400) return 'Medium';
  return 'Hard';
}

function mapChallenge(api: ApiChallenge): Challenge {
  return {
    id: api.id,
    title: api.name,
    description: api.description,
    points: api.currentPoints,
    category: CATEGORY_MAP[api.category] ?? 'Misc',
    difficulty: getDifficulty(api.maxPoints),
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
