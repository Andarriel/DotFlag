import type { AxiosInstance } from 'axios';
import type { LoginRequest, RegisterRequest, LoginResponse, ActionResponse } from '../types/api';

export const authService = {
  login: (api: AxiosInstance, data: LoginRequest) =>
    api.post<LoginResponse>('/auth/login', data).then(res => res.data),

  register: (api: AxiosInstance, data: RegisterRequest) =>
    api.post<ActionResponse>('/auth/register', data).then(res => res.data),
};
