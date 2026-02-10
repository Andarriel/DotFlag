import { MOCK_LEADERBOARD, MOCK_USER, MOCK_TEAM_PROGRESS } from '../data/mockData';

export function useLeaderboard() {
  const currentUserRank = MOCK_LEADERBOARD.find(entry => entry.id === MOCK_USER.id);

  const maxPoints = Math.max(
    ...MOCK_TEAM_PROGRESS.flatMap(team => team.progress.map(p => p.points))
  );

  return {
    leaderboard: MOCK_LEADERBOARD,
    currentUser: MOCK_USER,
    currentUserRank,
    teamProgress: MOCK_TEAM_PROGRESS,
    maxPoints,
  };
}
