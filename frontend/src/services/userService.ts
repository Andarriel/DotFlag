import type { AxiosInstance } from 'axios';
import type { UserDto, UserRegisterDto, ActionResponse, AdminUser } from '../types/api';

export const userService = {
  getAll: (api: AxiosInstance) =>
    api.get<UserDto[]>('/users').then(res => res.data),

  getById: (api: AxiosInstance, id: number) =>
    api.get<UserDto>(`/users/${id}`).then(res => res.data),

  create: (api: AxiosInstance, data: UserRegisterDto) =>
    api.post<ActionResponse>('/users', data).then(res => res.data),

  update: (api: AxiosInstance, id: number, data: Partial<UserDto>) =>
    api.put<ActionResponse>(`/users/${id}`, data).then(res => res.data),

  delete: (api: AxiosInstance, id: number) =>
    api.delete<ActionResponse>(`/users/${id}`).then(res => res.data),
};
