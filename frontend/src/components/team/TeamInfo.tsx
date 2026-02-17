import { Copy, Check, Users, Trophy } from 'lucide-react';
import type { Team } from '../../types';

interface TeamInfoProps {
  team: Team;
  copied: boolean;
  onCopyCode: () => void;
}

export default function TeamInfo({ team, copied, onCopyCode }: TeamInfoProps) {
  return (
    <div className="bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border border-indigo-500/30 rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-sm text-slate-400 mb-1">Your Team</p>
          <h2 className="text-2xl font-bold text-white">{team.name}</h2>
        </div>
        <div className="flex gap-8">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <div>
              <p className="text-sm text-slate-400">Members</p>
              <p className="text-lg font-bold text-white">{team.members.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-sm text-slate-400">Total Points</p>
              <p className="text-lg font-bold text-white">{team.totalPoints}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span className="text-sm text-slate-400">Invite Code:</span>
        <code className="bg-slate-800 px-3 py-1.5 rounded-lg text-indigo-400 font-mono text-sm">{team.inviteCode}</code>
        <button onClick={onCopyCode} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition">
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
