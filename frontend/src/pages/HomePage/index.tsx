import { useHomeStats } from '../../hooks/useHomeStats';
import { HeroSection, StatsSection, FeaturesSection, CtaSection } from './components';

export default function HomePage() {
  const { totalPlayers, totalPoints, totalSolved } = useHomeStats();

  return (
    <div className="bg-slate-900 min-h-screen">
      <HeroSection />
      <StatsSection totalPlayers={totalPlayers} totalPoints={totalPoints} totalSolved={totalSolved} />
      <FeaturesSection />
      <CtaSection />
    </div>
  );
}
