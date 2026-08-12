import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { AudienceBar } from '@/components/AudienceBar';
import { ManifestIntro } from '@/components/ManifestIntro';
import { CategoryGrid } from '@/components/CategoryGrid';
import { AudienceVorteile } from '@/components/AudienceVorteile';
import { SaisonModul } from '@/components/SaisonModul';
import { Highlights } from '@/components/Highlights';
import { BewaesserungsRechner } from '@/components/BewaesserungsRechner';
import { KitCard } from '@/components/KitCard';
import { PullQuote } from '@/components/PullQuote';
import { FeaturedSystem } from '@/components/FeaturedSystem';
import { BrandWall } from '@/components/BrandWall';
import { Stats } from '@/components/Stats';
import { TestimonialSlider } from '@/components/TestimonialSlider';
import { CTABanner } from '@/components/CTABanner';
import { FAQ } from '@/components/FAQ';
import { Eyebrow } from '@/components/Eyebrow';
import { Button } from '@/components/ui/button';
import { starterKits } from '@/lib/data';

export default function LandingPage() {
  // Auf der Landing die drei Bewässerungs-/Licht-Kits zeigen; das Mähroboter-Kit
  // hat direkt darunter seine eigene Featured-Section.
  const teaserKits = starterKits.slice(0, 3);

  return (
    <>
      <Hero />
      <AudienceBar />
      <ManifestIntro />
      <AudienceVorteile />
      <CategoryGrid />
      <Highlights />
      <TestimonialSlider />
      <SaisonModul />
      <BewaesserungsRechner />

      <section className="border-t border-mist py-28 md:py-40">
        <div className="container">
          <div data-reveal className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow number="04b">Starter Kits</Eyebrow>
              <h2 className="h-display mt-6 text-4xl md:text-6xl">
                Vier Kits.
                <br />
                <em className="italic">Ein Ausgangspunkt.</em>
              </h2>
            </div>
            <p className="max-w-md text-ink/70">
              Zusammenstellungen, die sich in hunderten Projekten bewährt haben — als
              Orientierung. Was am Ende verbaut wird, entscheidet die Systemplanung —
              Preise stehen tagesaktuell im Shop.
            </p>
          </div>
          <div data-reveal-group className="grid gap-6 lg:grid-cols-3">
            {teaserKits.map((k) => (
              <KitCard key={k.slug} kit={k} />
            ))}
          </div>
          <div className="mt-10">
            <Button asChild variant="outline" size="lg">
              <Link href="/starter-kits">Alle Starter Kits im Vergleich</Link>
            </Button>
          </div>
        </div>
      </section>

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
