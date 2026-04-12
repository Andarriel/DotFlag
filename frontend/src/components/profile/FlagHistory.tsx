import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Zap, ScrollText } from 'lucide-react';
import { formatTimeAgo } from '../../utils/leaderboardUtils';
import type { FlagEntry } from '../../types';

function SubmissionRow({ entry, index, onClick }: { entry: FlagEntry; index: number; onClick: () => void }) {
  return (
    <div onClick={onClick} className={`flex items-center justify-between p-4 glass rounded-xl group hover:bg-slate-800/50 transition-all cursor-pointer animate-fade-in-up opacity-0 stagger-${Math.min(index + 1, 5)}`}>
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-10 h-10 ${entry.isCorrect ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'} border rounded-lg flex items-center justify-center shrink-0 group-hover:${entry.isCorrect ? 'border-green-500/40' : 'border-red-500/40'} transition-colors`}>
          {entry.isCorrect
            ? <CheckCircle className="w-5 h-5 text-green-400" />
            : <XCircle className="w-5 h-5 text-red-400" />}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">{entry.challengeTitle}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded">{entry.category}</span>
            <span className={`text-[11px] px-2 py-0.5 rounded ${entry.isCorrect ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'}`}>
              {entry.isCorrect ? 'Solved' : 'Attempted'}
            </span>
            <span className="text-[11px] text-slate-600">{formatTimeAgo(entry.solvedAt)}</span>
          </div>
        </div>
      </div>
      {entry.isCorrect && entry.points > 0 && (
        <div className="flex items-center gap-1.5 shrink-0 ml-3">
          <Zap className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-sm font-bold text-indigo-400">+{entry.points}</span>
        </div>
      )}
    </div>
  );
}

export default function FlagHistory({ history }: { history: FlagEntry[] }) {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      {history.length > 0 ? (
        <div className="space-y-2">
          {history.map((entry, i) => <SubmissionRow key={entry.challengeId + '-' + i} entry={entry} index={i} onClick={() => navigate(`/challenges?open=${entry.challengeId}`)} />)}
        </div>
      ) : (
        <div className="glass rounded-xl p-12 text-center">
          <ScrollText className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="text-sm text-slate-500">No submissions yet</p>
        </div>
      )}
    </div>
  );
}
