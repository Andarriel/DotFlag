import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ROUTES } from '../../router/paths';
import BrandLogo from '../../components/common/BrandLogo';
import { FormField, AuthDivider, SubmitButton } from '../LoginPage/components';

interface FieldErrors {
  username?: string;
  email?: string;
  password?: string;
}

function validate(username: string, email: string, password: string): FieldErrors {
  const errors: FieldErrors = {};
  if (username.length < 5) errors.username = 'Username must be at least 5 characters';
  else if (username.length > 30) errors.username = 'Username must be under 30 characters';
  if (!email.includes('@')) errors.email = 'Enter a valid email address';
  if (password.length < 8) errors.password = 'Password must be at least 8 characters';
  return errors;
}

function parseBackendError(err: any): string {
  const data = err.response?.data;
  if (data?.message) return data.message;
  return 'Registration failed. Please try again.';
}

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState(false);
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const toast = useToast();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const fieldErrors = validate(username, email, password);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    try {
      await register({ username, email, password });
      toast.success('Account created successfully!');
      navigate(ROUTES.DASHBOARD);
    } catch (err: any) {
      toast.error(parseBackendError(err));
    }
  };

  const fieldErrors = touched ? errors : {};

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
            onChange={v => { setUsername(v); if (touched) setErrors(validate(v, email, password)); }}
            placeholder="h4ck3r"
            required
            error={fieldErrors.username}
          />
          <FormField
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={v => { setEmail(v); if (touched) setErrors(validate(username, v, password)); }}
            placeholder="hacker@dotflag.md"
            required
            error={fieldErrors.email}
          />
          <FormField
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={v => { setPassword(v); if (touched) setErrors(validate(username, email, v)); }}
            placeholder="Min. 8 characters"
            required
            error={fieldErrors.password}
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
