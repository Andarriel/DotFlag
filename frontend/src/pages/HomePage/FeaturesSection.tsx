import { Globe, Lock, Code, type LucideIcon } from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const Icon = feature.icon;
  return (
    <div className={`flex flex-col items-start glass rounded-2xl p-6 sm:p-8 gradient-border hover:bg-slate-800/30 transition-all duration-300 group animate-fade-in-up opacity-0 stagger-${Math.min(index + 1, 5)}`}>
      <div className="w-11 h-11 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-600/20 group-hover:border-indigo-500/30 transition-all">
        <Icon className="h-5 w-5 text-indigo-400" />
      </div>
      <dt className="mt-4 font-semibold text-white">{feature.title}</dt>
      <dd className="mt-2 text-sm leading-relaxed text-slate-500">{feature.description}</dd>
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
    <div id="features" className="py-20 sm:py-28 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12 sm:mb-16">
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-3">Why DotFlag?</p>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Everything you need to become an expert
          </p>
        </div>
        <dl className="grid max-w-xl grid-cols-1 gap-5 lg:max-w-none lg:grid-cols-3 mx-auto">
          {FEATURES.map((f, i) => <FeatureCard key={f.title} feature={f} index={i} />)}
        </dl>
      </div>
    </div>
  );
}
