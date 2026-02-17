import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ROUTES } from '../../router/paths';

export default function HeroSection() {
  return (
    <div className="relative isolate overflow-hidden pt-14 pb-16 sm:pb-24">
      <div className="absolute top-0 left-1/2 -z-10 w-[100rem] -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
        <div className="aspect-[1100/800] w-full bg-gradient-to-tr from-indigo-500 to-purple-500 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-8 flex justify-center">
            <span className="relative rounded-full px-3 py-1 text-sm leading-6 text-indigo-400 ring-1 ring-indigo-500/30 hover:ring-indigo-500/50 bg-indigo-500/10 transition-all cursor-default">
              v1.0 Public Beta is Live
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
            Master Cyber Security <br />
            One Flag at a Time.
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300 max-w-2xl mx-auto">
            DotFlag is a modern platform designed to test your skills in Web Exploitation,
            Cryptography, and Reverse Engineering. Don't just read theory - hack real systems.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link to={ROUTES.CHALLENGES} className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 hover:scale-105 transition-all duration-200">
              Start Hacking
            </Link>
            <a href="#features" className="text-sm font-semibold leading-6 text-white hover:text-indigo-400 transition flex items-center gap-1">
              Learn more <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
