import { Zap, Users, Calendar, Trophy, Target } from 'lucide-react';
import { formatTimeAgo } from '../../utils/leaderboardUtils';
import type { Profile } from '../../types';

function StatPill({ icon: Icon, color, value, label }: { icon: typeof Zap; color: string; value: string | number; label: string }) {
  return (
    <div className="flex items-center gap-2.5 bg-slate-800/50 border border-white/[0.06] rounded-xl px-4 py-2.5">
      <Icon className={`w-4 h-4 ${color}`} />
      <div>
        <p className="text-sm font-bold text-white leading-none">{value}</p>
        <p className="text-[11px] text-slate-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export default function ProfileHeader({ profile }: { profile: Profile }) {
  return (
    <div className="relative overflow-hidden glass rounded-2xl gradient-border noise mb-6">
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="relative group">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 transition-transform group-hover:scale-105">
              <span className="text-white font-bold text-3xl sm:text-4xl">{profile.username.charAt(0).toUpperCase()}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-slate-900 rounded-full" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-white truncate">{profile.username}</h1>
              <span className="text-[11px] font-semibold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-md border border-indigo-500/20">
                {profile.role}
              </span>
            </div>
            <p className="text-sm text-slate-400 mb-4 line-clamp-2">{profile.bio}</p>

            <div className="flex flex-wrap gap-2">
              <StatPill icon={Zap} color="text-indigo-400" value={profile.currentPoints} label="Points" />
              <StatPill icon={Target} color="text-green-400" value={profile.flagHistory.length} label="Solves" />
              {profile.teamName && (
                <StatPill icon={Users} color="text-purple-400" value={profile.teamName} label="Team" />
              )}
              <StatPill icon={Calendar} color="text-slate-400" value={formatTimeAgo(profile.joinedAt)} label="Joined" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
