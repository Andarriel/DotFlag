import type { AxiosInstance } from 'axios';
import type { ApiLeaderboardEntry } from '../types/api';

export const leaderboardService = {
  getAll: (api: AxiosInstance) =>
    api.get<ApiLeaderboardEntry[]>('/leaderboard').then(res => res.data),
};
