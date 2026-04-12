import { Trophy, Zap, Target, Swords, type LucideIcon } from 'lucide-react';

interface StatCardConfig {
  icon: LucideIcon;
  color: string;
  bg: string;
  label: string;
  value: string | number;
}

function StatCard({ icon: Icon, color, bg, label, value }: StatCardConfig) {
  return (
    <div className="glass rounded-xl p-4 gradient-border group hover:bg-slate-800/30 transition-all">
      <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center mb-3`}>
        <Icon className={`w-4.5 h-4.5 ${color}`} />
      </div>
      <p className="text-sm text-slate-500 mb-0.5">{label}</p>
      <p className="text-2xl sm:text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

interface StatsCardsProps {
  rank: number;
  points: number;
  solved: number;
  totalChallenges: number;
}

export default function StatsCards({ rank, points, solved, totalChallenges }: StatsCardsProps) {
  const cards: StatCardConfig[] = [
    { icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-400/10', label: 'Your Rank', value: rank > 0 ? `#${rank}` : '—' },
    { icon: Zap, color: 'text-indigo-400', bg: 'bg-indigo-400/10', label: 'Total Points', value: points },
    { icon: Target, color: 'text-green-400', bg: 'bg-green-400/10', label: 'Solved', value: `${solved}/${totalChallenges}` },
    { icon: Swords, color: 'text-purple-400', bg: 'bg-purple-400/10', label: 'Completion', value: totalChallenges > 0 ? `${Math.round((solved / totalChallenges) * 100)}%` : '0%' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
      {cards.map(card => <StatCard key={card.label} {...card} />)}
    </div>
  );
}
