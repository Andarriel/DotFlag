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
    <tr className={`transition-all hover:bg-slate-800/30 ${isCurrentUser ? 'bg-indigo-600/[0.06] border-l-2 border-l-indigo-500' : ''}`}>
      <td className="px-4 sm:px-6 py-3.5 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className={`w-8 h-8 rounded-lg ${getRankBadgeColor(entry.rank)} flex items-center justify-center text-sm font-bold`}>
            {entry.rank}
          </span>
          {entry.rank <= 3 && <span className="text-lg">{getRankIcon(entry.rank)}</span>}
        </div>
      </td>
      <td className="px-4 sm:px-6 py-3.5 whitespace-nowrap">
        <Link to={`/profile/${entry.id}`} className="flex items-center gap-3 hover:opacity-80 transition group">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">{entry.username.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-white group-hover:text-indigo-400 transition">{entry.username}</p>
            {entry.teamName && <span className="text-[11px] text-slate-500">{entry.teamName}</span>}
          </div>
        </Link>
      </td>
      <td className="px-4 sm:px-6 py-3.5 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-sm font-bold text-white">{entry.currentPoints}</span>
        </div>
      </td>
      <td className="px-4 sm:px-6 py-3.5 whitespace-nowrap hidden md:table-cell">
        <div className="flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-green-400" />
          <span className="text-sm text-slate-300">{entry.solvedChallenges}</span>
        </div>
      </td>
      <td className="px-4 sm:px-6 py-3.5 whitespace-nowrap hidden lg:table-cell">
        {entry.lastSolveTime ? (
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-xs text-slate-500">{formatTimeAgo(entry.lastSolveTime)}</span>
          </div>
        ) : (
          <span className="text-xs text-slate-700">-</span>
        )}
      </td>
    </tr>
  );
}

const HEADERS = [
  { label: 'Rank', className: '' },
  { label: 'Player', className: '' },
  { label: 'Points', className: '' },
  { label: 'Solved', className: 'hidden md:table-cell' },
  { label: 'Last Activity', className: 'hidden lg:table-cell' },
];

export default function LeaderboardTable({ entries, currentUserId }: LeaderboardTableProps) {
  return (
    <div className="glass rounded-2xl overflow-hidden gradient-border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-800/30 border-b border-white/[0.04]">
            <tr>
              {HEADERS.map(h => (
                <th key={h.label} className={`px-4 sm:px-6 py-3.5 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider ${h.className}`}>{h.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {entries.map(entry => (
              <LeaderboardRow key={entry.id} entry={entry} isCurrentUser={entry.id === currentUserId} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
