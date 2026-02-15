import { createContext, useContext, useState, useEffect, type ReactNode, useRef } from 'react';
import { authApi } from '../utils/authApi'; // Make sure this path is correct

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
  register: (data: any) => Promise<void>; // <--- This was missing in the Provider
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasCheckedSession = useRef(false);

  useEffect(() => {
    const checkSession = async () => {
      if (hasCheckedSession.current) return;
      hasCheckedSession.current = true;

      try {
        const response = await authApi.get('/auth/session');
        if (response.status === 200 && response.data.user) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.log('No active session');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.post('/auth/login', { email, password });
      if (response.status === 200) {
        setUser(response.data);
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Invalid credentials';
      throw new Error(errorMessage);
    }
  };

  // --- ADDED THIS FUNCTION ---
  const register = async (data: any) => {
    try {
      const response = await authApi.post('/auth/register', data);
      // If your backend auto-logs in after register, you can setUser here too:
      // if (response.data.user) setUser(response.data.user);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
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
      hasCheckedSession.current = false;
    }
  };

  // --- ADDED register TO THE VALUE OBJECT ---
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