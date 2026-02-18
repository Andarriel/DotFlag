import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../router/paths';
import BrandLogo from '../../components/common/BrandLogo';
import { FormField, AuthDivider, SubmitButton } from '../LoginPage/components';

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
    register({ username, email });
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <>
      <div className="mb-8 text-center animate-fade-in">
        <BrandLogo />
      </div>

      <div className="glass rounded-2xl p-6 sm:p-8 gradient-border noise animate-fade-in-up">
        <div className="mb-7 text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-1.5">Create Account</h1>
          <p className="text-sm text-slate-500">Join DotFlag and start hacking</p>
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
          <p className="text-sm text-slate-500">
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-6 text-center animate-fade-in">
        <p className="text-[11px] text-slate-700">
          Secured platform for cybersecurity training
        </p>
      </div>
    </>
  );
}
