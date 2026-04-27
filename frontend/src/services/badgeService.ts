import type { AxiosInstance } from 'axios';
import type { ApiBadge, ActionResponse } from '../types/api';

export const badgeService = {
  getForUser: (api: AxiosInstance, userId: number) =>
    api.get<ApiBadge[]>(`/badges/user/${userId}`).then(r => r.data),

  award: (api: AxiosInstance, data: {
    userId: number;
    type: string;
    ctfEventId?: number | null;
    customName?: string;
    customColor?: string;
    customIcon?: string;
    note?: string;
    isManuallyAwarded?: boolean;
  }) => api.post<ActionResponse>('/badges/award', data).then(r => r.data),

  revoke: (api: AxiosInstance, badgeId: number) =>
    api.delete<ActionResponse>(`/badges/${badgeId}`).then(r => r.data),
};
