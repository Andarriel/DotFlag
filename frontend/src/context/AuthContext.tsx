import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
  id: number;
  email: string;
  username: string;
  role: 'Owner' | 'Admin' | 'Moderator' | 'Coach' | 'User' | 'Guest';
  currentPoints?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('mock_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockUser: User = {
      id: 1,
      email,
      username: email.split('@')[0],
      role: 'Owner',
      currentPoints: 1000
    };

    setUser(mockUser);
    localStorage.setItem('mock_user', JSON.stringify(mockUser));
  };

  const register = async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockUser: User = {
      id: Date.now(),
      email: data.email,
      username: data.username || data.email.split('@')[0],
      role: 'User',
      currentPoints: 0
    };

    setUser(mockUser);
    localStorage.setItem('mock_user', JSON.stringify(mockUser));
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
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};