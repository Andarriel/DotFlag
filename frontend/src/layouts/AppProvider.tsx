import { Outlet } from 'react-router-dom';
import { AxiosProvider } from '../context/AxiosContext';
import { TeamProvider } from '../context/TeamContext';
import { CtfStatusProvider } from '../context/CtfStatusContext';
import { useHealthCheck } from '../hooks/useHealthCheck';

function HealthGate({ children }: { children: React.ReactNode }) {
  useHealthCheck();
  return <>{children}</>;
}

export default function AppProvider() {
  return (
    <AxiosProvider>
      <CtfStatusProvider>
        <TeamProvider>
          <HealthGate>
            <Outlet />
          </HealthGate>
        </TeamProvider>
      </CtfStatusProvider>
    </AxiosProvider>
  );
}
