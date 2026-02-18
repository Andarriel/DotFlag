import { Copy, Check, Users, Trophy } from 'lucide-react';
import type { Team } from '../../types';

interface TeamInfoProps {
  team: Team;
  copied: boolean;
  onCopyCode: () => void;
}

export default function TeamInfo({ team, copied, onCopyCode }: TeamInfoProps) {
  return (
    <div className="glass rounded-2xl gradient-border noise p-5 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Your Team</p>
          <h2 className="text-xl sm:text-2xl font-bold text-white">{team.name}</h2>
        </div>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-indigo-400/10 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">{team.members.length}</p>
              <p className="text-[11px] text-slate-500">Members</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-yellow-400/10 rounded-lg flex items-center justify-center">
              <Trophy className="w-4 h-4 text-yellow-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">{team.totalPoints}</p>
              <p className="text-[11px] text-slate-500">Points</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 bg-slate-800/40 border border-white/[0.04] rounded-xl px-3.5 py-2.5">
        <span className="text-xs text-slate-500 shrink-0">Invite Code</span>
        <code className="text-sm text-indigo-400 font-mono flex-1 truncate">{team.inviteCode}</code>
        <button onClick={onCopyCode} className="p-1.5 text-slate-500 hover:text-white hover:bg-white/[0.06] rounded-lg transition shrink-0">
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
