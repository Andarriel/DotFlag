import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { formatTimeAgo } from '../../utils/leaderboardUtils';
import type { TeamMember } from '../../types';

function MemberRow({ member, index }: { member: TeamMember; index: number }) {
  return (
    <Link to={`/profile/${member.id}`}
      className={`flex items-center justify-between p-3.5 glass rounded-xl hover:bg-slate-800/40 transition-all group animate-fade-in-up opacity-0 stagger-${Math.min(index + 1, 5)}`}>
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">{member.username.charAt(0).toUpperCase()}</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white group-hover:text-indigo-400 transition truncate">{member.username}</p>
          <p className="text-[11px] text-slate-500">Joined {formatTimeAgo(member.joinedAt)}</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0 ml-3">
        <Zap className="w-3.5 h-3.5 text-indigo-400" />
        <span className="text-sm font-bold text-white">{member.points}</span>
      </div>
    </Link>
  );
}

export default function MemberList({ members }: { members: TeamMember[] }) {
  return (
    <div className="glass rounded-2xl p-5 sm:p-6 gradient-border">
      <h3 className="text-base font-bold text-white mb-4">Team Members</h3>
      <div className="space-y-2">
        {members.map((member, i) => <MemberRow key={member.id} member={member} index={i} />)}
      </div>
    </div>
  );
}
