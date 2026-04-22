import { useState, useEffect } from 'react';
import { Users, Plus, LogOut, Trash2 } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import TeamInfo from '../../components/team/TeamInfo';
import MemberList from '../../components/team/MemberList';
import JoinTeamPanel from '../../components/team/JoinTeamPanel';
import Modal from '../../components/common/Modal';
import { useTeamContext } from '../../context/TeamContext';
import { useAuth } from '../../context/AuthContext';

export default function TeamPage() {
  const { team, loading, refresh, isLeader, inviteCode, setInviteCode, copied, copyInviteCode, regenerateInvite, removeMember, joinTeam, createTeam, leaveTeam, disbandTeam } = useTeamContext();
  const { user } = useAuth();

  useEffect(() => { refresh(); }, []);
  const [showCreate, setShowCreate] = useState(false);
  const [showDisband, setShowDisband] = useState(false);
  const [teamName, setTeamName] = useState('');

  const handleCreate = async () => {
    if (!teamName.trim()) return;
    await createTeam(teamName.trim());
    setTeamName('');
    setShowCreate(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <PageHeader
          icon={<Users className="w-6 h-6 text-white" />}
          title="Team"
          description="Loading..."
        />
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <PageHeader
        icon={<Users className="w-6 h-6 text-white" />}
        title="Team"
        description={team ? `You are part of ${team.name}` : 'Join or create a team to compete together'}
      />

      <div className="max-w-4xl mx-auto px-6 py-8">
        {team ? (
          <>
            <TeamInfo team={team} copied={copied} onCopyCode={copyInviteCode} isLeader={isLeader} onRegenerate={regenerateInvite} />
            <MemberList members={team.members} isLeader={isLeader} currentUserId={user?.id} onRemove={removeMember} />
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={leaveTeam}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-all">
                <LogOut className="w-4 h-4" /> Leave Team
              </button>
              <button onClick={() => setShowDisband(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-all">
                <Trash2 className="w-4 h-4" /> Disband Team
              </button>
            </div>

            <Modal isOpen={showDisband} onClose={() => setShowDisband(false)} title="Disband Team" onConfirm={async () => { await disbandTeam(); setShowDisband(false); }} confirmLabel="Disband" confirmVariant="danger">
              <p className="text-sm text-slate-400">Are you sure you want to disband your team? This action cannot be undone and all members will be removed.</p>
            </Modal>
          </>
        ) : (
          <div className="space-y-6">
            <JoinTeamPanel inviteCode={inviteCode} onCodeChange={setInviteCode} onJoin={joinTeam} />

            <div className="max-w-md mx-auto">
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-white/[0.06]" />
                <span className="text-xs text-slate-500 uppercase tracking-wider">or</span>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>

              {showCreate ? (
                <div className="glass rounded-2xl p-6 gradient-border noise">
                  <h3 className="text-lg font-bold text-white mb-4">Create a Team</h3>
                  <div className="flex gap-2.5 flex-col sm:flex-row">
                    <input type="text" value={teamName} onChange={e => setTeamName(e.target.value)}
                      placeholder="Team name"
                      onKeyDown={e => e.key === 'Enter' && handleCreate()}
                      className="flex-1 bg-slate-800/50 border border-white/[0.06] rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all" />
                    <button onClick={handleCreate} disabled={!teamName.trim()}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]">
                      <Plus className="w-4 h-4" /> Create
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setShowCreate(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/10 rounded-xl transition-all">
                  <Plus className="w-4 h-4" /> Create a new team
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
