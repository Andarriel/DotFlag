import { Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../router/paths';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.04] bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <span className="text-lg font-bold text-white">Dot<span className="text-indigo-400">Flag</span></span>
            <p className="mt-3 text-sm text-slate-500 leading-relaxed">
              Advanced Capture The Flag platform designed for students and security enthusiasts. Developed at UTM.
            </p>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Platform</h3>
            <ul className="space-y-2">
              <li><Link to={ROUTES.CHALLENGES} className="text-sm text-slate-500 hover:text-indigo-400 transition">Challenges</Link></li>
              <li><Link to={ROUTES.LEADERBOARD} className="text-sm text-slate-500 hover:text-indigo-400 transition">Leaderboard</Link></li>
              <li><Link to={ROUTES.ABOUT} className="text-sm text-slate-500 hover:text-indigo-400 transition">About & Status</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-slate-500 hover:text-indigo-400 transition">API Docs</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-indigo-400 transition">Write-ups</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-indigo-400 transition">Learning</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Connect</h3>
            <a href="https://github.com/IvanGazul/DotFlag" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white transition">
              <Github className="h-4 w-4" /> GitHub
            </a>
          </div>
        </div>

        <div className="border-t border-white/[0.04] pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-slate-600 text-xs">&copy; {new Date().getFullYear()} DotFlag Team. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="text-slate-600 hover:text-slate-400 text-xs transition">Privacy</a>
            <a href="#" className="text-slate-600 hover:text-slate-400 text-xs transition">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
