import { useAuth } from '../../context/AuthContext';
import { useChallenges } from '../../hooks/useChallenges';
import { MOCK_RECENT_ACTIVITY } from '../../data/mockData';
import StatsCards from './StatsCards';
import RecommendedChallenges from './RecommendedChallenges';
import RecentActivity from './RecentActivity';

export default function DashboardPage() {
  const { user } = useAuth();
  const { challenges } = useChallenges();
  const recommendedChallenges = challenges.filter(c => !c.isSolved && c.isActive).slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1.5">
            Welcome back, <span className="text-gradient">{user?.username}</span>
          </h1>
          <p className="text-sm text-slate-500">Keep solving challenges to climb the leaderboard.</p>
        </div>

        <StatsCards
          rank={0}
          points={user?.currentPoints || 0}
          solved={challenges.filter(c => c.isSolved).length}
          weeklyProgress={0}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <RecommendedChallenges challenges={recommendedChallenges} />
          <RecentActivity activities={MOCK_RECENT_ACTIVITY} />
        </div>
      </div>
    </div>
  );
}
