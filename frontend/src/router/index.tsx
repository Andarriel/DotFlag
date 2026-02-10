import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';
import ChallengePage from '../pages/ChallengePage';
import LeaderboardPage from '../pages/LeaderboardPage';
import { ROUTES, ROUTE_SEGMENTS } from './paths';

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: ROUTE_SEGMENTS.CHALLENGES, element: <ChallengePage /> },
      { path: ROUTE_SEGMENTS.LEADERBOARD, element: <LeaderboardPage /> },
    ]
  },
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />
  },
  {
    path: ROUTES.NOT_FOUND,
    element: <NotFoundPage />
  }
]);