import { useNavigate } from 'react-router-dom';
import { CheckCircle, Zap, Flame, Flag } from 'lucide-react';
import { formatTimeAgo } from '../../utils/leaderboardUtils';
import type { FlagEntry } from '../../types';

function SolveRow({ entry, index, onClick }: { entry: FlagEntry; index: number; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all animate-fade-in-up opacity-0 stagger-${Math.min(index + 1, 5)} ${
        entry.isFirstBlood
          ? 'bg-gradient-to-r from-red-950/40 via-red-900/10 to-transparent hover:from-red-950/50'
          : 'glass hover:bg-slate-800/50'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-center shrink-0">
          <CheckCircle className="w-5 h-5 text-green-400" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-white truncate">{entry.challengeTitle}</p>
            {entry.isFirstBlood && (
              <span className="flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-wider text-red-400">
                <Flame className="w-3 h-3" />
                1st Blood
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded">{entry.category}</span>
            <span className="text-[11px] text-slate-600">{formatTimeAgo(entry.solvedAt)}</span>
          </div>
        </div>
      </div>
      {entry.points > 0 && (
        <div className="flex items-center gap-1.5 shrink-0 ml-3">
          <Zap className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-sm font-bold text-indigo-400">+{entry.points}</span>
        </div>
      )}
    </div>
  );
}

export default function SolvesList({ history }: { history: FlagEntry[] }) {
  const navigate = useNavigate();
  const solves = history.filter(f => f.isCorrect);

  return (
    <div className="animate-fade-in">
      {solves.length > 0 ? (
        <div className="space-y-2">
          {solves.map((entry, i) => (
            <SolveRow
              key={entry.challengeId + '-' + entry.solvedAt}
              entry={entry}
              index={i}
              onClick={() => navigate(`/challenges?open=${entry.challengeId}`)}
            />
          ))}
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
