import { Flag, Zap } from 'lucide-react';
import { formatTimeAgo } from '../../utils/leaderboardUtils';
import type { FlagEntry } from '../../types';

function FlagRow({ entry, index }: { entry: FlagEntry; index: number }) {
  return (
    <div className={`flex items-center justify-between p-4 glass rounded-xl group hover:bg-slate-800/50 transition-all animate-fade-in-up opacity-0 stagger-${Math.min(index + 1, 5)}`}>
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-center shrink-0 group-hover:border-green-500/40 transition-colors">
          <Flag className="w-5 h-5 text-green-400" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">{entry.challengeTitle}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded">{entry.category}</span>
            <span className="text-[11px] text-slate-600">{formatTimeAgo(entry.solvedAt)}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0 ml-3">
        <Zap className="w-3.5 h-3.5 text-indigo-400" />
        <span className="text-sm font-bold text-indigo-400">+{entry.points}</span>
      </div>
    </div>
  );
}

export default function FlagHistory({ history }: { history: FlagEntry[] }) {
  return (
    <div className="animate-fade-in">
      {history.length > 0 ? (
        <div className="space-y-2">
          {history.map((entry, i) => <FlagRow key={entry.challengeId} entry={entry} index={i} />)}
        </div>
      ) : (
        <div className="glass rounded-xl p-12 text-center">
          <Flag className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="text-sm text-slate-500">No flags captured yet</p>
        </div>
      )}
    </div>
  );
}
