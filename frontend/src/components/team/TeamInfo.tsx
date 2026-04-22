import { useState } from 'react';
import { Copy, Check, Trophy, Users, Eye, EyeOff, RefreshCw } from 'lucide-react';
import type { Team } from '../../types';

interface TeamInfoProps {
  team: Team;
  copied: boolean;
  isLeader: boolean;
  onCopyCode: () => void;
  onRegenerate: () => void;
}

export default function TeamInfo({ team, copied, isLeader, onCopyCode, onRegenerate }: TeamInfoProps) {
  const [showCode, setShowCode] = useState(false);

  const maskedCode = team.inviteCode.slice(0, -4) + '••••';

  return (
    <div className="glass rounded-xl p-5 gradient-border mb-4">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Team</p>
          <h2 className="text-xl font-bold text-white">{team.name}</h2>
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
        <code className="text-sm text-indigo-400 font-mono flex-1 truncate">
          {showCode ? team.inviteCode : maskedCode}
        </code>
        <button onClick={() => setShowCode(v => !v)} title={showCode ? 'Hide code' : 'Show code'} className="p-1 text-slate-400 hover:text-white transition">
          {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
        <button onClick={onCopyCode} title="Copy invite code" className="p-1 text-slate-400 hover:text-white transition">
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
        </button>
        {isLeader && (
          <button onClick={onRegenerate} title="Regenerate invite code" className="p-1 text-slate-400 hover:text-yellow-400 transition">
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
