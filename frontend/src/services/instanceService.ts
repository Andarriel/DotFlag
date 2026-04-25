import type { AxiosInstance } from 'axios';
import type { ApiChallengeInstance, ActionResponse } from '../types/api';

export const instanceService = {
  get: (api: AxiosInstance, challengeId: number) =>
    api.get<ApiChallengeInstance>(`/challenges/${challengeId}/instance`).then(res => res.data),

  start: (api: AxiosInstance, challengeId: number) =>
    api.post<ApiChallengeInstance>(`/challenges/${challengeId}/instance`).then(res => res.data),

  stop: (api: AxiosInstance, challengeId: number) =>
    api.delete<ActionResponse>(`/challenges/${challengeId}/instance`).then(res => res.data),
};
