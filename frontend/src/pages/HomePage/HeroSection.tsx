import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ROUTES } from '../../router/paths';

export default function HeroSection() {
  return (
    <div className="relative isolate overflow-hidden pt-16 sm:pt-20 pb-20 sm:pb-28">
      <div className="absolute top-0 left-1/2 -z-10 w-[80rem] -translate-x-1/2 -translate-y-1/3 opacity-15 pointer-events-none">
        <div className="aspect-square w-full bg-gradient-to-tr from-indigo-600 via-purple-500 to-indigo-400 rounded-full blur-3xl" />
      </div>
      <div className="absolute bottom-0 right-0 -z-10 w-[40rem] opacity-10 pointer-events-none">
        <div className="aspect-square w-full bg-gradient-to-bl from-cyan-500 to-indigo-600 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 sm:mb-8 flex justify-center animate-fade-in">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs sm:text-sm font-medium text-indigo-300 ring-1 ring-indigo-500/25 bg-indigo-500/[0.08] backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              v1.0 Public Beta is Live
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gradient leading-[1.1] animate-fade-in-up opacity-0 stagger-1">
            Master Cyber Security <br />
            One Flag at a Time.
          </h1>
          <p className="mt-5 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-slate-400 max-w-2xl mx-auto animate-fade-in-up opacity-0 stagger-2">
            DotFlag is a modern platform designed to test your skills in Web Exploitation,
            Cryptography, and Reverse Engineering. Don't just read theory - hack real systems.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-fade-in-up opacity-0 stagger-3">
            <Link to={ROUTES.CHALLENGES}
              className="w-full sm:w-auto rounded-xl bg-indigo-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all duration-200 text-center active:scale-[0.98]">
              Start Hacking
            </Link>
            <a href="#features" className="text-sm font-semibold text-slate-400 hover:text-white transition flex items-center gap-1.5 py-3">
              Learn more <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
