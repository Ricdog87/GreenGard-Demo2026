import Link from 'next/link';
import Image from 'next/image';
import { categories } from '@/lib/data';
import { Eyebrow } from '@/components/Eyebrow';
import { cn } from '@/lib/utils';

export function CategoryGrid() {
  return (
    <section className="border-t border-mist py-28 md:py-40">
      <div className="container">
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow number="02">Disziplinen</Eyebrow>
            <h2 className="h-display mt-6 text-4xl md:text-6xl">
              Sieben Disziplinen.
              <br />
              <em className="italic">Ein Garten.</em>
            </h2>
          </div>
          <p className="max-w-md text-ink/70">
            Jede Disziplin ist für sich ein Upgrade. Zusammen ergeben sie einen Garten, der sich um sich selbst kümmert.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => {
            // Sieben Karten in einem Dreier-Raster: die letzte läuft doppelt breit
            // aus und schließt die Reihe editorial ab, statt allein zu stehen.
            const isWide = i === categories.length - 1;
            return (
              <Link
                key={c.slug}
                href={`/produkte?cat=${c.slug}`}
                data-cursor="view"
                className={cn('group block', isWide && 'sm:col-span-2')}
              >
                <div
                  className={cn(
                    'relative overflow-hidden bg-linen',
                    isWide ? 'aspect-[4/5] sm:aspect-[16/9]' : 'aspect-[4/5]'
                  )}
                >
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    sizes={
                      isWide
                        ? '(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 66vw'
                        : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                    }
                    className="object-cover transition-transform [transition-duration:1200ms] group-hover:scale-[1.04]"
                  />
                </div>
                <div className="mt-6 flex items-start justify-between gap-4 border-t border-mist pt-4">
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-moss">
                      {c.roman}
                    </span>
                    <h3 className="font-display mt-1 text-2xl tracking-tight">{c.name}</h3>
                    <p className="font-display mt-1 text-sm italic text-moss">{c.manifest}</p>
                  </div>
                  <span className="mt-1 font-mono text-xs">→</span>
                </div>
                <p className="mt-3 max-w-[42ch] text-sm text-ink/70">{c.blurb}</p>
                <p className="num font-mono mt-3 text-[11px] uppercase tracking-[0.18em] text-ink/50">
                  ab {c.abPreis.toFixed(2).replace('.', ',')} €
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
