import { Trophy, Zap, Target, TrendingUp, type LucideIcon } from 'lucide-react';

interface StatCardConfig {
  icon: LucideIcon;
  color: string;
  label: string;
  value: string | number;
}

function StatCard({ icon: Icon, color, label, value }: StatCardConfig) {
  return (
    <div className="bg-slate-950/50 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <p className="text-sm text-slate-400 mb-1">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

interface StatsCardsProps {
  rank: number;
  points: number;
  solved: number;
  weeklyProgress: number;
}

export default function StatsCards({ rank, points, solved, weeklyProgress }: StatsCardsProps) {
  const cards: StatCardConfig[] = [
    { icon: Trophy, color: 'text-yellow-400', label: 'Your Rank', value: `#${rank}` },
    { icon: Zap, color: 'text-indigo-400', label: 'Total Points', value: points },
    { icon: Target, color: 'text-green-400', label: 'Challenges Solved', value: solved },
    { icon: TrendingUp, color: 'text-purple-400', label: 'This Week', value: `+${weeklyProgress}` },
  ];

  return (
    <div className="mb-8 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border border-indigo-500/30 rounded-2xl p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {cards.map(card => <StatCard key={card.label} {...card} />)}
      </div>
    </div>
  );
}
