import type { AxiosInstance } from 'axios';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
    currentPoints: number;
    teamId?: number;
  };
}

export const authService = {
  login: (api: AxiosInstance, data: LoginRequest) =>
    api.post<AuthResponse>('/auth/login', data).then(res => res.data),

  register: (api: AxiosInstance, data: RegisterRequest) =>
    api.post<AuthResponse>('/auth/register', data).then(res => res.data),

  me: (api: AxiosInstance) =>
    api.get<AuthResponse['user']>('/auth/me').then(res => res.data),
};
