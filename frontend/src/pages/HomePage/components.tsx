import { Link } from 'react-router-dom';
import { ArrowRight, Medal, Zap, Target, Globe, Lock, Code } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ROUTES } from '../../router/paths';

/* Reusable blocks */

interface StatItemProps {
  icon: LucideIcon;
  iconColor: string;
  label: string;
  value: string | number;
}

export function StatItem({ icon: Icon, iconColor, label, value }: StatItemProps) {
  return (
    <div className="flex flex-col gap-y-2 p-4 rounded-2xl hover:bg-slate-800/50 transition duration-300">
      <dt className="text-base leading-7 text-slate-400 flex items-center justify-center gap-2">
        <Icon className={`h-5 w-5 ${iconColor}`} /> {label}
      </dt>
      <dd className="order-first text-4xl font-bold tracking-tight text-white sm:text-5xl">
        {value}
      </dd>
    </div>
  );
}

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col items-start bg-slate-900/40 p-8 rounded-2xl border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/80 transition-all duration-300 group">
      <div className="rounded-lg bg-slate-800 p-3 ring-1 ring-white/10 group-hover:bg-indigo-600 transition-colors">
        <Icon className="h-6 w-6 text-indigo-400 group-hover:text-white" />
      </div>
      <dt className="mt-4 font-semibold text-white">{title}</dt>
      <dd className="mt-2 leading-7 text-slate-400">{description}</dd>
    </div>
  );
}

/* Page sections */

export function HeroSection() {
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
            <Link
              to={ROUTES.CHALLENGES}
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
  );
}

interface StatsSectionProps {
  totalPlayers: number;
  totalPoints: number;
  totalSolved: number;
}

export function StatsSection({ totalPlayers, totalPoints, totalSolved }: StatsSectionProps) {
  return (
    <div className="border-y border-slate-800 bg-slate-950/50 backdrop-blur-sm relative z-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-3 sm:gap-x-10 text-center">
          <StatItem icon={Medal} iconColor="text-yellow-500" label="Total Players" value={totalPlayers} />
          <StatItem icon={Zap} iconColor="text-indigo-500" label="Points Earned" value={totalPoints.toLocaleString()} />
          <StatItem icon={Target} iconColor="text-green-500" label="Challenges Solved" value={totalSolved} />
        </div>
      </div>
    </div>
  );
}

const FEATURES = [
  {
    icon: Globe,
    title: 'Web Exploitation',
    description: 'Learn to identify real-world vulnerabilities like SQL Injection, XSS, and CSRF in a safe environment.',
  },
  {
    icon: Lock,
    title: 'Cryptography',
    description: 'Break codes, decrypt messages, and understand modern encryption algorithms and hashing.',
  },
  {
    icon: Code,
    title: 'Secure Coding',
    description: "Don't just attack - learn how to write secure code and patch the vulnerabilities you find.",
  },
];

export function FeaturesSection() {
  return (
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
            {FEATURES.map(f => (
              <FeatureCard key={f.title} icon={f.icon} title={f.title} description={f.description} />
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

export function CtaSection() {
  return (
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
            to={ROUTES.REGISTER}
            className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
