import { useState } from 'react';
import { Copy, Check, Trophy, Users, Eye, EyeOff, RefreshCw, Lock, Pencil, X } from 'lucide-react';
import type { Team } from '../../types';

interface TeamInfoProps {
  team: Team;
  copied: boolean;
  isLeader: boolean;
  onCopyCode: () => void;
  onRegenerate: () => void;
  onRename?: (name: string) => Promise<boolean>;
}

export default function TeamInfo({ team, copied, isLeader, onCopyCode, onRegenerate, onRename }: TeamInfoProps) {
  const [showCode, setShowCode] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [renameSaving, setRenameSaving] = useState(false);

  const maskedCode = team.inviteCode.slice(0, -4) + '••••';

  const startRename = () => {
    setRenameValue(team.name);
    setRenaming(true);
  };

  const cancelRename = () => {
    setRenaming(false);
    setRenameValue('');
  };

  const saveRename = async () => {
    const trimmed = renameValue.trim();
    if (!trimmed || trimmed === team.name) { cancelRename(); return; }
    setRenameSaving(true);
    const ok = await onRename?.(trimmed);
    setRenameSaving(false);
    if (ok) setRenaming(false);
  };

  return (
    <div className="glass rounded-xl p-5 gradient-border mb-4">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
            {isLeader ? 'You are the leader of' : 'You are a member of'}
          </p>
          {renaming ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                type="text"
                value={renameValue}
                onChange={e => setRenameValue(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') saveRename(); if (e.key === 'Escape') cancelRename(); }}
                className="bg-slate-800/70 border border-indigo-500/40 rounded-lg px-2.5 py-1 text-white text-lg font-bold focus:outline-none focus:border-indigo-500/70 w-48"
                maxLength={25}
              />
              <button
                onClick={saveRename}
                disabled={renameSaving || !renameValue.trim()}
                className="p-1.5 text-green-400 hover:text-green-300 hover:bg-green-400/10 rounded-lg transition disabled:opacity-40">
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={cancelRename}
                disabled={renameSaving}
                className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-700/50 rounded-lg transition">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{team.name}</h2>
              {isLeader && onRename && (
                <button
                  onClick={startRename}
                  title="Rename team"
                  className="p-1 text-slate-600 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
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
        {isLeader ? (
          <>
            <code className="text-sm text-indigo-400 font-mono flex-1 truncate">
              {showCode ? team.inviteCode : maskedCode}
            </code>
            <button onClick={() => setShowCode(v => !v)} title={showCode ? 'Hide code' : 'Show code'} className="p-1 text-slate-400 hover:text-white transition">
              {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button onClick={onCopyCode} title="Copy invite code" className="p-1 text-slate-400 hover:text-white transition">
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button onClick={onRegenerate} title="Regenerate invite code" className="p-1 text-slate-400 hover:text-yellow-400 transition">
              <RefreshCw className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <code className="text-sm text-indigo-400 font-mono flex-1">{team.inviteCode}••••</code>
            <Lock className="w-3.5 h-3.5 text-slate-600" />
          </>
        )}
      </div>
    </div>
  );
}
