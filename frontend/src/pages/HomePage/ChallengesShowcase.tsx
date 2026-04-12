import { Link } from 'react-router-dom';
import { Globe, Lock, Cpu, Search, Binary, Blocks, Eye, ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ROUTES } from '../../router/paths';
import { useChallenges } from '../../hooks/useChallenges';
import type { ChallengeCategory } from '../../types';

interface CategoryStyle {
  icon: LucideIcon;
  gradient: string;
  glow: string;
  accent: string;
  iconBg: string;
  symbol: string;
}

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  Web: {
    icon: Globe,
    gradient: 'from-blue-500/10 via-blue-600/5 to-transparent',
    glow: 'group-hover:shadow-blue-500/10',
    accent: 'text-blue-400',
    iconBg: 'bg-blue-500/15 border-blue-500/20',
    symbol: '</>',
  },
  Crypto: {
    icon: Lock,
    gradient: 'from-yellow-500/10 via-amber-500/5 to-transparent',
    glow: 'group-hover:shadow-yellow-500/10',
    accent: 'text-yellow-400',
    iconBg: 'bg-yellow-500/15 border-yellow-500/20',
    symbol: '#!',
  },
  Pwn: {
    icon: Cpu,
    gradient: 'from-red-500/10 via-rose-500/5 to-transparent',
    glow: 'group-hover:shadow-red-500/10',
    accent: 'text-red-400',
    iconBg: 'bg-red-500/15 border-red-500/20',
    symbol: '0x',
  },
  Reverse: {
    icon: Binary,
    gradient: 'from-purple-500/10 via-violet-500/5 to-transparent',
    glow: 'group-hover:shadow-purple-500/10',
    accent: 'text-purple-400',
    iconBg: 'bg-purple-500/15 border-purple-500/20',
    symbol: '>>',
  },
  Forensics: {
    icon: Search,
    gradient: 'from-emerald-500/10 via-green-500/5 to-transparent',
    glow: 'group-hover:shadow-emerald-500/10',
    accent: 'text-emerald-400',
    iconBg: 'bg-emerald-500/15 border-emerald-500/20',
    symbol: '??',
  },
  Misc: {
    icon: Blocks,
    gradient: 'from-slate-500/10 via-slate-400/5 to-transparent',
    glow: 'group-hover:shadow-slate-500/10',
    accent: 'text-slate-400',
    iconBg: 'bg-slate-500/15 border-slate-500/20',
    symbol: '**',
  },
  OSINT: {
    icon: Eye,
    gradient: 'from-cyan-500/10 via-sky-500/5 to-transparent',
    glow: 'group-hover:shadow-cyan-500/10',
    accent: 'text-cyan-400',
    iconBg: 'bg-cyan-500/15 border-cyan-500/20',
    symbol: '@@',
  },
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  Web: 'SQL injection, XSS, CSRF, and more. Break into web applications.',
  Crypto: 'Ciphers, hashing, RSA, and encoding. Crack the codes.',
  Pwn: 'Buffer overflows, ROP chains, format strings. Own the binary.',
  Reverse: 'Disassembly, decompilation, debugging. Understand the machine.',
  Forensics: 'Packet captures, memory dumps, file analysis. Find the evidence.',
  Misc: 'Everything else. Expect the unexpected.',
  OSINT: 'Open source intelligence. Find what\'s hidden in plain sight.',
};

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
      {/* Symbol watermark */}
      <span className={`absolute top-3 right-4 font-mono text-3xl sm:text-4xl font-bold ${style.accent} opacity-[0.06] select-none leading-none`}>
        {style.symbol}
      </span>

      <div className="relative z-10">
        {/* Icon */}
        <div className={`w-11 h-11 rounded-xl ${style.iconBg} border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-5 h-5 ${style.accent}`} />
        </div>

        {/* Title + count */}
        <div className="flex items-baseline justify-between mb-2">
          <h3 className="font-display text-base font-bold text-white group-hover:text-white/90 transition">
            {category}
          </h3>
          <span className="font-mono text-[11px] text-slate-600">
            {count} chall{count !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Description */}
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
        {/* Section header */}
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

        {/* Category cards grid */}
        {categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {categories.map(([cat, count], i) => (
              <CategoryCard key={cat} category={cat} count={count} index={i} />
            ))}

            {/* "More" card linking to challenges */}
            <Link
              to={ROUTES.CHALLENGES}
              className={`group relative rounded-2xl border border-dashed border-white/[0.06] hover:border-indigo-500/20 p-5 sm:p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-indigo-500/[0.03] animate-fade-in-up opacity-0`}
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

        {/* Mobile browse link */}
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
