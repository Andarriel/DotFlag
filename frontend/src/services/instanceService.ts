import type { AxiosInstance } from 'axios';
import type { ApiChallengeInstance, ActionResponse } from '../types/api';

export const instanceService = {
  getMyInstance: (api: AxiosInstance) =>
    api.get<ApiChallengeInstance>('/challenges/my-instance')
      .then(res => res.data)
      .catch(() => null as ApiChallengeInstance | null),

  get: (api: AxiosInstance, challengeId: number) =>
    api.get<ApiChallengeInstance>(`/challenges/${challengeId}/instance`).then(res => res.data),

  start: (api: AxiosInstance, challengeId: number) =>
    api.post<ApiChallengeInstance>(`/challenges/${challengeId}/instance`).then(res => res.data),

  stop: (api: AxiosInstance, challengeId: number) =>
    api.delete<ActionResponse>(`/challenges/${challengeId}/instance`).then(res => res.data),

  restart: (api: AxiosInstance, challengeId: number) =>
    api.post<ActionResponse>(`/challenges/${challengeId}/instance/restart`).then(res => res.data),
};
