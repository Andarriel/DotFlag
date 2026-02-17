import { useAuth } from '../../context/AuthContext';
import { MOCK_CHALLENGES, MOCK_LEADERBOARD, MOCK_RECENT_ACTIVITY } from '../../data/mockData';
import StatsCards from './StatsCards';
import RecommendedChallenges from './RecommendedChallenges';
import RecentActivity from './RecentActivity';

export default function DashboardPage() {
  const { user } = useAuth();
  const userRank = MOCK_LEADERBOARD.find(entry => entry.id === user?.id);
  const recommendedChallenges = MOCK_CHALLENGES.filter(c => !c.isSolved && c.isActive).slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, <span className="text-indigo-400">{user?.username}</span>!
          </h1>
          <p className="text-slate-400">Here's your hacking dashboard. Keep solving challenges to climb the leaderboard!</p>
        </div>

        <StatsCards
          rank={userRank?.rank || 0}
          points={user?.currentPoints || 0}
          solved={userRank?.solvedChallenges || 0}
          weeklyProgress={3}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RecommendedChallenges challenges={recommendedChallenges} />
          <RecentActivity activities={MOCK_RECENT_ACTIVITY} />
        </div>
      </div>
    </div>
  );
}
