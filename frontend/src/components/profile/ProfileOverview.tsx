import { Trophy, Target, Zap, TrendingUp } from 'lucide-react';
import type { Profile } from '../../types';

function OverviewCard({ icon: Icon, color, bg, label, value }: { icon: typeof Trophy; color: string; bg: string; label: string; value: string | number }) {
  return (
    <div className="glass rounded-xl p-4 gradient-border group hover:bg-slate-800/40 transition-all">
      <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center mb-3`}>
        <Icon className={`w-4.5 h-4.5 ${color}`} />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}

export default function ProfileOverview({ profile }: { profile: Profile }) {
  const totalPoints = profile.flagHistory.reduce((sum, f) => sum + f.points, 0);
  const categories = [...new Set(profile.flagHistory.map(f => f.category))];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <OverviewCard icon={Trophy} color="text-yellow-400" bg="bg-yellow-400/10" label="Rank" value="#1" />
        <OverviewCard icon={Zap} color="text-indigo-400" bg="bg-indigo-400/10" label="Total Points" value={totalPoints} />
        <OverviewCard icon={Target} color="text-green-400" bg="bg-green-400/10" label="Flags Captured" value={profile.flagHistory.length} />
        <OverviewCard icon={TrendingUp} color="text-purple-400" bg="bg-purple-400/10" label="Categories" value={categories.length} />
      </div>

      <div className="glass rounded-xl p-5 gradient-border">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Recent Solves</h3>
        {profile.flagHistory.length > 0 ? (
          <div className="space-y-2">
            {profile.flagHistory.slice(0, 3).map(flag => (
              <div key={flag.challengeId} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-sm text-white">{flag.challengeTitle}</span>
                  <span className="text-[11px] text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded">{flag.category}</span>
                </div>
                <span className="text-sm font-semibold text-indigo-400">+{flag.points}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 text-center py-4">No challenges solved yet</p>
        )}
      </div>
    </div>
  );
}
