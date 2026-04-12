import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ROUTES } from '../../router/paths';

export default function CtaSection() {
  return (
    <div className="relative isolate overflow-hidden bg-slate-950 px-4 sm:px-6 py-20 sm:py-28">
      {/* Gradient atmosphere */}
      <div className="absolute inset-0 hero-gradient opacity-50 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/15 to-transparent" />
      <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />

      <div className="mx-auto max-w-7xl text-center relative z-10">
        <p className="font-mono text-[11px] text-indigo-400/60 uppercase tracking-[0.2em] mb-5">
          &gt; initialize
        </p>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white text-glow">
          Your move.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-slate-500">
          Create an account and start capturing flags.
        </p>
        <div className="mt-8">
          <Link
            to={ROUTES.REGISTER}
            className="group inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-300 relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>
      </div>
    </div>
  );
}
