import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { useAxios } from './AxiosContext';
import { ctfEventService } from '../services/ctfEventService';
import type { ApiCtfStatus } from '../types/api';

interface CtfStatusContextType {
  status: ApiCtfStatus | null;
  loading: boolean;
  refresh: () => void;
}

const CtfStatusContext = createContext<CtfStatusContextType | undefined>(undefined);

export function CtfStatusProvider({ children }: { children: ReactNode }) {
  const api = useAxios();
  const [status, setStatus] = useState<ApiCtfStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    ctfEventService.getStatus(api)
      .then(setStatus)
      .catch(() => setStatus(null))
      .finally(() => setLoading(false));
  }, [api]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 30_000);
    return () => clearInterval(interval);
  }, [refresh]);

  return (
    <CtfStatusContext.Provider value={{ status, loading, refresh }}>
      {children}
    </CtfStatusContext.Provider>
  );
}

export function useCtfStatus() {
  const ctx = useContext(CtfStatusContext);
  if (!ctx) throw new Error('useCtfStatus must be used within a CtfStatusProvider');
  return ctx;
}
