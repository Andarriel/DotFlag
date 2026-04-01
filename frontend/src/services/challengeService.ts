import type { AxiosInstance } from 'axios';
import type {
  ApiChallenge,
  CreateChallengePayload,
  UpdateChallengePayload,
  ActionResponse,
} from '../types/api';

export const challengeService = {
  getAll: (api: AxiosInstance) =>
    api.get<ApiChallenge[]>('/challenges').then(res => res.data),

  getById: (api: AxiosInstance, id: number) =>
    api.get<ApiChallenge>(`/challenges/${id}`).then(res => res.data),

  create: (api: AxiosInstance, data: CreateChallengePayload) =>
    api.post<ActionResponse>('/challenges', data).then(res => res.data),

  update: (api: AxiosInstance, id: number, data: UpdateChallengePayload) =>
    api.put<ActionResponse>(`/challenges/${id}`, data).then(res => res.data),

  delete: (api: AxiosInstance, id: number) =>
    api.delete<ActionResponse>(`/challenges/${id}`).then(res => res.data),

  submitFlag: (api: AxiosInstance, challengeId: number, flag: string) =>
    api.post<ActionResponse>(`/challenges/${challengeId}/submit`, { flag }).then(res => res.data),
};
