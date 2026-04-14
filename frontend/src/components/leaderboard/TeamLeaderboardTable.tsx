import { Zap, Target, Clock, Users } from 'lucide-react';
import { formatTimeAgo, getRankBadgeColor, getRankIcon } from '../../utils/leaderboardUtils';
import type { TeamLeaderboardEntry } from '../../hooks/useLeaderboard';

function TeamRow({ entry }: { entry: TeamLeaderboardEntry }) {
  return (
    <tr className="transition-all hover:bg-slate-800/30">
      <td className="px-4 sm:px-6 py-3.5 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className={`w-8 h-8 rounded-lg ${getRankBadgeColor(entry.rank)} flex items-center justify-center text-sm font-bold`}>
            {entry.rank}
          </span>
          {entry.rank <= 3 && <span className="text-lg">{getRankIcon(entry.rank)}</span>}
        </div>
      </td>
      <td className="px-4 sm:px-6 py-3.5 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{entry.teamName}</p>
            <span className="text-[11px] text-slate-500">{entry.memberCount} member{entry.memberCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </td>
      <td className="px-4 sm:px-6 py-3.5 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-sm font-bold text-white">{entry.score}</span>
        </div>
      </td>
      <td className="px-4 sm:px-6 py-3.5 whitespace-nowrap hidden md:table-cell">
        <div className="flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-green-400" />
          <span className="text-sm text-slate-300">{entry.solvesCount}</span>
        </div>
      </td>
      <td className="px-4 sm:px-6 py-3.5 whitespace-nowrap hidden lg:table-cell">
        {entry.lastSolveAt ? (
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-xs text-slate-500">{formatTimeAgo(entry.lastSolveAt)}</span>
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
  { label: 'Team', className: '' },
  { label: 'Points', className: '' },
  { label: 'Solved', className: 'hidden md:table-cell' },
  { label: 'Last Activity', className: 'hidden lg:table-cell' },
];

export default function TeamLeaderboardTable({ entries }: { entries: TeamLeaderboardEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="glass rounded-2xl p-12 text-center gradient-border">
        <Users className="w-10 h-10 text-slate-700 mx-auto mb-3" />
        <p className="text-sm text-slate-500">No team rankings yet</p>
        <p className="text-xs text-slate-600 mt-1">Teams need members who have solved challenges</p>
      </div>
    );
  }

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
              <TeamRow key={entry.teamId} entry={entry} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
