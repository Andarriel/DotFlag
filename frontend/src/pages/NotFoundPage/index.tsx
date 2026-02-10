import BrandLogo from '../../components/common/BrandLogo';
import { AuthShell } from '../../layouts/AuthLayout';
import { NotFoundContent } from './components';

export default function NotFoundPage() {
  return (
    <AuthShell className="text-center">
      <BrandLogo className="mb-12" />
      <NotFoundContent />
      <p className="mt-6 text-xs text-slate-600">
        Lost in cyberspace? Return to safety
      </p>
    </AuthShell>
  );
}
