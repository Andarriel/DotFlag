import type { AxiosInstance } from 'axios';
import type { LeaderboardEntry, TeamProgress } from '../types';

export const leaderboardService = {
  getPlayers: (api: AxiosInstance) =>
    api.get<LeaderboardEntry[]>('/leaderboard').then(res => res.data),

  getTeamProgress: (api: AxiosInstance) =>
    api.get<TeamProgress[]>('/leaderboard/teams').then(res => res.data),
};
