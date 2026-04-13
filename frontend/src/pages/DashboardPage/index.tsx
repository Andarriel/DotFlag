import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAxios } from '../../context/AxiosContext';
import { useChallenges } from '../../hooks/useChallenges';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import { MOCK_RECENT_ACTIVITY } from '../../data/mockData';
import StatsCards from './StatsCards';
import RecommendedChallenges from './RecommendedChallenges';
import RecentActivity from './RecentActivity';
import type { GlobalActivityItem } from './RecentActivity';
import { submissionService } from '../../services/submissionService';
import { USE_MOCK } from '../../config';

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
  const { challenges, loading: challengesLoading } = useChallenges();
  const { currentUserRank, loading: leaderboardLoading } = useLeaderboard();
  const loading = challengesLoading || leaderboardLoading;
  const recommendedChallenges = challenges.filter(c => !c.isSolved && c.isActive).slice(0, 3);
  const solvedChallenges = challenges.filter(c => c.isSolved);
  const activeChallenges = challenges.filter(c => c.isActive);
  const [activities, setActivities] = useState<GlobalActivityItem[]>(MOCK_RECENT_ACTIVITY);

  useEffect(() => {
    if (USE_MOCK) return;
    submissionService.getRecent(api, 10).then(subs => {
      setActivities(subs.map(s => {
        const ch = challenges.find(c => c.id === s.challengeId);
        const basePoints = ch?.points ?? 0;
        return {
          username: s.username,
          challenge: s.challengeName,
          points: basePoints + (s.bonusPoints || 0),
          time: timeAgo(s.timestamp),
          isFirstBlood: s.bonusPoints > 0,
          category: (ch?.category as string) ?? 'Misc',
        };
      }));
    }).catch(() => {});
  }, [api, challenges]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 pt-24 pb-12 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1.5">
            Welcome back, <span className="text-gradient">{user?.username}</span>
          </h1>
          <p className="text-sm text-slate-500">
            {currentUserRank?.rank === 1
              ? 'You\'re on top. Stay sharp - they\'re coming for your throne.'
              : 'Keep solving challenges to climb the leaderboard.'}
          </p>
        </div>

        <StatsCards
          rank={currentUserRank?.rank || 0}
          points={currentUserRank?.currentPoints || solvedChallenges.reduce((sum, c) => sum + c.points, 0)}
          solved={solvedChallenges.length}
          totalChallenges={activeChallenges.length}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <RecommendedChallenges challenges={recommendedChallenges} />
          <RecentActivity activities={activities} />
        </div>
      </div>
    </div>
  );
}
