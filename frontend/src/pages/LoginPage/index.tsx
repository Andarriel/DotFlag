import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../router/paths';
import BrandLogo from '../../components/common/BrandLogo';
import { FormField, AuthDivider, SubmitButton } from './components';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
    navigate(ROUTES.HOME);
  };

  return (
    <>
      {/* Logo */}
      <div className="mb-10 text-center">
        <BrandLogo />
      </div>

      {/* Card */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8">

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400 text-sm">Sign in to access your challenges</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <FormField
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="hacker@dotflag.md"
            required
          />
          <FormField
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••••••"
            required
            headerRight={
              <Link to="/forgot" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                Forgot password?
              </Link>
            }
          />
          <SubmitButton>Sign In</SubmitButton>
        </form>

        <AuthDivider />

        <div className="text-center">
          <p className="text-sm text-slate-400">
            New to DotFlag?{' '}
            <Link to={ROUTES.REGISTER} className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              Create account
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-slate-600">
          Secured platform for cybersecurity training
        </p>
      </div>
    </>
  );
}
