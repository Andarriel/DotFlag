import { Globe, Lock, Code, type LucideIcon } from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

function FeatureCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon;
  return (
    <div className="flex flex-col items-start bg-slate-900/40 p-8 rounded-2xl border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/80 transition-all duration-300 group">
      <div className="rounded-lg bg-slate-800 p-3 ring-1 ring-white/10 group-hover:bg-indigo-600 transition-colors">
        <Icon className="h-6 w-6 text-indigo-400 group-hover:text-white" />
      </div>
      <dt className="mt-4 font-semibold text-white">{feature.title}</dt>
      <dd className="mt-2 leading-7 text-slate-400">{feature.description}</dd>
    </div>
  );
}

const FEATURES: Feature[] = [
  { icon: Globe, title: 'Web Exploitation', description: 'Learn to identify real-world vulnerabilities like SQL Injection, XSS, and CSRF in a safe environment.' },
  { icon: Lock, title: 'Cryptography', description: 'Break codes, decrypt messages, and understand modern encryption algorithms and hashing.' },
  { icon: Code, title: 'Secure Coding', description: "Don't just attack - learn how to write secure code and patch the vulnerabilities you find." },
];

export default function FeaturesSection() {
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
            {FEATURES.map(f => <FeatureCard key={f.title} feature={f} />)}
          </dl>
        </div>
      </div>
    </div>
  );
}
