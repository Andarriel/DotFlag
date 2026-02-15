import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from './paths';
import { useState, useEffect } from 'react';

interface ProtectedRouteProps {
  requiredRole: 'Owner' | 'Admin' | 'Moderator' | 'Coach' | 'User' | 'Guest';
}

const roleHierarchy = ['Guest', 'User', 'Coach', 'Moderator', 'Admin', 'Owner'];

export const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [showAlert, setShowAlert] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  const userLevel = roleHierarchy.indexOf(user.role);
  const requiredLevel = roleHierarchy.indexOf(requiredRole);

  // DEBUG: This should show Owner=5, User=1, and hasAccess=true
  console.log('🔍 Access check:', {
    userRole: user.role,
    userLevel,
    requiredRole,
    requiredLevel,
    calculation: `${userLevel} >= ${requiredLevel}`,
    hasAccess: userLevel >= requiredLevel
  });

  // Owner (5) >= User (1) should be TRUE
  const hasAccess = userLevel >= requiredLevel;

  useEffect(() => {
    if (!hasAccess && !showAlert) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
        setShouldRedirect(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [hasAccess, showAlert]);

  if (!hasAccess) {
    return (
      <>
        {showAlert && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-slide-in">
            <div className="bg-red-500/90 backdrop-blur-sm border border-red-400 rounded-lg px-6 py-3 shadow-lg">
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-sm font-semibold text-white">
                  Access Denied - Requires <span className="font-bold">{requiredRole}</span> access.
                </p>
                <button
                  onClick={() => {
                    setShowAlert(false);
                    setShouldRedirect(true);
                  }}
                  className="text-white hover:text-red-100 flex-shrink-0"
                >
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
        {shouldRedirect && <Navigate to={ROUTES.HOME} replace />}
      </>
    );
  }

  return <Outlet />;
};