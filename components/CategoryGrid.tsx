import Link from 'next/link';
import Image from 'next/image';
import categories from '@/data/categories.json';
import { Eyebrow } from '@/components/Eyebrow';

const MANIFESTS: Record<string, { roman: string; line: string; rename?: string }> = {
  bewaesserung: { roman: 'I', line: 'Choreografierte Tropfen.' },
  steuerung: { roman: 'II', line: 'Wetter wird Code.' },
  pumpentechnik: { roman: 'III', line: 'Stiller Druck.' },
  beleuchtung: { roman: 'IV', line: 'Licht als Material.' },
  maehroboter: { roman: 'V', line: 'Autonome Hingabe.', rename: 'Robotik' },
  zubehoer: { roman: 'VI', line: 'Stille Schaltzentrale.' },
};

export function CategoryGrid() {
  return (
    <section className="py-28 md:py-40 border-t border-mist">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <Eyebrow number="02">Disziplinen</Eyebrow>
            <h2 className="h-display text-4xl md:text-6xl mt-6">Sechs Disziplinen.<br/><em className="italic">Eine Atmosphäre.</em></h2>
          </div>
          <p className="max-w-md text-ink/70">
            Jede Disziplin wird einzeln geplant und beherrscht — und im System
            zusammengeführt. Was du siehst, ist immer das Ergebnis.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {categories.map((c) => {
            const m = MANIFESTS[c.slug] ?? { roman: '–', line: '' };
            return (
              <Link
                key={c.slug}
                href={`/kollektion?cat=${c.slug}`}
                data-cursor="view"
                className="group block"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-linen">
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
                  />
                </div>
                <div className="mt-6 flex items-start justify-between gap-4 border-t border-mist pt-4">
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-moss">{m.roman}</span>
                    <h3 className="font-display text-2xl tracking-tight mt-1">{m.rename ?? c.name}</h3>
                    <p className="font-display italic text-moss text-sm mt-1">{m.line}</p>
                  </div>
                  <span className="font-mono text-xs mt-1">→</span>
                </div>
                <p className="mt-3 text-sm text-ink/70 max-w-[34ch]">{c.blurb}</p>
                <p className="num font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50 mt-3">
                  ab {c.abPreis.toFixed(2)} €
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
