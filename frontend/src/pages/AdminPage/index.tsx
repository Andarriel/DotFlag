import { lazy, Suspense } from 'react';
import { ShieldCheck } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { AdminProvider, useAdminContext } from '../../context/AdminContext';

const UserManagementTable = lazy(() => import('../../components/admin/UserManagementTable'));
const ChallengeManagementTable = lazy(() => import('../../components/admin/ChallengeManagementTable'));
const NotificationBroadcast = lazy(() => import('../../components/admin/NotificationBroadcast'));
const DockerMonitor = lazy(() => import('../../components/admin/DockerMonitor'));
const AuditLogsTable = lazy(() => import('../../components/admin/AuditLogsTable'));

const Spinner = () => (
  <div className="flex justify-center py-20">
    <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

function AdminContent() {
  const { activeTab, loading } = useAdminContext();

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        <AdminSidebar />

        <div className="flex-1">
          <Suspense fallback={<Spinner />}>
            {loading ? <Spinner /> : (
              <>
                {activeTab === 'users' && <UserManagementTable />}
                {activeTab === 'challenges' && <ChallengeManagementTable />}
                {activeTab === 'notifications' && <NotificationBroadcast />}
                {activeTab === 'docker' && <DockerMonitor />}
                {activeTab === 'logs' && <AuditLogsTable />}
              </>
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <PageHeader
        icon={<ShieldCheck className="w-6 h-6 text-white" />}
        title="Admin Panel"
        description="Manage users, challenges, and monitor infrastructure."
      />
      <AdminProvider>
        <AdminContent />
      </AdminProvider>
    </div>
  );
}
