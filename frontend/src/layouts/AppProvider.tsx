import { Outlet } from 'react-router-dom';
import { AxiosProvider } from '../context/AxiosContext';
import { TeamProvider } from '../context/TeamContext';
import { useHealthCheck } from '../hooks/useHealthCheck';

function HealthGate({ children }: { children: React.ReactNode }) {
  useHealthCheck();
  return <>{children}</>;
}

export default function AppProvider() {
  return (
    <AxiosProvider>
      <TeamProvider>
        <HealthGate>
          <Outlet />
        </HealthGate>
      </TeamProvider>
    </AxiosProvider>
  );
}
