import { Medal, Zap, Target, type LucideIcon } from 'lucide-react';

function StatItem({ icon: Icon, iconColor, label, value }: { icon: LucideIcon; iconColor: string; label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-y-2 p-4 rounded-2xl hover:bg-slate-800/50 transition duration-300">
      <dt className="text-base leading-7 text-slate-400 flex items-center justify-center gap-2">
        <Icon className={`h-5 w-5 ${iconColor}`} /> {label}
      </dt>
      <dd className="order-first text-4xl font-bold tracking-tight text-white sm:text-5xl">{value}</dd>
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
    <div className="border-y border-slate-800 bg-slate-950/50 backdrop-blur-sm relative z-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-3 sm:gap-x-10 text-center">
          <StatItem icon={Medal} iconColor="text-yellow-500" label="Total Players" value={totalPlayers} />
          <StatItem icon={Zap} iconColor="text-indigo-500" label="Points Earned" value={totalPoints.toLocaleString()} />
          <StatItem icon={Target} iconColor="text-green-500" label="Challenges Solved" value={totalSolved} />
        </div>
      </div>
    </div>
  );
}
