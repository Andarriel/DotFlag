import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { formatTimeAgo } from '../../utils/leaderboardUtils';
import type { TeamMember } from '../../types';

function MemberRow({ member }: { member: TeamMember }) {
  return (
    <Link
      to={`/profile/${member.id}`}
      className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-indigo-500/50 transition group"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">{member.username.charAt(0).toUpperCase()}</span>
        </div>
        <div>
          <p className="text-white font-semibold group-hover:text-indigo-400 transition">{member.username}</p>
          <p className="text-xs text-slate-500">Joined {formatTimeAgo(member.joinedAt)}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-indigo-400" />
        <span className="font-semibold text-white">{member.points}</span>
        <span className="text-xs text-slate-500">pts</span>
      </div>
    </Link>
  );
}

export default function MemberList({ members }: { members: TeamMember[] }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">Team Members</h3>
      <div className="space-y-3">
        {members.map(member => <MemberRow key={member.id} member={member} />)}
      </div>
    </div>
  );
}
