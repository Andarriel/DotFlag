import type { User } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

const buildUrl = (path: string) => {
  const base = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
};

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const readErrorMessage = async (response: Response): Promise<string> => {
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    try {
      const data = (await response.json()) as { message?: string };
      if (data?.message) {
        return data.message;
      }
    } catch {
      // Ignore JSON parsing errors 
    }
  }

  const text = await response.text();
  return text || response.statusText || 'Request failed.';
};

const requestJson = async <T>(path: string, options: RequestInit = {}): Promise<T | null> => {
  const response = await fetch(buildUrl(path), {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : null),
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new ApiError(await readErrorMessage(response), response.status);
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  if (!text) {
    return null;
  }

  return JSON.parse(text) as T;
};

export const getSessionUser = async (): Promise<User | null> => {
  const response = await fetch(buildUrl('/api/auth/me'), {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  });

  if (response.status === 401 || response.status === 403) {
    return null;
  }

  if (!response.ok) {
    throw new ApiError(await readErrorMessage(response), response.status);
  }

  return (await response.json()) as User;
};

export const loginRequest = async (email: string, password: string): Promise<User | null> => {
  return requestJson<User>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const registerRequest = async (
  username: string,
  email: string,
  password: string
): Promise<User | null> => {
  return requestJson<User>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  });
};

export const logoutRequest = async (): Promise<void> => {
  await requestJson('/api/auth/logout', {
    method: 'POST',
  });
};

export const requestPasswordReset = async (email: string): Promise<void> => {
  await requestJson('/api/auth/forgot', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

export type { ApiError };
