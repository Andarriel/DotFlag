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

  clone: (api: AxiosInstance, id: number) =>
    api.post<ActionResponse>(`/challenges/${id}/clone`).then(res => res.data),

  submitFlag: (api: AxiosInstance, challengeId: number, flag: string) =>
    api.post<ActionResponse>(`/challenges/${challengeId}/submit`, { flag }).then(res => res.data),

  getSubmissions: (api: AxiosInstance, challengeId: number) =>
    api.get<{ id: number; userId: number; challengeId: number; isCorrect: boolean; timestamp: string }[]>(`/challenges/${challengeId}/submissions`).then(res => res.data),

  // Hints
  addHint: (api: AxiosInstance, challengeId: number, data: { content: string; order: number }) =>
    api.post<ActionResponse>(`/challenges/${challengeId}/hints`, data).then(res => res.data),

  removeHint: (api: AxiosInstance, challengeId: number, hintId: number) =>
    api.delete<ActionResponse>(`/challenges/${challengeId}/hints/${hintId}`).then(res => res.data),

  // Files
  uploadFile: (api: AxiosInstance, challengeId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<ActionResponse>(`/challenges/${challengeId}/files`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(res => res.data);
  },

  removeFile: (api: AxiosInstance, challengeId: number, fileId: number) =>
    api.delete<ActionResponse>(`/challenges/${challengeId}/files/${fileId}`).then(res => res.data),

  getFileDownloadUrl: (challengeId: number, fileId: number) =>
    `/api/challenges/${challengeId}/files/${fileId}/download`,
};
