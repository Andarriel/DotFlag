import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Terminal, Shield, LogOut, ChevronRight } from 'lucide-react';
import { ROUTES } from '../../router/paths';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;
  const isAdmin = user?.role === 'Admin' || user?.role === 'Owner';

  const navLinks = [
    { name: 'Home', path: ROUTES.HOME },
    ...(isAuthenticated ? [{ name: 'Dashboard', path: ROUTES.DASHBOARD }] : []),
    { name: 'Challenges', path: ROUTES.CHALLENGES },
    { name: 'Leaderboard', path: ROUTES.LEADERBOARD },
    ...(isAuthenticated ? [{ name: 'Team', path: ROUTES.TEAM }] : []),
    ...(isAdmin ? [{ name: 'Admin', path: ROUTES.ADMIN }] : []),
    { name: 'About', path: ROUTES.ABOUT },
  ];

  const handleLogout = () => { logout(); navigate(ROUTES.HOME); };

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-950/70 backdrop-blur-2xl border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.HOME} className="flex items-center gap-2.5 group">
            <div className="bg-indigo-600 p-1.5 rounded-lg shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/30 transition-shadow">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              Dot<span className="text-indigo-400">Flag</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.name} to={link.path}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-white bg-white/[0.08] shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}>
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to={`/profile/${user?.id}`} className="flex items-center gap-2 group">
                  <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs">{user?.username?.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="text-sm text-slate-300 group-hover:text-white transition">{user?.username}</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-1.5 bg-white/[0.06] hover:bg-white/[0.1] text-slate-400 hover:text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all border border-white/[0.04]">
                  <LogOut className="h-3.5 w-3.5" /> Logout
                </button>
              </>
            ) : (
              <Link to={ROUTES.LOGIN} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 active:scale-[0.98]">
                <Terminal className="h-4 w-4" /> Login
              </Link>
            )}
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition">
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-2xl border-b border-white/[0.06] animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <Link key={link.name} to={link.path} onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive(link.path) ? 'text-white bg-white/[0.08]' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}>
                {link.name}
                <ChevronRight className="w-4 h-4 opacity-30" />
              </Link>
            ))}
            <div className="border-t border-white/[0.06] pt-2 mt-2">
              {isAuthenticated ? (
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition">
                  <LogOut className="w-4 h-4" /> Logout ({user?.username})
                </button>
              ) : (
                <Link to={ROUTES.LOGIN} onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-indigo-400 hover:bg-indigo-500/10 transition">
                  <Terminal className="w-4 h-4" /> Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
