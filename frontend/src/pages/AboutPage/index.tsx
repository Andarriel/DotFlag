import { SystemStatus, TechStack, TeamSection } from './components';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-900 py-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Platform Status & Team
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-400">
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