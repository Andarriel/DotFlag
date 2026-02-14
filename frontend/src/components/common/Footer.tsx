import { Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../router/paths';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <span className="text-xl font-bold text-white">
              Dot<span className="text-indigo-500">Flag</span>
            </span>
            <p className="mt-4 text-sm text-slate-400">
              Advanced Capture The Flag platform designed for students and security enthusiasts. 
              Developed at UTM.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><Link to={ROUTES.CHALLENGES} className="text-slate-400 hover:text-indigo-400 text-sm transition">Challenges</Link></li>
              <li><Link to={ROUTES.LEADERBOARD} className="text-slate-400 hover:text-indigo-400 text-sm transition">Leaderboard</Link></li>
              <li><Link to={ROUTES.ABOUT} className="text-slate-400 hover:text-indigo-400 text-sm transition">About & Status</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 text-sm transition">API Documentation</a></li>
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 text-sm transition">Write-ups</a></li>
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 text-sm transition">Learning Resources</a></li>
            </ul>
          </div>

           {/* Socials */}
           <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Connect</h3>
            <div className="flex items-center gap-2">
              <a 
                href="https://github.com/IvanGazul/DotFlag" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition flex items-center gap-2"
              >
                <Github className="h-5 w-5"/>
                <span className="text-sm">GitHub</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} DotFlag Team. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-slate-500 hover:text-slate-300 text-sm">Privacy Policy</a>
            <a href="#" className="text-slate-500 hover:text-slate-300 text-sm">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}