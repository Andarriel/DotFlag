import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { User } from '../types';
import {
  getSessionUser,
  loginRequest,
  logoutRequest,
  registerRequest,
  requestPasswordReset,
  type ApiError,
} from '../utils/authApi';

type AuthContextValue = {
  user: User | null;
  isSessionLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const isAuthError = (error: unknown): error is ApiError => {
  return Boolean(error && typeof error === 'object' && 'status' in error);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    setIsSessionLoading(true);
    try {
      const sessionUser = await getSessionUser();
      setUser(sessionUser);
    } finally {
      setIsSessionLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const login = useCallback(async (email: string, password: string) => {
    const loginUser = await loginRequest(email, password);
    if (loginUser) {
      setUser(loginUser);
      return;
    }

    await refreshSession();
  }, [refreshSession]);

  const register = useCallback(async (username: string, email: string, password: string) => {
    const registerUser = await registerRequest(username, email, password);
    if (registerUser) {
      setUser(registerUser);
      return;
    }

    await refreshSession();
  }, [refreshSession]);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch (error) {
      if (isAuthError(error) && error.status !== 401 && error.status !== 403) {
        throw error;
      }
    } finally {
      setUser(null);
    }
  }, []);

  const requestReset = useCallback(async (email: string) => {
    await requestPasswordReset(email);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isSessionLoading,
    login,
    register,
    logout,
    requestPasswordReset: requestReset,
    refreshSession,
  }), [user, isSessionLoading, login, register, logout, requestReset, refreshSession]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
