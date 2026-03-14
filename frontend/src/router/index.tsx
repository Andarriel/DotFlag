import { createBrowserRouter } from 'react-router-dom';
import AppProvider from '../layouts/AppProvider';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import HomePage from '../pages/HomePage';
import DashboardPage from '../pages/DashboardPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import NotFoundPage from '../pages/NotFoundPage';
import ChallengePage from '../pages/ChallengePage';
import ChallengeDetailPage from '../pages/ChallengeDetailPage';
import LeaderboardPage from '../pages/LeaderboardPage';
import AdminPage from '../pages/AdminPage';
import TeamPage from '../pages/TeamPage';
import ProfilePage from '../pages/ProfilePage';
import AboutPage from '../pages/AboutPage';
import ServerErrorPage from '../pages/ServerErrorPage';
import { ProtectedRoute } from './ProtectedRoute';
import { ROUTES, ROUTE_SEGMENTS } from './paths';

export const router = createBrowserRouter([
  {
    element: <AppProvider />,
    children: [
      {
        path: ROUTES.HOME,
        element: <MainLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: ROUTE_SEGMENTS.LEADERBOARD, element: <LeaderboardPage /> },
          { path: ROUTE_SEGMENTS.ABOUT, element: <AboutPage /> },
          { path: ROUTE_SEGMENTS.PROFILE, element: <ProfilePage /> },
          {
            element: <ProtectedRoute requiredRole="Admin" />,
            children: [
              { path: ROUTE_SEGMENTS.ADMIN, element: <AdminPage /> },
            ],
          },
          {
            element: <ProtectedRoute requiredRole="User" />,
            children: [
              { path: ROUTE_SEGMENTS.DASHBOARD, element: <DashboardPage /> },
              { path: ROUTE_SEGMENTS.CHALLENGES, element: <ChallengePage /> },
              { path: ROUTE_SEGMENTS.CHALLENGE_DETAIL, element: <ChallengeDetailPage /> },
              { path: ROUTE_SEGMENTS.TEAM, element: <TeamPage /> },
            ],
          },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          { path: ROUTES.LOGIN, element: <LoginPage /> },
          { path: ROUTES.REGISTER, element: <RegisterPage /> },
        ],
      },
      { path: ROUTES.NOT_FOUND, element: <NotFoundPage /> },
    ],
  },
  { path: ROUTES.SERVER_ERROR, element: <ServerErrorPage /> },
]);
