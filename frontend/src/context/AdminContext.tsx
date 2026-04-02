import { createContext, useContext, type ReactNode } from 'react';
import { useAdmin } from '../hooks/useAdmin';

type AdminContextType = ReturnType<typeof useAdmin>;

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const admin = useAdmin();
  return (
    <AdminContext.Provider value={admin}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdminContext must be used within AdminProvider');
  return ctx;
};
