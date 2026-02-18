import { Link } from 'react-router-dom';
import { ROUTES } from '../../router/paths';

export default function CtaSection() {
  return (
    <div className="relative isolate overflow-hidden bg-slate-950 px-4 sm:px-6 py-20 sm:py-28 border-t border-white/[0.04]">
      <div className="absolute top-0 right-0 -z-10 w-[60rem] opacity-15 transform translate-x-1/2">
        <div className="aspect-[1100/800] w-full bg-gradient-to-bl from-indigo-500 to-green-500 blur-[120px]" />
      </div>
      <div className="absolute inset-0 noise opacity-20" />

      <div className="mx-auto max-w-7xl text-center relative z-10">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Ready to test your skills?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-slate-500 leading-relaxed">
          Create an account, join a team, and start solving challenges. The leaderboard is waiting for you.
        </p>
        <div className="mt-8">
          <Link
            to={ROUTES.REGISTER}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-all active:scale-[0.98]"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
