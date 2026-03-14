import BrandLogo from '../../components/common/BrandLogo';
import { AuthShell } from '../../layouts/AuthLayout';
import { ServerErrorContent } from './components';

export default function ServerErrorPage() {
  return (
    <AuthShell className="text-center">
      <BrandLogo className="mb-12" />
      <ServerErrorContent />
      <p className="mt-6 text-xs text-slate-600">
        The server might be down for maintenance
      </p>
    </AuthShell>
  );
}
