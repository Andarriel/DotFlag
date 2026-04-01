import type { AxiosInstance } from 'axios';
import type {
  ApiUser,
  CreateUserPayload,
  UpdateUserPayload,
  UpdateProfilePayload,
  ActionResponse,
} from '../types/api';

export const userService = {
  getAll: (api: AxiosInstance) =>
    api.get<ApiUser[]>('/users').then(res => res.data),

  getById: (api: AxiosInstance, id: number) =>
    api.get<ApiUser>(`/users/${id}`).then(res => res.data),

  create: (api: AxiosInstance, data: CreateUserPayload) =>
    api.post<ActionResponse>('/users', data).then(res => res.data),

  update: (api: AxiosInstance, id: number, data: UpdateUserPayload) =>
    api.put<ActionResponse>(`/users/${id}`, data).then(res => res.data),

  updateProfile: (api: AxiosInstance, id: number, data: UpdateProfilePayload) =>
    api.put<ActionResponse>(`/users/${id}/profile`, data).then(res => res.data),

  delete: (api: AxiosInstance, id: number) =>
    api.delete<ActionResponse>(`/users/${id}`).then(res => res.data),
};
