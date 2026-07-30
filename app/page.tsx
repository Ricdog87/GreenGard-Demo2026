import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { AudienceBar } from '@/components/AudienceBar';
import { ManifestIntro } from '@/components/ManifestIntro';
import { CategoryGrid } from '@/components/CategoryGrid';
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
      <CategoryGrid />
      <Highlights />
      <BewaesserungsRechner />

      <section className="border-t border-mist py-28 md:py-40">
        <div className="container">
          <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
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
              Orientierung mit „ab“-Preis. Was am Ende verbaut wird, entscheidet die
              kostenlose Systemplanung.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
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

      <PullQuote attribution="Jan Leifermann · Geschäftsführer">
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
