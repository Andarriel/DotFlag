import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import PrivateRoute from '../components/common/PrivateRoute';
import HomePage from '../pages/HomePage';
import DashboardPage from '../pages/DashboardPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import NotFoundPage from '../pages/NotFoundPage';
import ChallengePage from '../pages/ChallengePage';
import LeaderboardPage from '../pages/LeaderboardPage';
import AboutPage from '../pages/AboutPage';
import { ProtectedRoute } from './ProtectedRoute';
import { ROUTES, ROUTE_SEGMENTS } from './paths';


export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <MainLayout />,
    children: 
    [
      // Public routes
      { index: true, element: <HomePage /> },
      { path: ROUTE_SEGMENTS.LEADERBOARD, element: <LeaderboardPage /> },
      { path: ROUTE_SEGMENTS.ABOUT, element: <AboutPage /> },
      
      // Protected routes nested INSIDE MainLayout
      {
        element: <ProtectedRoute requiredRole="Admin" />,
        children: [
          { path: ROUTE_SEGMENTS.DASHBOARD, element: <DashboardPage /> }
        ]
      },
      {
        element: <ProtectedRoute requiredRole="User" />,
        children: [
          { path: ROUTE_SEGMENTS.CHALLENGES, element: <ChallengePage /> }
        ]
      },
    ]
  },
  {
    element: <AuthLayout />,
    children: 
    [
      { path: ROUTES.LOGIN, element: <LoginPage /> },
      { path: ROUTES.REGISTER, element: <RegisterPage /> },
    ]
  },
  {
    path: ROUTES.NOT_FOUND,
    element: <NotFoundPage />
  }
]);