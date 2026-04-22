import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { formatTimeAgo } from '../../utils/leaderboardUtils';
import type { TeamMember } from '../../types';

export default function MemberList({ members }: { members: TeamMember[] }) {
  return (
    <div className="space-y-2">
      {members.map((member, i) => (
        <Link key={member.id} to={`/profile/${member.id}`}
          className={`flex items-center justify-between p-3.5 glass rounded-xl hover:bg-slate-800/50 transition-all group animate-fade-in-up opacity-0 stagger-${Math.min(i + 1, 5)}`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">{member.username.charAt(0).toUpperCase()}</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-white group-hover:text-indigo-400 transition truncate">{member.username}</p>
                {member.teamRole === 'Leader' && (
                  <span className="text-[10px] font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded-md shrink-0">Leader</span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">Joined {formatTimeAgo(member.joinedAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 ml-3">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-sm font-bold text-white">{member.points}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
