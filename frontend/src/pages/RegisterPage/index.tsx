import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../router/paths';
import BrandLogo from '../../components/common/BrandLogo';
import { FormField, AuthDivider, SubmitButton } from './components';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    register(username, email, password);
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <>
      <div className="mb-10 text-center">
        <BrandLogo />
      </div>

      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-slate-400 text-sm">Join DotFlag and start hacking</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <FormField
            id="username"
            label="Username"
            type="text"
            value={username}
            onChange={setUsername}
            placeholder="h4ck3r"
            required
          />
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
          />
          <SubmitButton>Create Account</SubmitButton>
        </form>

        <AuthDivider />

        <div className="text-center">
          <p className="text-sm text-slate-400">
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              Sign in
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
