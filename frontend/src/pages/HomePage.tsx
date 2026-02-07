import { Link } from 'react-router-dom';
import { Lock, Code, Globe } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="bg-slate-900">
      
      {/* HERO SECTION */}
      <div className="relative isolate overflow-hidden pt-14 pb-16 sm:pb-24">
        {/* Background effects (Glow) */}
        <div className="absolute top-0 left-1/2 -z-10 w-[100rem] -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
             <div className="aspect-[1100/800] w-full bg-gradient-to-tr from-indigo-500 to-purple-500 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-8 flex justify-center">
              <span className="relative rounded-full px-3 py-1 text-sm leading-6 text-indigo-400 ring-1 ring-indigo-500/30 hover:ring-indigo-500/50">
                v1.0 Public Beta is Live
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
              Master Cyber Security <br />
              One Flag at a Time.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              DotFlag is a modern platform designed to test your skills in Web Exploitation, 
              Cryptography, and Reverse Engineering. Learn by doing.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/challenges"
                className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all"
              >
                Start Hacking
              </Link>
              <Link to="/about" className="text-sm font-semibold leading-6 text-white hover:text-indigo-400 transition">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="py-24 sm:py-32 bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-400">Why DotFlag?</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Everything you need to become an expert
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              
              {/* Feature 1 */}
              <div className="flex flex-col items-start bg-slate-900/50 p-8 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-colors duration-300">
                <div className="rounded-lg bg-slate-800 p-2 ring-1 ring-white/10">
                  <Globe className="h-6 w-6 text-indigo-400" />
                </div>
                <dt className="mt-4 font-semibold text-white">Web Exploitation</dt>
                <dd className="mt-2 leading-7 text-slate-400">
                  Learn to identify real-world vulnerabilities like SQL Injection, XSS, and CSRF in a safe environment.
                </dd>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-start bg-slate-900/50 p-8 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-colors duration-300">
                <div className="rounded-lg bg-slate-800 p-2 ring-1 ring-white/10">
                  <Lock className="h-6 w-6 text-indigo-400" />
                </div>
                <dt className="mt-4 font-semibold text-white">Cryptography</dt>
                <dd className="mt-2 leading-7 text-slate-400">
                   Break codes, decrypt messages, and understand modern encryption algorithms and hashing.
                </dd>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-start bg-slate-900/50 p-8 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-colors duration-300">
                <div className="rounded-lg bg-slate-800 p-2 ring-1 ring-white/10">
                  <Code className="h-6 w-6 text-indigo-400" />
                </div>
                <dt className="mt-4 font-semibold text-white">Secure Coding</dt>
                <dd className="mt-2 leading-7 text-slate-400">
                  Don't just attack - learn how to write secure code and patch the vulnerabilities you find.
                </dd>
              </div>

            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}