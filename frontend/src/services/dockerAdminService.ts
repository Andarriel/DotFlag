import type { AxiosInstance } from 'axios';
import type {
  ApiDockerContainer,
  ApiDockerSettings,
  ApiDockerPing,
  UpdateDockerSettingsPayload,
  ActionResponse,
} from '../types/api';

export const dockerAdminService = {
  getContainers: (api: AxiosInstance) =>
    api.get<ApiDockerContainer[]>('/admin/docker/containers').then(res => res.data),

  killContainer: (api: AxiosInstance, instanceId: number) =>
    api.delete<ActionResponse>(`/admin/docker/containers/${instanceId}`).then(res => res.data),

  restartContainer: (api: AxiosInstance, instanceId: number) =>
    api.post<ActionResponse>(`/admin/docker/containers/${instanceId}/restart`).then(res => res.data),

  getLogs: (api: AxiosInstance, instanceId: number) =>
    api.get<{ logs: string }>(`/admin/docker/containers/${instanceId}/logs`).then(res => res.data),

  getSettings: (api: AxiosInstance) =>
    api.get<ApiDockerSettings>('/admin/docker/settings').then(res => res.data),

  updateSettings: (api: AxiosInstance, data: UpdateDockerSettingsPayload) =>
    api.put<ActionResponse>('/admin/docker/settings', data).then(res => res.data),

  ping: (api: AxiosInstance) =>
    api.get<ApiDockerPing>('/admin/docker/ping').then(res => res.data),

  getImages: (api: AxiosInstance) =>
    api.get<string[]>('/admin/docker/images').then(res => res.data),
};
