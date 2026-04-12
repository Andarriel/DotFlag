import { CheckCircle, XCircle, Clock } from 'lucide-react';
import type { Submission } from '../../types';

function formatTime(timestamp: string) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function SubmissionRow({ submission }: { submission: Submission }) {
  return (
    <div className={`flex items-center justify-between py-2.5 px-3 rounded-lg border transition animate-fade-in-up ${
      submission.isCorrect
        ? 'border-green-500/15 bg-green-500/[0.04] hover:bg-green-500/[0.08]'
        : 'border-red-500/15 bg-red-500/[0.04] hover:bg-red-500/[0.08]'
    }`}>
      <div className="flex items-center gap-3">
        {submission.isCorrect ? (
          <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
        ) : (
          <XCircle className="w-4 h-4 text-red-400 shrink-0" />
        )}
        <span className={`text-sm font-medium ${submission.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
          {submission.isCorrect ? 'Correct' : 'Incorrect'}
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-[11px] text-slate-600 shrink-0 ml-3">
        <Clock className="w-3 h-3" />
        {formatTime(submission.timestamp)}
      </div>
    </div>
  );
}

export default function SubmissionHistory({ submissions }: { submissions: Submission[] }) {
  if (submissions.length === 0) return null;
  const sorted = [...submissions].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="glass rounded-2xl p-5 sm:p-6 gradient-border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-white">Submission History</h3>
        <span className="text-[11px] text-slate-500">{sorted.length} submissions</span>
      </div>
      <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 scrollbar-none">
        {sorted.map(sub => (
          <SubmissionRow key={sub.id} submission={sub} />
        ))}
      </div>
    </div>
  );
}
