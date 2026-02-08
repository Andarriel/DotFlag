import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';
import ChallengePage from '../pages/ChallengePage';
import LeaderboardPage from '../pages/LeaderboardPage';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "challenges", element: <ChallengePage /> },
      { path: "leaderboard", element: <LeaderboardPage /> },
    ]
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "*",
    element: <NotFoundPage />
  }
]);