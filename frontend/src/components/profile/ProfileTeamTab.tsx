import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Trophy, Zap, Copy, Check, RefreshCw, Eye, EyeOff, UserMinus, Lock, Pencil, X, Crown } from 'lucide-react';
import { useTeamContext } from '../../context/TeamContext';
import { useAuth } from '../../context/AuthContext';
import Modal from '../common/Modal';
import { formatTimeAgo } from '../../utils/leaderboardUtils';

export default function ProfileTeamTab() {
  const { team, loading, isLeader, copied, copyInviteCode, regenerateInvite, removeMember, renameTeam, transferLeadership, refresh } = useTeamContext();
  const { user } = useAuth();
  const [showCode, setShowCode] = useState(false);

  // Remove member modal
  const [pendingRemoveId, setPendingRemoveId] = useState<number | null>(null);
  const pendingRemoveMember = team?.members.find(m => m.id === pendingRemoveId);

  // Transfer leadership modal
  const [pendingTransferId, setPendingTransferId] = useState<number | null>(null);
  const pendingTransferMember = team?.members.find(m => m.id === pendingTransferId);
  const [transferring, setTransferring] = useState(false);

  // Rename state
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [renameSaving, setRenameSaving] = useState(false);

  useEffect(() => { refresh(); }, []);

  const startRename = () => {
    setRenameValue(team?.name ?? '');
    setRenaming(true);
  };

  const cancelRename = () => {
    setRenaming(false);
    setRenameValue('');
  };

  const saveRename = async () => {
    if (!renameValue.trim() || renameValue.trim() === team?.name) { cancelRename(); return; }
    setRenameSaving(true);
    const ok = await renameTeam(renameValue.trim());
    setRenameSaving(false);
    if (ok) setRenaming(false);
  };

  const handleTransferConfirm = async () => {
    if (!pendingTransferId) return;
    setTransferring(true);
    await transferLeadership(pendingTransferId);
    setTransferring(false);
    setPendingTransferId(null);
  };

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
                <h3 className="text-xl font-bold text-white">{team.name}</h3>
                {isLeader && (
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
              <code className="text-sm text-indigo-400 font-mono flex-1">
                {showCode ? team.inviteCode : team.inviteCode.slice(0, -4) + '••••'}
              </code>
              <button onClick={() => setShowCode(v => !v)} title={showCode ? 'Hide code' : 'Show code'} className="p-1 text-slate-400 hover:text-white transition">
                {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button onClick={copyInviteCode} title="Copy invite code" className="p-1 text-slate-400 hover:text-white transition">
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <button onClick={regenerateInvite} title="Regenerate invite code" className="p-1 text-slate-400 hover:text-yellow-400 transition">
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
                    <span className="text-[10px] font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded-md shrink-0">Leader</span>
                  )}
                  {member.id === user?.id && (
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-800/60 border border-white/[0.06] px-1.5 py-0.5 rounded-md shrink-0">You</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">Joined {formatTimeAgo(member.joinedAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-sm font-bold text-white">{member.points}</span>
              {isLeader && member.id !== user?.id && (
                <>
                  {member.teamRole !== 'Leader' && (
                    <button
                      onClick={e => { e.preventDefault(); setPendingTransferId(member.id); }}
                      title="Transfer leadership"
                      className="ml-1 p-1 text-slate-600 hover:text-amber-400 transition">
                      <Crown className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={e => { e.preventDefault(); setPendingRemoveId(member.id); }}
                    title="Remove member"
                    className="p-1 text-slate-600 hover:text-red-400 transition">
                    <UserMinus className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Remove member modal */}
      <Modal
        isOpen={pendingRemoveId != null}
        onClose={() => setPendingRemoveId(null)}
        title="Remove Member"
        onConfirm={() => { if (pendingRemoveId != null) removeMember(pendingRemoveId); setPendingRemoveId(null); }}
        confirmLabel="Remove"
        confirmVariant="danger"
      >
        <p className="text-sm text-slate-400">
          Are you sure you want to remove <span className="text-white font-semibold">{pendingRemoveMember?.username}</span> from the team?
        </p>
      </Modal>

      {/* Transfer leadership modal */}
      <Modal
        isOpen={pendingTransferId != null}
        onClose={() => setPendingTransferId(null)}
        title="Transfer Leadership"
        onConfirm={handleTransferConfirm}
        confirmLabel="Transfer"
        confirmLoading={transferring}
      >
        <p className="text-sm text-slate-400">
          Transfer team leadership to <span className="text-white font-semibold">{pendingTransferMember?.username}</span>?
          You will become a regular member.
        </p>
      </Modal>
    </div>
  );
}
