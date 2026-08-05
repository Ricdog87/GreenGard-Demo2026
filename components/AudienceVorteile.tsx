'use client';

import Link from 'next/link';
import { useCart } from '@/store/cart';
import { AUDIENCES } from '@/lib/audience';
import { Eyebrow } from '@/components/Eyebrow';
import { Button } from '@/components/ui/button';

/**
 * Leistungsversprechen passend zur gewählten Zielgruppe.
 *
 * Green Gard führt dafür bisher drei getrennte Partnerseiten
 * (/galabauer-installateure, /privatkunden, /fachhaendler). Hier stehen sie
 * an einer Stelle und wechseln mit der Auswahl aus dem Entry-Fenster — die
 * Besucherin sieht nur, was für sie gilt.
 */
export function AudienceVorteile() {
  const audience = useCart((s) => s.audience);
  const a = AUDIENCES[audience];

  return (
    <section className="border-t border-mist bg-linen py-20 md:py-28">
      <div className="container grid gap-12 lg:grid-cols-12">
        <div data-reveal className="lg:col-span-5">
          {/* 01b: sitzt zwischen Manifest (01) und Disziplinen (02) — 03 gehört
              den Highlights, wie bei den Starter Kits mit 04b. */}
          <Eyebrow number="01b">Für {a.title}</Eyebrow>
          <h2 className="h-display mt-6 text-balance text-4xl md:text-5xl">
            Was Sie von uns <em className="italic">erwarten dürfen</em>.
          </h2>
          <p className="mt-6 max-w-md text-ink/70">{a.detail}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild>
              <Link href={a.links[0].href}>{a.links[0].label}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/beratung">Beratung vereinbaren</Link>
            </Button>
          </div>
        </div>

        <div className="lg:col-span-7">
          <ul data-reveal-group className="border-t border-mist">
            {a.vorteile.map((v, i) => (
              <li key={v} className="flex gap-6 border-b border-mist py-5">
                <span className="font-mono num pt-1 text-[11px] uppercase tracking-[0.18em] text-moss">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="leading-relaxed text-ink/85">{v}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
