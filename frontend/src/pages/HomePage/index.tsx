import HeroSection from './HeroSection';
import StatsSection from './StatsSection';
import HallOfFame from './HallOfFame';
import ChallengesShowcase from './ChallengesShowcase';
import CtaSection from './CtaSection';

export default function HomePage() {
  return (
    <div className="bg-slate-950 min-h-screen">
      <HeroSection />
      <StatsSection />
      <HallOfFame />
      <ChallengesShowcase />
      <CtaSection />
    </div>
  );
}
