import { useEffect } from 'react';
import { useAxios } from '../context/AxiosContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../router/paths';

export const useHealthCheck = () => {
  const api = useAxios();
  const navigate = useNavigate();

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await api.get('/health');
      } catch {
        navigate(ROUTES.SERVER_ERROR);
      }
    };

    checkHealth();
  }, [api, navigate]);
};
