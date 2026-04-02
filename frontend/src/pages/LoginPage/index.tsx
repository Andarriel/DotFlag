import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ROUTES } from '../../router/paths';
import BrandLogo from '../../components/common/BrandLogo';
import { FormField, AuthDivider, SubmitButton } from './components';

function parseError(err: any): string {
  const data = err.response?.data;
  if (data?.errors) return Object.values(data.errors).flat().join(' ');
  return data?.message || 'Invalid email or password.';
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const toast = useToast();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate(ROUTES.DASHBOARD);
    } catch (err: any) {
      toast.error(parseError(err));
    }
  };

  return (
    <>
      <div className="mb-8 text-center animate-fade-in">
        <BrandLogo />
      </div>

      <div className="glass rounded-2xl p-6 sm:p-8 gradient-border noise animate-fade-in-up">
        <div className="mb-7 text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-1.5">Welcome Back</h1>
          <p className="text-sm text-slate-500">Sign in to access your challenges</p>
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
              <Link to="/forgot" className="text-[11px] text-indigo-400/70 hover:text-indigo-400 transition-colors">
                Forgot password?
              </Link>
            }
          />
          <SubmitButton>Sign In</SubmitButton>
        </form>

        <AuthDivider />

        <div className="text-center">
          <p className="text-sm text-slate-500">
            New to DotFlag?{' '}
            <Link to={ROUTES.REGISTER} className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              Create account
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-6 text-center animate-fade-in">
        <p className="text-[11px] text-slate-700">
          Your data is stored securely and encrypted.
        </p>
      </div>
    </>
  );
}
