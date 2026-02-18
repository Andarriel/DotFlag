import { Medal, Zap, Target, type LucideIcon } from 'lucide-react';

function StatItem({ icon: Icon, iconColor, label, value }: { icon: LucideIcon; iconColor: string; label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-y-2 p-5 rounded-2xl glass hover:bg-slate-800/30 transition-all duration-300 group">
      <dt className="text-sm text-slate-500 flex items-center justify-center gap-2">
        <Icon className={`h-4 w-4 ${iconColor}`} /> {label}
      </dt>
      <dd className="order-first text-3xl sm:text-4xl font-bold tracking-tight text-white text-center">{value}</dd>
    </div>
  );
}

interface StatsSectionProps {
  totalPlayers: number;
  totalPoints: number;
  totalSolved: number;
}

export default function StatsSection({ totalPlayers, totalPoints, totalSolved }: StatsSectionProps) {
  return (
    <div className="border-y border-white/[0.04] bg-slate-950/80 backdrop-blur-sm relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 text-center">
          <StatItem icon={Medal} iconColor="text-yellow-500" label="Total Players" value={totalPlayers} />
          <StatItem icon={Zap} iconColor="text-indigo-400" label="Points Earned" value={totalPoints.toLocaleString()} />
          <StatItem icon={Target} iconColor="text-green-400" label="Challenges Solved" value={totalSolved} />
        </div>
      </div>
    </div>
  );
}
