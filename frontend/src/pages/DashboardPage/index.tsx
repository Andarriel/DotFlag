import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAxios } from '../../context/AxiosContext';
import { useChallenges } from '../../hooks/useChallenges';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import { submissionService } from '../../services/submissionService';
import { USE_MOCK } from '../../config';
import { MOCK_RECENT_ACTIVITY } from '../../data/mockData';
import StatsCards from './StatsCards';
import RecommendedChallenges from './RecommendedChallenges';
import RecentActivity from './RecentActivity';

function timeAgo(timestamp: string) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const api = useAxios();
  const { challenges } = useChallenges();
  const { currentUserRank } = useLeaderboard();
  const [activities, setActivities] = useState(MOCK_RECENT_ACTIVITY);
  const solvedChallenges = challenges.filter(c => c.isSolved);
  const recommendedChallenges = challenges.filter(c => !c.isSolved && c.isActive).slice(0, 3);

  useEffect(() => {
    if (USE_MOCK) return;
    submissionService.getMy(api).then(subs => {
      setActivities(subs.slice(0, 10).map(s => ({
        action: (s.isCorrect ? 'Solved' : 'Attempted') as 'Solved' | 'Attempted',
        challenge: s.challengeName,
        points: s.isCorrect ? (challenges.find(c => c.id === s.challengeId)?.points ?? 0) : 0,
        time: timeAgo(s.timestamp),
      })));
    }).catch(() => {});
  }, [api, challenges]);

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
          rank={currentUserRank?.rank || 0}
          points={solvedChallenges.reduce((sum, c) => sum + c.points, 0)}
          solved={solvedChallenges.length}
          weeklyProgress={0}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <RecommendedChallenges challenges={recommendedChallenges} />
          <RecentActivity activities={activities} />
        </div>
      </div>
    </div>
  );
}
