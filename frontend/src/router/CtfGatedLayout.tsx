import { Outlet } from 'react-router-dom';
import CtfGate from '../components/ctf/CtfGate';

export default function CtfGatedLayout() {
  return (
    <CtfGate>
      <Outlet />
    </CtfGate>
  );
}
