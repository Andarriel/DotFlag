import { Flag, Zap } from 'lucide-react';
import { formatTimeAgo } from '../../utils/leaderboardUtils';
import type { FlagEntry } from '../../types';

function FlagRow({ entry }: { entry: FlagEntry }) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-600/10 border border-green-500/20 rounded-lg flex items-center justify-center">
          <Flag className="w-5 h-5 text-green-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{entry.challengeTitle}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded">{entry.category}</span>
            <span className="text-xs text-slate-500">{formatTimeAgo(entry.solvedAt)}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <Zap className="w-4 h-4 text-indigo-400" />
        <span className="font-semibold text-indigo-400">+{entry.points}</span>
      </div>
    </div>
  );
}

export default function FlagHistory({ history }: { history: FlagEntry[] }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">Flag History</h3>
      {history.length > 0 ? (
        <div className="space-y-3">
          {history.map(entry => <FlagRow key={entry.challengeId} entry={entry} />)}
        </div>
      ) : (
        <p className="text-sm text-slate-500 text-center py-8">No flags captured yet.</p>
      )}
    </div>
  );
}
