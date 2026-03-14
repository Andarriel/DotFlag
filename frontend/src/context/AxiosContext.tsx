import { createContext, useContext, useMemo, type ReactNode } from 'react';
import axios, { type AxiosInstance } from 'axios';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../router/paths';

const AxiosContext = createContext<AxiosInstance | undefined>(undefined);

export const AxiosProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: '/api',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    instance.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    instance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (!error.response || error.code === 'ERR_NETWORK') {
          navigate(ROUTES.SERVER_ERROR);
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, [navigate]);

  return (
    <AxiosContext.Provider value={api}>
      {children}
    </AxiosContext.Provider>
  );
};

export const useAxios = (): AxiosInstance => {
  const context = useContext(AxiosContext);
  if (!context) {
    throw new Error('useAxios must be used within an AxiosProvider');
  }
  return context;
};
