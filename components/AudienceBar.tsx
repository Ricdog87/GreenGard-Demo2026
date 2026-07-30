'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useCart } from '@/store/cart';
import { AUDIENCES } from '@/lib/audience';

/**
 * Schnelleinstiege direkt unter dem Hero — passend zur Auswahl aus dem
 * Entry-Fenster. GaLaBau landet bei Konditionen, Architekten bei der Planung,
 * Privatkunden bei Kits und Rechner.
 */
export function AudienceBar() {
  const audience = useCart((s) => s.audience);
  const resetAudience = useCart((s) => s.resetAudience);
  const a = AUDIENCES[audience];

  return (
    <section className="border-b border-mist bg-forest text-linen">
      <div className="container py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-linen/60">
            Ansicht: <span className="text-linen">{a.title}</span>
            <button
              type="button"
              data-cursor="hover"
              onClick={resetAudience}
              className="ml-3 border-b border-linen/30 pb-0.5 transition-colors hover:border-bronze hover:text-bronze"
            >
              wechseln
            </button>
          </p>

          <div className="grid gap-3 sm:grid-cols-3 lg:flex lg:items-center lg:gap-8">
            {a.links.map((l) => (
              <Link
                key={l.href + l.label}
                href={l.href}
                data-cursor="hover"
                className="group flex items-baseline gap-2 text-sm transition-colors hover:text-bronze"
              >
                <span>
                  {l.label}
                  <span className="font-mono ml-2 hidden text-[10px] uppercase tracking-[0.16em] text-linen/50 xl:inline">
                    {l.note}
                  </span>
                </span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
