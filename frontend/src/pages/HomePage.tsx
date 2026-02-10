import { Link } from 'react-router-dom';
import { Lock, Code, Globe, Target, Medal, Zap, ArrowRight } from 'lucide-react';
import { MOCK_LEADERBOARD } from '../data/mockData';

export default function HomePage() {
  const totalPlayers = MOCK_LEADERBOARD.length;
  const totalPoints = MOCK_LEADERBOARD.reduce((sum, e) => sum + e.currentPoints, 0);
  const totalSolved = MOCK_LEADERBOARD.reduce((sum, e) => sum + e.solvedChallenges, 0);

  return (
    <div className="bg-slate-900 min-h-screen">
      
      {/* 1. HERO SECTION */}
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
              <Link
                to="/challenges"
                className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 hover:scale-105 transition-all duration-200"
              >
                Start Hacking
              </Link>
              <a href="#features" className="text-sm font-semibold leading-6 text-white hover:text-indigo-400 transition flex items-center gap-1">
                Learn more <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* STATS SECTION */}
      <div className="border-y border-slate-800 bg-slate-950/50 backdrop-blur-sm relative z-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-3 sm:gap-x-10 text-center">
            
            <div className="flex flex-col gap-y-2 p-4 rounded-2xl hover:bg-slate-800/50 transition duration-300">
              <dt className="text-base leading-7 text-slate-400 flex items-center justify-center gap-2">
                 <Medal className="h-5 w-5 text-yellow-500" /> Total Players
              </dt>
              <dd className="order-first text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {totalPlayers}
              </dd>
            </div>

            <div className="flex flex-col gap-y-2 p-4 rounded-2xl hover:bg-slate-800/50 transition duration-300">
              <dt className="text-base leading-7 text-slate-400 flex items-center justify-center gap-2">
                <Zap className="h-5 w-5 text-indigo-500" /> Points Earned
              </dt>
              <dd className="order-first text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {totalPoints.toLocaleString()}
              </dd>
            </div>

            <div className="flex flex-col gap-y-2 p-4 rounded-2xl hover:bg-slate-800/50 transition duration-300">
              <dt className="text-base leading-7 text-slate-400 flex items-center justify-center gap-2">
                <Target className="h-5 w-5 text-green-500" /> Challenges Solved
              </dt>
              <dd className="order-first text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {totalSolved}
              </dd>
            </div>

          </div>
        </div>
      </div>

      {/* 3. FEATURES SECTION */}
      <div id="features" className="py-24 sm:py-32 bg-slate-950">
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
              <div className="flex flex-col items-start bg-slate-900/40 p-8 rounded-2xl border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/80 transition-all duration-300 group">
                <div className="rounded-lg bg-slate-800 p-3 ring-1 ring-white/10 group-hover:bg-indigo-600 transition-colors">
                  <Globe className="h-6 w-6 text-indigo-400 group-hover:text-white" />
                </div>
                <dt className="mt-4 font-semibold text-white">Web Exploitation</dt>
                <dd className="mt-2 leading-7 text-slate-400">
                  Learn to identify real-world vulnerabilities like SQL Injection, XSS, and CSRF in a safe environment.
                </dd>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-start bg-slate-900/40 p-8 rounded-2xl border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/80 transition-all duration-300 group">
                <div className="rounded-lg bg-slate-800 p-3 ring-1 ring-white/10 group-hover:bg-indigo-600 transition-colors">
                  <Lock className="h-6 w-6 text-indigo-400 group-hover:text-white" />
                </div>
                <dt className="mt-4 font-semibold text-white">Cryptography</dt>
                <dd className="mt-2 leading-7 text-slate-400">
                   Break codes, decrypt messages, and understand modern encryption algorithms and hashing.
                </dd>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-start bg-slate-900/40 p-8 rounded-2xl border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/80 transition-all duration-300 group">
                <div className="rounded-lg bg-slate-800 p-3 ring-1 ring-white/10 group-hover:bg-indigo-600 transition-colors">
                  <Code className="h-6 w-6 text-indigo-400 group-hover:text-white" />
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

      {/* 4. Final CTA Section */}
      <div className="relative isolate overflow-hidden bg-slate-900 px-6 py-24 shadow-2xl sm:px-24 xl:py-32 border-t border-slate-800">
         <div className="absolute top-0 right-0 -z-10 w-[60rem] opacity-20 transform translate-x-1/2">
             <div className="aspect-[1100/800] w-full bg-gradient-to-bl from-indigo-500 to-green-500 blur-3xl" />
        </div>
        
        <div className="mx-auto max-w-7xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to test your skills?
                <br />
                Join the competition today.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-300">
                Create an account, join a team, and start solving challenges. The leaderboard is waiting for you.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
                to="/login"
                className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all"
            >
                Get Started
            </Link>
            </div>
        </div>
      </div>

    </div>
  );
}