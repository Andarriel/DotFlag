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
    <div className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-slate-800/30 transition">
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

  return (
    <div className="glass rounded-2xl p-5 sm:p-6 gradient-border">
      <h3 className="text-base font-bold text-white mb-3">Submission History</h3>
      <div className="space-y-0.5 max-h-48 overflow-y-auto">
        {submissions.map(sub => <SubmissionRow key={sub.id} submission={sub} />)}
      </div>
    </div>
  );
}
