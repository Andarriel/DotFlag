import { useState, useEffect } from 'react';
import { MOCK_LEADERBOARD, MOCK_USER, MOCK_TEAM_PROGRESS } from '../data/mockData';
import { leaderboardService } from '../services/leaderboardService';
import { useAxios } from '../context/AxiosContext';
import { useAuth } from '../context/AuthContext';
import { USE_MOCK } from '../config';
import type { ApiLeaderboardEntry } from '../types/api';
import type { LeaderboardEntry } from '../types';

function mapApiEntry(api: ApiLeaderboardEntry): LeaderboardEntry {
  return {
    id: api.userId,
    username: api.username,
    email: '',
    role: 'User',
    currentPoints: api.score,
    rank: api.rank,
    solvedChallenges: api.solvesCount,
    lastSolveTime: api.lastSolveAt,
  };
}

export function useLeaderboard() {
  const api = useAxios();
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(USE_MOCK ? MOCK_LEADERBOARD : []);
  const [loading, setLoading] = useState(!USE_MOCK);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (USE_MOCK) return;
    setLoading(true);
    leaderboardService.getAll(api)
      .then(data => setLeaderboard(data.map(mapApiEntry)))
      .catch(err => setError(err?.message ?? 'Failed to load leaderboard'))
      .finally(() => setLoading(false));
  }, [api]);

  const currentUser = USE_MOCK ? MOCK_USER : user;
  const currentUserRank = currentUser ? leaderboard.find(entry => entry.id === currentUser.id) : undefined;

  const maxPoints = Math.max(
    ...MOCK_TEAM_PROGRESS.flatMap(team => team.progress.map(p => p.points))
  );

  return {
    leaderboard,
    currentUser,
    currentUserRank,
    teamProgress: MOCK_TEAM_PROGRESS,
    maxPoints,
    loading,
    error,
  };
}
