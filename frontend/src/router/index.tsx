import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import PrivateRoute from '../components/common/PrivateRoute';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import NotFoundPage from '../pages/NotFoundPage';
import ChallengePage from '../pages/ChallengePage';
import LeaderboardPage from '../pages/LeaderboardPage';
import { ROUTES, ROUTE_SEGMENTS } from './paths';

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <MainLayout />,
    children: 
    [
      { index: true, element: <HomePage /> },
      {
        element: <PrivateRoute />,
        children: 
        [
          { path: ROUTE_SEGMENTS.CHALLENGES, element: <ChallengePage /> },
        ]
      },
      { path: ROUTE_SEGMENTS.LEADERBOARD, element: <LeaderboardPage /> },
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
