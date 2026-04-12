import { Link } from 'react-router-dom';
import { ArrowRight, Terminal } from 'lucide-react';
import { ROUTES } from '../../router/paths';

function FloatingCode() {
  const lines = [
    { text: '$ nmap -sV target.ctf', delay: '0s', x: '8%', y: '18%', opacity: 0.12 },
    { text: 'GET /api/flag HTTP/1.1', delay: '1s', x: '72%', y: '15%', opacity: 0.08 },
    { text: "sqlmap --dbs --batch", delay: '2s', x: '5%', y: '72%', opacity: 0.1 },
    { text: 'strings ./binary | grep flag', delay: '0.5s', x: '65%', y: '78%', opacity: 0.07 },
    { text: '0x41414141', delay: '1.5s', x: '85%', y: '45%', opacity: 0.09 },
    { text: 'from pwn import *', delay: '3s', x: '15%', y: '48%', opacity: 0.06 },
  ];

  return (
    <>
      {lines.map((line, i) => (
        <div
          key={i}
          className="absolute font-mono text-[11px] sm:text-xs text-indigo-400 pointer-events-none select-none animate-float whitespace-nowrap"
          style={{
            left: line.x,
            top: line.y,
            opacity: line.opacity,
            animationDelay: line.delay,
            animationDuration: `${6 + i * 0.8}s`,
          }}
        >
          {line.text}
        </div>
      ))}
    </>
  );
}

export default function HeroSection() {
  return (
    <div className="relative isolate overflow-hidden hero-gradient grid-overlay min-h-[85vh] flex items-center">
      {/* Atmospheric layers */}
      <div className="absolute inset-0 noise opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

      <FloatingCode />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 py-20">
        <div className="mx-auto max-w-4xl text-center">
          {/* Terminal-style badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/60 border border-white/[0.06] backdrop-blur-sm mb-8 animate-fade-in opacity-0 stagger-1">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-mono text-xs text-slate-400">Capture The Flag Platform</span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          </div>

          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-800 tracking-tight leading-[0.9] animate-fade-in opacity-0 stagger-2">
            <span className="block text-white text-glow">Master Cyber</span>
            <span className="block mt-1 sm:mt-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400">
              Security.
            </span>
          </h1>

          <p className="mt-6 sm:mt-8 text-base sm:text-lg leading-relaxed text-slate-400/90 max-w-2xl mx-auto font-light animate-fade-in-up opacity-0 stagger-3">
            Hack real systems. Solve challenges in Web Exploitation, Cryptography,
            Reverse Engineering, and Forensics. Compete on the leaderboard.
          </p>

          <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up opacity-0 stagger-4">
            <Link
              to={ROUTES.CHALLENGES}
              className="group relative w-full sm:w-auto rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-300 text-center overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Start Hacking
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <a
              href="#arena"
              className="text-sm font-medium text-slate-500 hover:text-slate-300 transition flex items-center gap-1.5 py-3"
            >
              <span className="font-mono text-xs text-slate-600">[</span>
              Explore
              <span className="font-mono text-xs text-slate-600">]</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom scanline */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
    </div>
  );
}
