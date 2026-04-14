import type { AxiosInstance } from 'axios';
import type { ApiLeaderboardEntry, ApiLeaderboardProgress, ApiTeamLeaderboardEntry } from '../types/api';

export const leaderboardService = {
  getAll: (api: AxiosInstance) =>
    api.get<ApiLeaderboardEntry[]>('/leaderboard').then(res => res.data),

  getProgress: (api: AxiosInstance) =>
    api.get<ApiLeaderboardProgress[]>('/leaderboard/progress').then(res => res.data),

  getTeams: (api: AxiosInstance) =>
    api.get<ApiTeamLeaderboardEntry[]>('/leaderboard/teams').then(res => res.data),

  getTeamProgress: (api: AxiosInstance) =>
    api.get<ApiLeaderboardProgress[]>('/leaderboard/teams/progress').then(res => res.data),
};
