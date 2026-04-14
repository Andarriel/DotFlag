import { useState } from 'react';
import { Trophy, Users2, User } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import UserStatsCard from '../../components/leaderboard/UserStatsCard';
import TeamProgressChart from '../../components/leaderboard/TeamProgressChart';
import LeaderboardTable from '../../components/leaderboard/LeaderboardTable';
import TeamLeaderboardTable from '../../components/leaderboard/TeamLeaderboardTable';
import { useLeaderboard } from '../../hooks/useLeaderboard';

type Tab = 'players' | 'teams';

export default function LeaderboardPage() {
  const { leaderboard, teamLeaderboard, currentUser, currentUserRank, playerProgress, teamProgress, loading } = useLeaderboard();
  const [tab, setTab] = useState<Tab>('players');

  const activeProgress = tab === 'players' ? playerProgress : teamProgress;
  const maxPoints = activeProgress.length > 0
    ? Math.max(...activeProgress.flatMap(p => p.progress.map(pt => pt.points)), 0)
    : 0;

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

            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setTab('players')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                  tab === 'players'
                    ? 'bg-indigo-600/15 text-indigo-400 border-indigo-500/20'
                    : 'text-slate-500 border-white/[0.04] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <User className="w-4 h-4" /> Players
              </button>
              <button
                onClick={() => setTab('teams')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                  tab === 'teams'
                    ? 'bg-indigo-600/15 text-indigo-400 border-indigo-500/20'
                    : 'text-slate-500 border-white/[0.04] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Users2 className="w-4 h-4" /> Teams
              </button>
            </div>

            {activeProgress.length > 0 && (
              <TeamProgressChart teamProgress={activeProgress} maxPoints={maxPoints} />
            )}

            {tab === 'players' ? (
              <LeaderboardTable entries={leaderboard} currentUserId={currentUser?.id ?? -1} />
            ) : (
              <TeamLeaderboardTable entries={teamLeaderboard} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
