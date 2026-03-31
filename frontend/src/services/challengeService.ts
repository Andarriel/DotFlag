import type { AxiosInstance } from 'axios';
import type { Challenge, ChallengeDetail, Submission } from '../types';

export const challengeService = {
  getAll: (api: AxiosInstance) =>
    api.get<Challenge[]>('/challenges').then(res => res.data),

  getById: (api: AxiosInstance, id: number) =>
    api.get<ChallengeDetail>(`/challenges/${id}`).then(res => res.data),

  submitFlag: (api: AxiosInstance, challengeId: number, flag: string) =>
    api.post<{ isCorrect: boolean; message: string }>(`/challenges/${challengeId}/submit`, { flag }).then(res => res.data),

  getSubmissions: (api: AxiosInstance, challengeId: number) =>
    api.get<Submission[]>(`/challenges/${challengeId}/submissions`).then(res => res.data),
};
