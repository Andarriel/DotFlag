import { Trophy } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import { UserStatsCard, TeamProgressChart, LeaderboardTable } from './components';

export default function LeaderboardPage() {
  const { leaderboard, currentUser, currentUserRank, teamProgress, maxPoints } = useLeaderboard();

  return (
    <div className="min-h-screen bg-slate-950">
      <PageHeader
        icon={<Trophy className="w-6 h-6 text-white" />}
        title="Leaderboard"
        description="Compete with the best hackers and climb your way to the top. Rankings update in real-time."
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {currentUserRank && (
          <UserStatsCard
            rank={currentUserRank.rank}
            points={currentUserRank.currentPoints}
            solved={currentUserRank.solvedChallenges}
          />
        )}

        <TeamProgressChart teamProgress={teamProgress} maxPoints={maxPoints} />
        <LeaderboardTable entries={leaderboard} currentUserId={currentUser.id} />
      </div>
    </div>
  );
}
