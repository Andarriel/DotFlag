import { useParams } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import ProfileHeader from '../../components/profile/ProfileHeader';
import FlagHistory from '../../components/profile/FlagHistory';
import ProfileSettings from '../../components/profile/ProfileSettings';
import { useProfile } from '../../hooks/useProfile';

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { profile, isOwnProfile } = useProfile(Number(id));

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-950 pt-24">
        <div className="max-w-4xl mx-auto px-6">
          <EmptyState icon={UserCircle} title="User not found" description="This profile doesn't exist." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <PageHeader
        icon={<UserCircle className="w-6 h-6 text-white" />}
        title={isOwnProfile ? 'My Profile' : profile.username}
        description={isOwnProfile ? 'Manage your account and view your stats' : `Viewing ${profile.username}'s profile`}
      />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <ProfileHeader profile={profile} />
        <div className="space-y-6">
          <FlagHistory history={profile.flagHistory} />
          {isOwnProfile && <ProfileSettings />}
        </div>
      </div>
    </div>
  );
}
