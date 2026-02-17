import { getCategoryIcon, getDifficultyColor } from '../../utils/challengeUtils';
import type { ChallengeDetail } from '../../types';

export default function ChallengeInfo({ challenge }: { challenge: ChallengeDetail }) {
  const Icon = getCategoryIcon(challenge.category);

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0">
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white mb-2">{challenge.title}</h1>
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`text-xs font-semibold px-2 py-1 rounded border ${getDifficultyColor(challenge.difficulty)}`}>
              {challenge.difficulty}
            </span>
            <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">{challenge.category}</span>
            <span className="text-sm font-bold text-indigo-400">{challenge.points} pts</span>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 pt-4 mb-4">
        <p className="text-slate-300 leading-relaxed whitespace-pre-line">{challenge.description}</p>
      </div>

      <div className="flex items-center gap-6 text-sm text-slate-400">
        <span>{challenge.solveCount} solves</span>
        <span>by {challenge.author}</span>
      </div>

      {challenge.hint && (
        <div className="mt-4 bg-yellow-400/5 border border-yellow-400/20 rounded-lg p-3">
          <p className="text-xs text-yellow-400 font-medium mb-1">Hint</p>
          <p className="text-sm text-yellow-200/80">{challenge.hint}</p>
        </div>
      )}

      <div className="mt-6">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="dotflag{your_flag_here}"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-indigo-500"
          />
          <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-500 transition">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
