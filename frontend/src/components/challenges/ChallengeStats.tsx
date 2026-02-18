import { CheckCircle, Clock, Zap } from 'lucide-react';

interface ChallengeStatsProps {
  solvedCount: number;
  availableCount: number;
  totalPoints: number;
}

const STATS_CONFIG = [
  { key: 'solved', icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-400/10 border-green-500/20', label: 'Solved' },
  { key: 'available', icon: Clock, color: 'text-indigo-400', bg: 'bg-indigo-400/10 border-indigo-500/20', label: 'Available' },
  { key: 'points', icon: Zap, color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-500/20', label: 'Total Points' },
] as const;

export default function ChallengeStats({ solvedCount, availableCount, totalPoints }: ChallengeStatsProps) {
  const values = { solved: solvedCount, available: availableCount, points: totalPoints };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
      {STATS_CONFIG.map(({ key, icon: Icon, color, bg, label }, i) => (
        <div key={key} className={`glass rounded-xl p-5 gradient-border animate-fade-in-up opacity-0 stagger-${i + 1}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center border`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{values[key]}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
