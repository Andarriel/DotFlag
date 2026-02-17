import { Link } from 'react-router-dom';
import { ROUTES } from '../../router/paths';

export default function CtaSection() {
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
