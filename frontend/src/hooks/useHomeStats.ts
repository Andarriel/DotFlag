import { MOCK_LEADERBOARD } from '../data/mockData';

export function useHomeStats() {
  const totalPlayers = MOCK_LEADERBOARD.length;
  const totalPoints = MOCK_LEADERBOARD.reduce((sum, e) => sum + e.currentPoints, 0);
  const totalSolved = MOCK_LEADERBOARD.reduce((sum, e) => sum + e.solvedChallenges, 0);

  return { totalPlayers, totalPoints, totalSolved };
}
