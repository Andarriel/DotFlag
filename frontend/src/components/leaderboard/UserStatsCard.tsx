import { getRankIcon } from '../../utils/leaderboardUtils';

interface UserStatsCardProps {
  rank: number;
  points: number;
  solved: number;
}

export default function UserStatsCard({ rank, points, solved }: UserStatsCardProps) {
  return (
    <div className="mb-8 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border border-indigo-500/30 rounded-2xl p-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-sm text-slate-400 mb-1">Your Ranking</p>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-white">#{rank}</span>
            <span className="text-2xl">{getRankIcon(rank)}</span>
          </div>
        </div>
        <div className="flex gap-8">
          <div>
            <p className="text-sm text-slate-400 mb-1">Points</p>
            <p className="text-xl font-bold text-indigo-400">{points}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-1">Solved</p>
            <p className="text-xl font-bold text-purple-400">{solved}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
