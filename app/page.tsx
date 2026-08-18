import { Hero } from '@/components/Hero';
import { AudienceBar } from '@/components/AudienceBar';
import { ManifestIntro } from '@/components/ManifestIntro';
import { CategoryGrid } from '@/components/CategoryGrid';
import { AudienceVorteile } from '@/components/AudienceVorteile';
import { SaisonModul } from '@/components/SaisonModul';
import { Highlights } from '@/components/Highlights';
import { BewaesserungsRechner } from '@/components/BewaesserungsRechner';
import { PullQuote } from '@/components/PullQuote';
import { FeaturedSystem } from '@/components/FeaturedSystem';
import { BrandWall } from '@/components/BrandWall';
import { Stats } from '@/components/Stats';
import { TestimonialSlider } from '@/components/TestimonialSlider';
import { CTABanner } from '@/components/CTABanner';
import { FAQ } from '@/components/FAQ';

export default function LandingPage() {
  // Kits-Teaser 18.08.2026 auf Kundenwunsch von der Landing entfernt —
  // die Kits leben weiter auf /starter-kits (Rechner-Empfehlung, Footer).
  return (
    <>
      <Hero />
      <AudienceBar />
      <ManifestIntro />
      <AudienceVorteile />
      <CategoryGrid />
      <TestimonialSlider />
      <Highlights />
      <SaisonModul />
      <BewaesserungsRechner />

      <PullQuote attribution="Jan Leifermann · Vertriebsleiter">
        Luxus im Garten ist nicht das, was man sieht. Es ist das, was man nie wieder tun muss.
      </PullQuote>

      <FeaturedSystem />
      <BrandWall />
      <Stats />
      <CTABanner />
      <FAQ />
    </>
  );
}
