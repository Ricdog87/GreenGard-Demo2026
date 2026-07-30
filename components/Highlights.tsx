import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getHighlightProducts } from '@/lib/data';
import { Eyebrow } from '@/components/Eyebrow';
import { HighlightPrice } from '@/components/HighlightPrice';

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
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow number="03">Highlights</Eyebrow>
            <h2 className="h-display mt-6 text-4xl md:text-6xl">
              Neu im <em className="italic">Sortiment</em>.
            </h2>
          </div>
          <Link
            href="/produkte"
            data-cursor="hover"
            className="font-mono inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] hover:text-bronze"
          >
            Alle Produkte <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Mobile: horizontal scrollbar mit Snap. Ab lg: klassisches Dreier-Raster.
          Kein negatives Margin — das würde auf 375px den Body überbreit machen. */}
      <div className="snap-row flex gap-5 overflow-x-auto px-5 pb-2 lg:mx-auto lg:grid lg:max-w-[1320px] lg:grid-cols-3 lg:gap-8 lg:overflow-visible">
        {items.map((p) => (
          <article
            key={p.slug}
            className="snap-item group w-[78vw] shrink-0 sm:w-[52vw] lg:w-auto"
          >
            <Link
              href={`/produkte/${p.slug}`}
              data-cursor="view"
              className="relative block aspect-[4/3] overflow-hidden bg-paper"
            >
              <Image
                src={p.image}
                alt={p.name}
                fill
                sizes="(max-width: 1024px) 78vw, 33vw"
                className="object-cover transition-transform [transition-duration:1200ms] group-hover:scale-[1.04]"
              />
              <span className="font-mono absolute left-3 top-3 bg-bronze px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-linen">
                Neu
              </span>
            </Link>
            <div className="mt-5 flex items-start justify-between gap-4 border-t border-mist pt-4">
              <div>
                <p className="eyebrow text-ink/50">{p.brand}</p>
                <h3 className="font-display mt-1 text-xl leading-tight tracking-tight">
                  <Link href={`/produkte/${p.slug}`} data-cursor="hover" className="hover:text-bronze">
                    {p.name}
                  </Link>
                </h3>
                <HighlightPrice netPrice={p.netPrice} />
              </div>
              <span className="mt-1 font-mono text-xs">→</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
