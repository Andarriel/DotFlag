import { Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../router/paths';
import type { Challenge } from '../../types';

function ChallengeItem({ challenge }: { challenge: Challenge }) {
  return (
    <Link
      to={`/challenges/${challenge.id}`}
      className="block glass rounded-xl p-4 hover:bg-slate-800/40 transition-all group"
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-indigo-400 transition truncate">{challenge.title}</h3>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/50 border border-white/[0.04] text-slate-400">{challenge.category}</span>
            <span className="text-xs text-slate-600">{challenge.difficulty}</span>
          </div>
        </div>
        <div className="text-right shrink-0 ml-3">
          <p className="text-lg font-bold text-indigo-400">{challenge.points}</p>
          <p className="text-[11px] text-slate-600">pts</p>
        </div>
      </div>
    </Link>
  );
}

export default function RecommendedChallenges({ challenges }: { challenges: Challenge[] }) {
  return (
    <div className="lg:col-span-2 glass rounded-2xl p-5 sm:p-6 gradient-border">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Award className="w-4.5 h-4.5 text-indigo-400" />
          Recommended for You
        </h2>
        <Link to={ROUTES.CHALLENGES} className="text-xs text-indigo-400/70 hover:text-indigo-400 transition">
          View All
        </Link>
      </div>
      <div className="space-y-2.5">
        {challenges.map(challenge => <ChallengeItem key={challenge.id} challenge={challenge} />)}
      </div>
    </div>
  );
}
