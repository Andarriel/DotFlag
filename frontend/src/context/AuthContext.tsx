import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authApi } from '../utils/authApi';

interface User {
  id: number;
  email: string;
  username: string;
  role: 'Owner' | 'Admin' | 'Moderator' | 'Coach' | 'User' | 'Guest';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('🔄 Checking for existing session...');
        const response = await authApi.get('/auth/session');
        console.log('✅ Session response:', response.data);
        
        if (response.status === 200 && response.data.user) {
          setUser(response.data.user);
          console.log('✅ User loaded from session:', response.data.user);
        }
      } catch (error) {
        console.log('❌ No active session');
      } finally {
        setIsLoading(false);
        console.log('✅ Loading complete');
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.post('/auth/login', { email, password });
      if (response.status === 200) {
        console.log('✅ Login successful, user data:', response.data);
        setUser(response.data);
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Invalid credentials or server error.';
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await authApi.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
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