import { Check } from 'lucide-react';
import { Eyebrow } from '@/components/Eyebrow';
import { SERVICES } from '@/lib/services';
import { AUSFUEHRUNG } from '@/lib/contact';
import { formatEURRound } from '@/lib/utils';

/**
 * Was Green Gard rund um den Verkauf tatsächlich leistet — inklusive der
 * Grenze: eingebaut wird von Fachbetrieben, nicht von uns.
 */
export function Serviceleistungen() {
  return (
    <section id="service" className="scroll-mt-20 border-t border-mist py-20 md:py-28">
      <div className="container">
        <div data-reveal className="max-w-3xl">
          <Eyebrow number="S">Service</Eyebrow>
          <h2 className="h-display mt-6 text-balance text-4xl md:text-5xl">
            Vor dem Kauf, während der Umsetzung, <em className="italic">danach</em>.
          </h2>
          <p className="mt-6 text-ink/70">{AUSFUEHRUNG.hinweis} {AUSFUEHRUNG.vermittlung}</p>
        </div>

        <div data-reveal-group className="mt-12 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <article key={s.slug} className="min-w-0 border-t border-mist pt-5">
              <h3 className="font-display text-xl tracking-tight">{s.titel}</h3>
              <p className="font-display mt-1 text-sm italic text-moss">{s.claim}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">{s.text}</p>

              {s.punkte && (
                <ul className="mt-4 space-y-2 text-sm text-ink/75">
                  {s.punkte.map((p) => (
                    <li key={p} className="flex gap-2.5">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              )}

              {s.preis !== undefined && (
                <p className="mt-4 flex items-baseline gap-2">
                  <span className="price text-2xl">{formatEURRound(s.preis)}</span>
                  {s.preisHinweis && (
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/50">
                      {s.preisHinweis}
                    </span>
                  )}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
