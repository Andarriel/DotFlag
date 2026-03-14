import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ROUTES } from '../../router/paths';

export function ServerErrorContent() {
  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-12">
      <div className="text-8xl font-bold text-red-500 mb-4">500</div>
      <h1 className="text-2xl font-bold text-white mb-2">Server Unavailable</h1>
      <p className="text-slate-400 mb-8">
        The backend server is currently offline or unreachable
      </p>

      <Link
        to={ROUTES.HOME}
        className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg px-6 py-3 transition-all duration-200 shadow-lg shadow-red-500/20 hover:shadow-red-500/40"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
    </div>
  );
}
