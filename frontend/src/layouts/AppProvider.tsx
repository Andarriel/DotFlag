import { Outlet } from 'react-router-dom';
import { AxiosProvider } from '../context/AxiosContext';
import { useHealthCheck } from '../hooks/useHealthCheck';

function HealthGate({ children }: { children: React.ReactNode }) {
  useHealthCheck();
  return <>{children}</>;
}

export default function AppProvider() {
  return (
    <AxiosProvider>
      <HealthGate>
        <Outlet />
      </HealthGate>
    </AxiosProvider>
  );
}
