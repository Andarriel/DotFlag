import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';
import type { UserRole } from '../types';

// Toggle this to switch between mock and real backend
const USE_MOCK = true;

interface AuthUser {
  id: number;
  email: string;
  username: string;
  role: UserRole;
  currentPoints?: number;
  teamId?: number;
  teamName?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; username: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

    // Real backend: check stored token and validate
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
        })
        .finally(() => setIsLoading(false));
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
      persistAuth({ id: 1, email, username: email.split('@')[0], role: 'Admin', currentPoints: 1337, teamId: 1, teamName: 'Cyber Elite' });
      return;
    }

    const res = await axios.post('/api/auth/login', { email, password });
    persistAuth(res.data.user, res.data.token);
  };

  const register = async (data: { email: string; username: string; password: string }) => {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 500));
      persistAuth({ id: Date.now(), email: data.email, username: data.username, role: 'User', currentPoints: 0 });
      return;
    }

    const res = await axios.post('/api/auth/register', data);
    persistAuth(res.data.user, res.data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('mock_user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
