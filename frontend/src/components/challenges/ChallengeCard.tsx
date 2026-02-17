import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDifficultyColor, getCategoryIcon } from '../../utils/challengeUtils';
import type { Challenge } from '../../types';

export default function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const Icon = getCategoryIcon(challenge.category);

  return (
    <Link
      to={`/challenges/${challenge.id}`}
      className={`block bg-slate-900/50 border rounded-xl p-6 transition-all hover:border-indigo-500/50 cursor-pointer group ${
        challenge.isSolved
          ? 'border-green-500/30'
          : !challenge.isActive
          ? 'border-slate-800 opacity-60'
          : 'border-slate-800'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
          <Icon className="w-6 h-6 text-white" />
        </div>
        {challenge.isSolved && <CheckCircle className="w-5 h-5 text-green-400" />}
      </div>

      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition">{challenge.title}</h3>
      <p className="text-sm text-slate-400 mb-4 line-clamp-2">{challenge.description}</p>

      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xs font-semibold px-2 py-1 rounded border ${getDifficultyColor(challenge.difficulty)}`}>
          {challenge.difficulty}
        </span>
        <span className="text-xs text-slate-500">{challenge.category}</span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-800">
        <span className="text-sm font-semibold text-indigo-400">{challenge.points} pts</span>
      </div>
    </Link>
  );
}
