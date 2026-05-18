import { Hero } from '@/components/Hero';
import { ManifestIntro } from '@/components/ManifestIntro';
import { BewaesserungsRechner } from '@/components/BewaesserungsRechner';
import { CategoryGrid } from '@/components/CategoryGrid';
import { PullQuote } from '@/components/PullQuote';
import { FeaturedSystem } from '@/components/FeaturedSystem';
import { BrandWall } from '@/components/BrandWall';
import { Stats } from '@/components/Stats';
import { TestimonialSlider } from '@/components/TestimonialSlider';
import { CTABanner } from '@/components/CTABanner';
import { FAQ } from '@/components/FAQ';
import { PaketCard } from '@/components/PaketCard';
import { Eyebrow } from '@/components/Eyebrow';
import pakete from '@/data/pakete.json';

export default function LandingPage() {
  return (
    <>
      <Hero />
      <ManifestIntro />
      <CategoryGrid />
      <BewaesserungsRechner />

      <section className="py-28 md:py-40 border-t border-mist">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <Eyebrow number="04">Systeme</Eyebrow>
              <h2 className="h-display text-4xl md:text-6xl mt-6">Drei Systeme.<br /><em className="italic">Drei Größen.</em></h2>
            </div>
            <p className="max-w-md text-ink/70">
              Vorgeplante Kompositionen — geliefert und auf Wunsch installiert.
              Jedes System lässt sich später modular erweitern.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            {pakete.map((p) => <PaketCard key={p.slug} p={p as any} />)}
          </div>
        </div>
      </section>

      <PullQuote attribution="Felix Berger · Geschäftsführer">
        Ein Garten ist kein Projekt. Er ist eine Behauptung.
      </PullQuote>

      <FeaturedSystem />
      <BrandWall />
      <Stats />
      <TestimonialSlider />
      <CTABanner />
      <FAQ />
    </>
  );
}
