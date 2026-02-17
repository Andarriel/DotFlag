import { Zap, Users, Calendar } from 'lucide-react';
import { formatTimeAgo } from '../../utils/leaderboardUtils';
import type { Profile } from '../../types';

export default function ProfileHeader({ profile }: { profile: Profile }) {
  return (
    <div className="bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border border-indigo-500/30 rounded-2xl p-6 mb-6">
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-3xl">{profile.username.charAt(0).toUpperCase()}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-white">{profile.username}</h1>
            <span className="text-xs font-medium bg-indigo-600/20 text-indigo-400 px-2 py-0.5 rounded">{profile.role}</span>
          </div>
          <p className="text-sm text-slate-400 mb-3">{profile.bio}</p>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Zap className="w-4 h-4 text-indigo-400" />
              <span className="font-semibold text-white">{profile.currentPoints}</span> points
            </div>
            {profile.teamName && (
              <div className="flex items-center gap-1.5 text-slate-400">
                <Users className="w-4 h-4 text-purple-400" />
                {profile.teamName}
              </div>
            )}
            <div className="flex items-center gap-1.5 text-slate-400">
              <Calendar className="w-4 h-4 text-slate-500" />
              Joined {formatTimeAgo(profile.joinedAt)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
