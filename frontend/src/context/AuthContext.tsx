import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';
import type { UserRole } from '../types';
import type { ApiUser, LoginResponse } from '../types/api';
import { USE_MOCK } from '../config';

interface AuthUser {
  id: number;
  email: string;
  username: string;
  role: UserRole;
  currentPoints?: number;
}

interface AuthContextType {
  user: AuthUser | null;
  updateUser: (updates: Partial<AuthUser>) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; username: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function toAuthUser(user: ApiUser): AuthUser {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
    currentPoints: user.currentPoints,
  };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (USE_MOCK) {
      const storedUser = localStorage.getItem('mock_user');
      if (storedUser) setUser(JSON.parse(storedUser));
      setIsLoading(false);
      return;
    }

    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      try {
        const payload = JSON.parse(atob(storedToken.split('.')[1]));
        setUser({
          id: parseInt(payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']),
          email: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
          username: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
          role: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] as UserRole,
        });
      } catch {
        localStorage.removeItem('token');
        setToken(null);
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  const persistAuth = (authUser: AuthUser, authToken?: string) => {
    setUser(authUser);
    if (USE_MOCK) {
      localStorage.setItem('mock_user', JSON.stringify(authUser));
    } else if (authToken) {
      setToken(authToken);
      localStorage.setItem('token', authToken);
    }
  };

  const login = async (email: string, password: string) => {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 500));
      persistAuth({ id: 1, email, username: email.split('@')[0], role: 'Admin', currentPoints: 1337 });
      return;
    }

    const res = await axios.post<LoginResponse>('/api/auth/login', { email, password });
    persistAuth(toAuthUser(res.data.user), res.data.token);
  };

  const register = async (data: { email: string; username: string; password: string }) => {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 500));
      persistAuth({ id: Date.now(), email: data.email, username: data.username, role: 'User', currentPoints: 0 });
      return;
    }

    await axios.post('/api/auth/register', data);
    const loginRes = await axios.post<LoginResponse>('/api/auth/login', {
      email: data.email,
      password: data.password,
    });
    persistAuth(toAuthUser(loginRes.data.user), loginRes.data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('mock_user');
    localStorage.removeItem('token');
  };

  const updateUser = (updates: Partial<AuthUser>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      if (USE_MOCK) {
        localStorage.setItem('mock_user', JSON.stringify(updated));
      }
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, updateUser, isAuthenticated: !!user, isLoading, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
