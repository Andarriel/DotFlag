import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background gradient */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px]" />

      <div className="relative z-10 w-full max-w-md text-center">
        
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-3 mb-12 group">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <span className="text-3xl font-bold">
            <span className="text-white">Dot</span>
            <span className="text-indigo-500">Flag</span>
          </span>
        </Link>

        {/* 404 Content */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-12">
          <div className="text-8xl font-bold text-indigo-500 mb-4">404</div>
          <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
          <p className="text-slate-400 mb-8">
            This endpoint doesn't exist or has been moved
          </p>
          
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg px-6 py-3 transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <p className="mt-6 text-xs text-slate-600">
          Lost in cyberspace? Return to safety
        </p>
      </div>
    </div>
  );
}