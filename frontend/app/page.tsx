import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import FeaturedTemples from '@/components/home/FeaturedTemples';
import FeaturesSection from '@/components/home/FeaturesSection';
import HowItWorks from '@/components/home/HowItWorks';
import CityCarousel from '@/components/home/CityCarousel';
import FinalCTA from '@/components/home/FinalCTA';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <StatsSection />
      <FeaturedTemples />
      <FeaturesSection />
      <HowItWorks />
      <CityCarousel />
      <FinalCTA />
    </main>
  );
}

