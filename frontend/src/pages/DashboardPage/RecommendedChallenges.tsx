import { Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../router/paths';
import type { Challenge } from '../../types';

function ChallengeItem({ challenge }: { challenge: Challenge }) {
  return (
    <Link
      to={`/challenges/${challenge.id}`}
      className="block bg-slate-950 border border-slate-800 rounded-xl p-4 hover:border-indigo-500/50 transition group"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold mb-1 group-hover:text-indigo-400 transition">{challenge.title}</h3>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">{challenge.category}</span>
            <span>-</span>
            <span>{challenge.difficulty}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-indigo-400">{challenge.points}</p>
          <p className="text-xs text-slate-500">points</p>
        </div>
      </div>
    </Link>
  );
}

export default function RecommendedChallenges({ challenges }: { challenges: Challenge[] }) {
  return (
    <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-400" />
          Recommended for You
        </h2>
        <Link to={ROUTES.CHALLENGES} className="text-sm text-indigo-400 hover:text-indigo-300 transition">
          View All
        </Link>
      </div>
      <div className="space-y-4">
        {challenges.map(challenge => <ChallengeItem key={challenge.id} challenge={challenge} />)}
      </div>
    </div>
  );
}
