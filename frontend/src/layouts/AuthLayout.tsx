import { Outlet } from 'react-router-dom';

export function AuthShell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px]" />

      <div className={`relative z-10 w-full max-w-md ${className ?? ''}`}>
        {children}
      </div>
    </div>
  );
}

const AuthLayout = () => {
  return (
    <AuthShell>
      <Outlet />
    </AuthShell>
  );
};

export default AuthLayout;
