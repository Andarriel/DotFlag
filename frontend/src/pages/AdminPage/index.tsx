import { ShieldCheck } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';
import UserManagementTable from '../../components/admin/UserManagementTable';
import ChallengeManagementTable from '../../components/admin/ChallengeManagementTable';
import DockerMonitor from '../../components/admin/DockerMonitor';
import { useAdmin } from '../../hooks/useAdmin';

export default function AdminPage() {
  const { activeTab, setActiveTab, users, challenges, dockerImages, toggleBan, kickSession, promoteToAdmin, toggleChallengeActive } = useAdmin();

  return (
    <div className="min-h-screen bg-slate-950">
      <PageHeader
        icon={<ShieldCheck className="w-6 h-6 text-white" />}
        title="Admin Panel"
        description="Manage users, challenges, and monitor infrastructure."
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="flex-1">
            {activeTab === 'users' && (
              <UserManagementTable users={users} onToggleBan={toggleBan} onKickSession={kickSession} onPromote={promoteToAdmin} />
            )}
            {activeTab === 'challenges' && (
              <ChallengeManagementTable challenges={challenges} onToggleActive={toggleChallengeActive} />
            )}
            {activeTab === 'docker' && (
              <DockerMonitor images={dockerImages} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
