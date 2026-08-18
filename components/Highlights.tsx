import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getHighlightProducts } from '@/lib/data';
import { Eyebrow } from '@/components/Eyebrow';

/**
 * Kuratierte Highlights. Reihenfolge und Auswahl kommen aus data/highlights.json —
 * der Kunde tauscht dort nur Slugs, ohne Code anzufassen.
 */
export function Highlights() {
  const items = getHighlightProducts();
  if (items.length === 0) return null;

  return (
    <section className="border-t border-mist bg-linen py-24 md:py-32">
      <div className="container">
        <div data-reveal className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow number="03">Top-Seller</Eyebrow>
            <h2 className="h-display mt-6 text-4xl md:text-6xl">
              Unsere <em className="italic">Top-Seller</em>.
            </h2>
          </div>
          <Link
            href="/produkte"
            data-cursor="hover"
            className="font-mono inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] hover:text-bronze"
          >
            Das Sortiment <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Mobile: horizontal scrollbar mit Snap. Ab lg: klassisches Dreier-Raster.
          Kein negatives Margin — das würde auf 375px den Body überbreit machen. */}
      {/* max-w exakt wie .container (1280 inkl. Padding) — alles darüber läuft
          auf 1280-px-Displays aus dem Viewport heraus. */}
      <div data-reveal-group className="snap-row flex gap-5 overflow-x-auto px-5 pb-2 lg:mx-auto lg:grid lg:max-w-[1280px] lg:grid-cols-4 lg:gap-6 lg:overflow-visible">
        {items.map((p) => (
          <article
            key={p.slug}
            className="snap-item group w-[78vw] shrink-0 sm:w-[52vw] lg:w-auto"
          >
            {/* Kein Link mehr: der neue Shop ist noch nicht live (18.08.2026). */}
            <div className="relative block aspect-[4/5] overflow-hidden border border-mist bg-white">
              {/* object-contain: die vier Formate (quadratisch, quer, hoch)
                  bleiben unbeschnitten — Freisteller auf Weiß. */}
              <Image
                src={p.image}
                alt={p.name}
                fill
                sizes="(max-width: 1024px) 78vw, 25vw"
                className="object-contain p-6 transition-transform [transition-duration:1200ms] group-hover:scale-[1.03]"
              />
              <span className="font-mono absolute left-3 top-3 bg-bronze px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-linen">
                Top-Seller
              </span>
            </div>
            <div className="mt-5 border-t border-mist pt-4">
              <p className="eyebrow text-ink/50">{p.brand}</p>
              <h3 className="font-display mt-1 text-xl leading-tight tracking-tight">{p.name}</h3>
              {/* Kein Preis — Preise pflegt allein der Shop (Meeting 12.08.2026). */}
              <p className="font-mono mt-2 text-[10px] uppercase tracking-[0.16em] text-ink/50">
                Bald im Shop verfügbar
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
