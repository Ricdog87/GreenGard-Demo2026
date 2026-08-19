'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useCart } from '@/store/cart';
import { AUDIENCES } from '@/lib/audience';

/**
 * Schnelleinstiege direkt unter dem Hero. Standardansicht ist Privat;
 * wer über den Profi-Login kommt, sieht die Profi-Einstiege (Konditionen,
 * Planung). Der frühere „Ansicht wechseln“-Knopf ist raus (18.08.2026) —
 * es gibt kein Entry-Fenster mehr, das er öffnen könnte.
 */
export function AudienceBar() {
  const audience = useCart((s) => s.audience);
  const a = AUDIENCES[audience];

  return (
    <section className="border-b border-mist bg-forest text-linen">
      <div className="container py-5">
        <div data-reveal className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-linen/60">
            Schnelleinstieg
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
