import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';

// Mock placeholders for future pages
const ChallengesPagePlaceholder = () => <div className="text-white text-center py-20 text-2xl">Challenges Module (In Progress)</div>;
const LeaderboardPagePlaceholder = () => <div className="text-white text-center py-20 text-2xl">Leaderboard Module (In Progress)</div>;


export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "challenges", element: <ChallengesPagePlaceholder /> },
      { path: "leaderboard", element: <LeaderboardPagePlaceholder /> },
    ]
  },
  {
    path: "/login",
    element: <LoginPage />
  }
]);