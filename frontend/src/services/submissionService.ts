import type { AxiosInstance } from 'axios';

export interface ApiSubmission {
  id: number;
  userId: number;
  challengeId: number;
  challengeName: string;
  username: string;
  isCorrect: boolean;
  bonusPoints: number;
  timestamp: string;
  challengeCurrentPoints: number;
  isChallengeActive: boolean;
}

export const submissionService = {
  getMy: (api: AxiosInstance) =>
    api.get<ApiSubmission[]>('/submissions/my').then(res => res.data),

  getRecent: (api: AxiosInstance, count = 20) =>
    api.get<ApiSubmission[]>(`/submissions/recent?count=${count}`).then(res => res.data),

  getByUser: (api: AxiosInstance, userId: number) =>
    api.get<ApiSubmission[]>(`/submissions/user/${userId}`).then(res => res.data),

  getAdminSolves: (api: AxiosInstance, userId: number) =>
    api.get<ApiSubmission[]>(`/submissions/admin/user/${userId}`).then(res => res.data),

  deleteSolve: (api: AxiosInstance, submissionId: number) =>
    api.delete<{ isSuccess: boolean; message: string }>(`/submissions/admin/${submissionId}`).then(res => res.data),
};
