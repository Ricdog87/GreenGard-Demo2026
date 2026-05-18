'use client';

import { Eyebrow } from '@/components/Eyebrow';

const BRANDS = ['Rainbird', 'Hunter', 'Netafim', 'Pedrollo', 'Kress', 'Husqvarna', 'In-Lite'];

export function BrandWall() {
  return (
    <section className="border-t border-mist bg-paper overflow-hidden py-24 md:py-32">
      <div className="container">
        <Eyebrow number="04">Partner</Eyebrow>
        <h2 className="h-display text-4xl md:text-5xl mt-6 max-w-2xl">
          Wir wählen <em className="italic">streng</em>.
        </h2>
      </div>

      <div className="mt-16 overflow-hidden">
        <div className="flex gap-16 whitespace-nowrap animate-marquee">
          {[...BRANDS, ...BRANDS, ...BRANDS].map((b, i) => (
            <span
              key={i}
              className="font-display text-[88px] md:text-[120px] tracking-tight text-ink/90 leading-none"
            >
              {b}
              <span className="text-bronze">·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
