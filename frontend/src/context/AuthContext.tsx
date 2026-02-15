import { createContext, useContext, useState, type ReactNode } from 'react';
import { authApi } from '../utils/authApi'; // We will use a dedicated API utility

interface User {
  id: number;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.post('/auth/login', { email, password });
      if (response.status === 200) {
        setUser(response.data);
      } else {
        // The error message will be caught by the calling function
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      // Re-throw the error so the LoginPage can display it
      const errorMessage = error.response?.data?.message || 'Invalid credentials or server error.';
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    authApi.post('/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
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