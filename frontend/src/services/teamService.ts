import type { AxiosInstance } from 'axios';
import type { Team } from '../types';
import type { ActionResponse } from '../types/api';

export const teamService = {
  get: (api: AxiosInstance) =>
    api.get<Team>('/teams/my').then(res => res.data),

  create: (api: AxiosInstance, name: string) =>
    api.post<Team>('/teams', { name }).then(res => res.data),

  join: (api: AxiosInstance, inviteCode: string) =>
    api.post<ActionResponse>('/teams/join', { inviteCode }).then(res => res.data),

  leave: (api: AxiosInstance, teamId: number) =>
    api.post<ActionResponse>(`/teams/${teamId}/leave`).then(res => res.data),

  disband: (api: AxiosInstance, teamId: number) =>
    api.delete<ActionResponse>(`/teams/${teamId}`).then(res => res.data),

  regenerateInvite: (api: AxiosInstance, teamId: number) =>
    api.post<ActionResponse>(`/teams/${teamId}/regenerate-invite`).then(res => res.data),
};
