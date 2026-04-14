import { useState, useEffect } from 'react';
import { MOCK_LEADERBOARD, MOCK_USER, MOCK_TEAM_PROGRESS } from '../data/mockData';
import { leaderboardService } from '../services/leaderboardService';
import { useAxios } from '../context/AxiosContext';
import { useAuth } from '../context/AuthContext';
import { USE_MOCK } from '../config';
import type { ApiLeaderboardEntry, ApiLeaderboardProgress, ApiTeamLeaderboardEntry } from '../types/api';
import type { LeaderboardEntry, TeamProgress } from '../types';

const PLAYER_COLORS = [
  '#818cf8', '#a78bfa', '#f472b6', '#fb923c', '#34d399',
  '#22d3ee', '#facc15', '#f87171', '#38bdf8', '#c084fc',
];

function buildProgressChart(progress: ApiLeaderboardProgress[]): TeamProgress[] {
  const sorted = [...progress].sort((a, b) => {
    const aMax = a.progress.length > 0 ? a.progress[a.progress.length - 1].points : 0;
    const bMax = b.progress.length > 0 ? b.progress[b.progress.length - 1].points : 0;
    return bMax - aMax;
  }).slice(0, 10);

  const allTimestamps = progress.flatMap(p => p.progress.map(pt => new Date(pt.timestamp).getTime()));
  const earliest = allTimestamps.length > 0 ? new Date(Math.min(...allTimestamps) - 60000).toISOString() : new Date().toISOString();

  return sorted.map((p, i) => {
    const origin = { timestamp: earliest, points: 0, challengeName: undefined, challengePoints: undefined };
    const points = p.progress.map(pt => ({
      timestamp: pt.timestamp,
      points: pt.points,
      challengeName: pt.challengeName,
      challengePoints: pt.challengePoints,
    }));

    return {
      teamId: p.userId,
      teamName: p.username,
      color: PLAYER_COLORS[i % PLAYER_COLORS.length],
      progress: [origin, ...points],
    };
  });
}

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

export interface TeamLeaderboardEntry {
  rank: number;
  teamId: number;
  teamName: string;
  score: number;
  solvesCount: number;
  memberCount: number;
  lastSolveAt: string;
}

function mapTeamEntry(api: ApiTeamLeaderboardEntry): TeamLeaderboardEntry {
  return {
    rank: api.rank,
    teamId: api.teamId,
    teamName: api.teamName,
    score: api.score,
    solvesCount: api.solvesCount,
    memberCount: api.memberCount,
    lastSolveAt: api.lastSolveAt,
  };
}

export function useLeaderboard() {
  const api = useAxios();
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(USE_MOCK ? MOCK_LEADERBOARD : []);
  const [teamLeaderboard, setTeamLeaderboard] = useState<TeamLeaderboardEntry[]>([]);
  const [playerProgress, setPlayerProgress] = useState<TeamProgress[]>(USE_MOCK ? MOCK_TEAM_PROGRESS : []);
  const [teamProgress, setTeamProgress] = useState<TeamProgress[]>([]);
  const [loading, setLoading] = useState(!USE_MOCK);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (USE_MOCK) return;
    setLoading(true);
    Promise.all([
      leaderboardService.getAll(api),
      leaderboardService.getProgress(api),
      leaderboardService.getTeams(api),
      leaderboardService.getTeamProgress(api),
    ])
      .then(([entries, progress, teams, tProgress]) => {
        setLeaderboard(entries.map(mapApiEntry));
        setTeamLeaderboard(teams.map(mapTeamEntry));
        setPlayerProgress(buildProgressChart(progress));
        setTeamProgress(buildProgressChart(tProgress));
      })
      .catch(err => setError(err?.message ?? 'Failed to load leaderboard'))
      .finally(() => setLoading(false));
  }, [api]);

  const currentUser = USE_MOCK ? MOCK_USER : user;
  const currentUserRank = currentUser ? leaderboard.find(entry => entry.id === currentUser.id) : undefined;

  return {
    leaderboard,
    teamLeaderboard,
    currentUser,
    currentUserRank,
    playerProgress,
    teamProgress,
    loading,
    error,
  };
}
