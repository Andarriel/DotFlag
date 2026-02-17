import { Users } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import TeamInfo from '../../components/team/TeamInfo';
import MemberList from '../../components/team/MemberList';
import JoinTeamPanel from '../../components/team/JoinTeamPanel';
import { useTeam } from '../../hooks/useTeam';
import { useAuth } from '../../context/AuthContext';

export default function TeamPage() {
  const { user } = useAuth();
  const hasTeam = !!user?.teamId;
  const { team, inviteCode, setInviteCode, copied, copyInviteCode } = useTeam(hasTeam);

  return (
    <div className="min-h-screen bg-slate-950">
      <PageHeader
        icon={<Users className="w-6 h-6 text-white" />}
        title="Team"
        description={team ? `You are part of ${team.name}` : 'Join a team to compete together'}
      />

      <div className="max-w-4xl mx-auto px-6 py-8">
        {team ? (
          <>
            <TeamInfo team={team} copied={copied} onCopyCode={copyInviteCode} />
            <MemberList members={team.members} />
          </>
        ) : (
          <JoinTeamPanel inviteCode={inviteCode} onCodeChange={setInviteCode} onJoin={() => {}} />
        )}
      </div>
    </div>
  );
}
