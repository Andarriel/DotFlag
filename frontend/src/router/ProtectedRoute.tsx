import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from './paths';

interface ProtectedRouteProps {
  requiredRole: 'Owner' | 'Admin' | 'Moderator' | 'Coach' | 'User' | 'Guest';
}

const roleHierarchy = ['Guest', 'User', 'Coach', 'Moderator', 'Admin', 'Owner'];

export const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  const userLevel = roleHierarchy.indexOf(user.role);
  const requiredLevel = roleHierarchy.indexOf(requiredRole);

  if (userLevel < requiredLevel) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
};