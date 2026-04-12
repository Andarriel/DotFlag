import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { ROUTES } from '../../router/paths';
import { useChallenges } from '../../hooks/useChallenges';
import { CATEGORY_STYLES, CATEGORY_DESCRIPTIONS } from './categoryConfig';
import type { ChallengeCategory } from '../../types';

function CategoryCard({ category, count, index }: { category: string; count: number; index: number }) {
  const style = CATEGORY_STYLES[category] ?? CATEGORY_STYLES.Misc;
  const Icon = style.icon;
  const description = CATEGORY_DESCRIPTIONS[category] ?? 'Solve challenges and earn points.';

  return (
    <Link
      to={ROUTES.CHALLENGES}
      className={`group relative rounded-2xl bg-gradient-to-br ${style.gradient} p-5 sm:p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${style.glow} border border-white/[0.04] hover:border-white/[0.08] animate-fade-in-up opacity-0`}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <span className={`absolute top-3 right-4 font-mono text-3xl sm:text-4xl font-bold ${style.accent} opacity-[0.06] select-none leading-none`}>
        {style.symbol}
      </span>

      <div className="relative z-10">
        <div className={`w-11 h-11 rounded-xl ${style.iconBg} border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-5 h-5 ${style.accent}`} />
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <h3 className="font-display text-base font-bold text-white group-hover:text-white/90 transition">
            {category}
          </h3>
          <span className="font-mono text-[11px] text-slate-600">
            {count} chall{count !== 1 ? 's' : ''}
          </span>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{description}</p>
      </div>
    </Link>
  );
}

export default function ChallengesShowcase() {
  const { challenges } = useChallenges();
  const activeChallenges = challenges.filter(c => c.isActive);

  const categoryMap = new Map<ChallengeCategory, number>();
  for (const c of activeChallenges) {
    categoryMap.set(c.category, (categoryMap.get(c.category) ?? 0) + 1);
  }
  const categories = [...categoryMap.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <div className="relative py-16 sm:py-24 bg-slate-950">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent" />
      <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-end justify-between mb-10 sm:mb-12">
          <div>
            <span className="font-mono text-[11px] text-indigo-400/60 uppercase tracking-[0.2em]">The Challenges</span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-2">
              Pick your battlefield
            </h2>
          </div>
          <Link
            to={ROUTES.CHALLENGES}
            className="group hidden sm:flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-400 transition font-mono"
          >
            browse all
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {categories.map(([cat, count], i) => (
              <CategoryCard key={cat} category={cat} count={count} index={i} />
            ))}

            <Link
              to={ROUTES.CHALLENGES}
              className="group relative rounded-2xl border border-dashed border-white/[0.06] hover:border-indigo-500/20 p-5 sm:p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-indigo-500/[0.03] animate-fade-in-up opacity-0"
              style={{ animationDelay: `${categories.length * 0.08}s` }}
            >
              <span className="font-mono text-2xl text-slate-700 group-hover:text-indigo-500/50 transition mb-2">+</span>
              <span className="text-xs text-slate-600 group-hover:text-slate-400 transition">
                {activeChallenges.length} total
              </span>
              <span className="font-mono text-[10px] text-slate-700 group-hover:text-indigo-400/60 transition mt-1">
                explore all &rarr;
              </span>
            </Link>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="font-mono text-sm text-slate-600">// challenges incoming...</p>
          </div>
        )}

        <div className="sm:hidden text-center mt-6">
          <Link
            to={ROUTES.CHALLENGES}
            className="group inline-flex items-center gap-1.5 text-sm text-indigo-400 font-mono"
          >
            browse all challenges
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
