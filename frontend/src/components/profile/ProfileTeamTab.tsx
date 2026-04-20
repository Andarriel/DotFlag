import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Trophy, Zap, Copy, Check, RefreshCw } from 'lucide-react';
import { useTeamContext } from '../../context/TeamContext';
import { formatTimeAgo } from '../../utils/leaderboardUtils';

export default function ProfileTeamTab() {
  const { team, loading, isLeader, copied, copyInviteCode, regenerateInvite, refresh } = useTeamContext();

  useEffect(() => { refresh(); }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="glass rounded-xl p-12 text-center animate-fade-in">
        <Users className="w-12 h-12 text-slate-700 mx-auto mb-3" />
        <p className="text-white font-semibold mb-1">Not in a team</p>
        <p className="text-sm text-slate-500 mb-4">Join or create a team to compete together.</p>
        <Link to="/team" className="inline-flex px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-500 transition-all">
          Go to Teams
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="glass rounded-xl p-5 gradient-border">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Team</p>
            <h3 className="text-xl font-bold text-white">{team.name}</h3>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="flex items-center gap-1 text-indigo-400">
                <Trophy className="w-4 h-4" />
                <span className="text-lg font-bold">{team.totalPoints}</span>
              </div>
              <p className="text-[11px] text-slate-500">Points</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 text-purple-400">
                <Users className="w-4 h-4" />
                <span className="text-lg font-bold">{team.members.length}</span>
              </div>
              <p className="text-[11px] text-slate-500">Members</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2">
          <span className="text-xs text-slate-500">Invite:</span>
          <code className="text-sm text-indigo-400 font-mono flex-1">{team.inviteCode}</code>
          <button onClick={copyInviteCode} title="Copy invite code" className="p-1 text-slate-400 hover:text-white transition">
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
          {isLeader && (
            <button onClick={regenerateInvite} title="Regenerate invite code" className="p-1 text-slate-400 hover:text-yellow-400 transition">
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {team.members.map((member, i) => (
          <Link key={member.id} to={`/profile/${member.id}`}
            className={`flex items-center justify-between p-3.5 glass rounded-xl hover:bg-slate-800/50 transition-all group animate-fade-in-up opacity-0 stagger-${Math.min(i + 1, 5)}`}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">{member.username.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white group-hover:text-indigo-400 transition">{member.username}</p>
                  {member.teamRole === 'Leader' && (
                    <span className="text-[10px] font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded-md">Leader</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">Joined {formatTimeAgo(member.joinedAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-sm font-bold text-white">{member.points}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
