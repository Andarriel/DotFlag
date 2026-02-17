import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Terminal, Shield, LogOut } from 'lucide-react';
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

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.HOME} className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              Dot<span className="text-indigo-500">Flag</span>
            </span>
          </Link>

          <div className="hidden md:flex items-baseline space-x-4">
            {navLinks.map(link => (
              <Link key={link.name} to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive(link.path) ? 'text-white bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}>
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to={`/profile/${user?.id}`} className="text-sm text-slate-300 hover:text-indigo-400 transition">{user?.username}</Link>
                <button onClick={handleLogout} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm font-medium transition-all">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <Link to={ROUTES.LOGIN} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-indigo-500/20">
                <Terminal className="h-4 w-4" /> Login
              </Link>
            )}
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map(link => (
              <Link key={link.name} to={link.path} onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">
                {link.name}
              </Link>
            ))}
            {isAuthenticated ? (
              <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:text-red-300 hover:bg-slate-800">
                Logout ({user?.username})
              </button>
            ) : (
              <Link to={ROUTES.LOGIN} onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-indigo-400 hover:text-indigo-300 hover:bg-slate-800">
                Access Terminal (Login)
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
