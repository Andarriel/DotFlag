import { Users, User } from 'lucide-react';
import { getCategoryIcon, getDifficultyColor } from '../../utils/challengeUtils';
import type { ChallengeDetail } from '../../types';

export default function ChallengeInfo({ challenge }: { challenge: ChallengeDetail }) {
  const Icon = getCategoryIcon(challenge.category);

  return (
    <div className="glass rounded-2xl gradient-border noise overflow-hidden">
      <div className="relative p-5 sm:p-6">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-indigo-600/[0.06] rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-start gap-4 mb-5">
          <div className="w-14 h-14 bg-indigo-600/15 border border-indigo-500/20 rounded-xl flex items-center justify-center glow-indigo shrink-0">
            <Icon className="w-7 h-7 text-indigo-400" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">{challenge.title}</h1>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border ${getDifficultyColor(challenge.difficulty)}`}>
                {challenge.difficulty}
              </span>
              <span className="text-[11px] text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-md">{challenge.category}</span>
              <span className="text-sm font-bold text-indigo-400">{challenge.points} pts</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.04] pt-4 mb-4">
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed whitespace-pre-line">{challenge.description}</p>
        </div>

        <div className="flex items-center gap-5 text-sm text-slate-500">
          <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {challenge.solveCount} solves</span>
          <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {challenge.author}</span>
        </div>

        {challenge.hint && (
          <div className="mt-4 bg-amber-500/[0.06] border border-amber-500/15 rounded-xl p-3.5">
            <p className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider mb-1">Hint</p>
            <p className="text-sm text-amber-200/70">{challenge.hint}</p>
          </div>
        )}

        <div className="mt-5 flex gap-2.5 flex-col sm:flex-row">
          <input type="text" placeholder="dotflag{your_flag_here}"
            className="flex-1 bg-slate-800/50 border border-white/[0.06] rounded-xl px-4 py-2.5 text-white text-sm font-mono placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all" />
          <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 active:scale-[0.98] whitespace-nowrap">
            Submit Flag
          </button>
        </div>
      </div>
    </div>
  );
}
