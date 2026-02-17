import { Zap, Target, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatTimeAgo, getRankBadgeColor, getRankIcon } from '../../utils/leaderboardUtils';
import type { LeaderboardEntry } from '../../types';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId: number;
}

function LeaderboardRow({ entry, isCurrentUser }: { entry: LeaderboardEntry; isCurrentUser: boolean }) {
  return (
    <tr className={`transition-colors hover:bg-slate-800/30 ${isCurrentUser ? 'bg-indigo-600/5' : ''}`}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className={`w-8 h-8 rounded-lg ${getRankBadgeColor(entry.rank)} flex items-center justify-center text-sm font-bold`}>
            {entry.rank}
          </span>
          {entry.rank <= 3 && <span className="text-xl">{getRankIcon(entry.rank)}</span>}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Link to={`/profile/${entry.id}`} className="flex items-center gap-3 hover:opacity-80 transition">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">{entry.username.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <p className="font-semibold text-white">{entry.username}</p>
            {entry.teamName && <span className="text-xs text-slate-400">{entry.teamName}</span>}
          </div>
        </Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-white">{entry.currentPoints}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-green-400" />
          <span className="text-slate-300">{entry.solvedChallenges}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {entry.lastSolveTime ? (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-400">{formatTimeAgo(entry.lastSolveTime)}</span>
          </div>
        ) : (
          <span className="text-sm text-slate-600">-</span>
        )}
      </td>
    </tr>
  );
}

const HEADERS = ['Rank', 'Player', 'Points', 'Solved', 'Last Activity'];

export default function LeaderboardTable({ entries, currentUserId }: LeaderboardTableProps) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-800/50 border-b border-slate-700">
            <tr>
              {HEADERS.map(h => (
                <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {entries.map(entry => (
              <LeaderboardRow key={entry.id} entry={entry} isCurrentUser={entry.id === currentUserId} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
