import { CheckCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDifficultyColor, getCategoryIcon } from '../../utils/challengeUtils';
import type { Challenge } from '../../types';

export default function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const Icon = getCategoryIcon(challenge.category);

  return (
    <Link
      to={`/challenges/${challenge.id}`}
      className={`block glass rounded-xl p-5 transition-all duration-300 group hover:bg-slate-800/40 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-0.5 ${
        challenge.isSolved
          ? 'border-green-500/20'
          : !challenge.isActive
          ? 'opacity-50'
          : 'gradient-border'
      }`}
    >
      <div className="flex items-start justify-between mb-3.5">
        <div className="w-11 h-11 bg-indigo-600/15 border border-indigo-500/20 rounded-xl flex items-center justify-center group-hover:bg-indigo-600/25 transition-colors">
          <Icon className="w-5 h-5 text-indigo-400" />
        </div>
        {challenge.isSolved ? (
          <CheckCircle className="w-5 h-5 text-green-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
        )}
      </div>

      <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-indigo-300 transition">{challenge.title}</h3>
      <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">{challenge.description}</p>

      <div className="flex items-center gap-2 mb-3">
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${getDifficultyColor(challenge.difficulty)}`}>
          {challenge.difficulty}
        </span>
        <span className="text-[11px] text-slate-600">{challenge.category}</span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
        <span className="text-sm font-bold text-indigo-400">{challenge.points} pts</span>
      </div>
    </Link>
  );
}
