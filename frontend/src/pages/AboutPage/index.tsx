import { SystemStatus, TechStack, TeamSection } from './components';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Platform Status & Team
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-500 leading-relaxed">
            Transparency is key in security. Monitor our infrastructure status in real-time.
          </p>
        </div>

        <SystemStatus />
        <TechStack />
        <TeamSection />
      </div>
    </div>
  );
}
