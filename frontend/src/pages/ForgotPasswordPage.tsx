import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState<string | null>(null);
  const { requestPasswordReset } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatus('sending');

    try {
      await requestPasswordReset(email);
      setStatus('sent');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to send reset email.';
      setError(message);
      setStatus('idle');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-10 text-center">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold">
              <span className="text-white">Dot</span>
              <span className="text-indigo-500">Flag</span>
            </span>
          </Link>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-slate-400 text-sm">We will email you a secure reset link</p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {status === 'sent' ? (
            <div className="rounded-lg border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-200">
              If an account exists for {email}, you will receive a reset email shortly.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="hacker@dotflag.md"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg px-4 py-3 transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? 'Sending...' : 'Send reset link'}
              </button>
            </form>
          )}

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-400">
              Remembered your password?{' '}
              <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-600">Secured platform for cybersecurity training</p>
        </div>
      </div>
    </div>
  );
}
