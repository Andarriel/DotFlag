import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { UserRole } from '../types';

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
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; username?: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('mock_user');
    if (storedUser) setUser(JSON.parse(storedUser));
    setIsLoading(false);
  }, []);

  const persistUser = (u: AuthUser) => {
    setUser(u);
    localStorage.setItem('mock_user', JSON.stringify(u));
  };

  const login = async (email: string, _password: string) => {
    await new Promise(r => setTimeout(r, 500));
    persistUser({ id: 1, email, username: email.split('@')[0], role: 'Owner', currentPoints: 1337, teamId: 1, teamName: 'Cyber Elite' });
  };

  const register = async (data: { email: string; username?: string }) => {
    await new Promise(r => setTimeout(r, 500));
    persistUser({ id: Date.now(), email: data.email, username: data.username || data.email.split('@')[0], role: 'User', currentPoints: 0 });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mock_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
