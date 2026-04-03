import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserCircle, BarChart3, Flag, Users, Settings, type LucideIcon } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileOverview from '../../components/profile/ProfileOverview';
import FlagHistory from '../../components/profile/FlagHistory';
import ProfileTeamTab from '../../components/profile/ProfileTeamTab';
import ProfileSettings from '../../components/profile/ProfileSettings';
import { useProfile } from '../../hooks/useProfile';

type ProfileTab = 'overview' | 'flags' | 'team' | 'settings';

interface TabConfig {
  id: ProfileTab;
  label: string;
  icon: LucideIcon;
  ownerOnly?: boolean;
}

const TABS: TabConfig[] = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'flags', label: 'Flag History', icon: Flag },
  { id: 'team', label: 'Team', icon: Users, ownerOnly: true },
  { id: 'settings', label: 'Settings', icon: Settings, ownerOnly: true },
];

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { profile, isOwnProfile, loading } = useProfile(Number(id));
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 pt-24">
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-950 pt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <EmptyState icon={UserCircle} title="User not found" description="This profile doesn't exist." />
        </div>
      </div>
    );
  }

  const visibleTabs = TABS.filter(t => !t.ownerOnly || isOwnProfile);

  return (
    <div className="min-h-screen bg-slate-950 pt-20 sm:pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <ProfileHeader profile={profile} />

        <div className="flex gap-1 mb-6 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
          {visibleTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/25 shadow-sm shadow-indigo-500/10'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {activeTab === 'overview' && <ProfileOverview profile={profile} />}
        {activeTab === 'flags' && <FlagHistory history={profile.flagHistory} />}
        {activeTab === 'team' && <ProfileTeamTab />}
        {activeTab === 'settings' && isOwnProfile && <ProfileSettings />}
      </div>
    </div>
  );
}
