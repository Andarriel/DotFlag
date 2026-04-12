import { Trophy } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import UserStatsCard from '../../components/leaderboard/UserStatsCard';
import TeamProgressChart from '../../components/leaderboard/TeamProgressChart';
import LeaderboardTable from '../../components/leaderboard/LeaderboardTable';
import { useLeaderboard } from '../../hooks/useLeaderboard';

export default function LeaderboardPage() {
  const { leaderboard, currentUser, currentUserRank, teamProgress, maxPoints, loading } = useLeaderboard();

  return (
    <div className="min-h-screen bg-slate-950">
      <PageHeader
        icon={<Trophy className="w-6 h-6 text-white" />}
        title="Leaderboard"
        description="Compete with the best hackers and climb your way to the top."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {currentUserRank && (
              <UserStatsCard rank={currentUserRank.rank} points={currentUserRank.currentPoints} solved={currentUserRank.solvedChallenges} />
            )}
            <TeamProgressChart teamProgress={teamProgress} maxPoints={maxPoints} />
            <LeaderboardTable entries={leaderboard} currentUserId={currentUser?.id ?? -1} />
          </>
        )}
      </div>
    </div>
  );
}
