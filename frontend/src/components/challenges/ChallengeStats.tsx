import { CheckCircle, Clock, Zap } from 'lucide-react';

interface ChallengeStatsProps {
  solvedCount: number;
  availableCount: number;
  totalPoints: number;
}

const STATS_CONFIG = [
  { key: 'solved', icon: CheckCircle, color: 'text-green-400', label: 'Solved' },
  { key: 'available', icon: Clock, color: 'text-indigo-400', label: 'Available' },
  { key: 'points', icon: Zap, color: 'text-purple-400', label: 'Total Points' },
] as const;

export default function ChallengeStats({ solvedCount, availableCount, totalPoints }: ChallengeStatsProps) {
  const values = { solved: solvedCount, available: availableCount, points: totalPoints };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {STATS_CONFIG.map(({ key, icon: Icon, color, label }) => (
        <div key={key} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <Icon className={`w-8 h-8 ${color}`} />
            <div>
              <p className="text-2xl font-bold text-white">{values[key]}</p>
              <p className="text-sm text-slate-400">{label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
