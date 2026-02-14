import { useAuth } from '../../context/AuthContext';
import { MOCK_CHALLENGES, MOCK_LEADERBOARD } from '../../data/mockData';
import { UserStatsCard, RecommendedChallenges, RecentActivity } from './components';

export default function DashboardPage() {
  const { user } = useAuth();
  
  // Find user rank from leaderboard (mock data for now)
  const userRank = MOCK_LEADERBOARD.find(entry => entry.id === user?.id);
  
  // Get recommended challenges 
  const recommendedChallenges = MOCK_CHALLENGES
    .filter(c => !c.isSolved && c.isActive)
    .slice(0, 3);

  // Mock recent activity (real data from API in production)
  const recentActivity = [
    { action: 'Solved' as const, challenge: 'SQL Injection 101', points: 200, time: '2h ago' },
    { action: 'Attempted' as const, challenge: 'Buffer Overflow', points: 0, time: '5h ago' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, <span className="text-indigo-400">{user?.username}</span>! 👋
          </h1>
          <p className="text-slate-400">Here's your hacking dashboard. Keep solving challenges to climb the leaderboard!</p>
        </div>

        {/* Stats Grid */}
        <UserStatsCard
          rank={userRank?.rank || 0}
          points={user?.currentPoints || 0}
          solved={userRank?.solvedChallenges || 0}
          weeklyProgress={3}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RecommendedChallenges challenges={recommendedChallenges} />
          <RecentActivity activities={recentActivity} />
        </div>
      </div>
    </div>
  );
}