import { Eyebrow } from '@/components/Eyebrow';

// Bayrol und Beatbot sind mit dem Pool-Sortiment dazugekommen.
// Markennamen Bayrol/Beatbot final mit Kunde verifizieren.
const BRANDS = [
  'Rainbird',
  'Hunter',
  'Netafim',
  'Pedrollo',
  'Kress',
  'Husqvarna',
  'In-Lite',
  'Bayrol',
  'Beatbot',
];

export function BrandWall() {
  return (
    <section className="overflow-hidden border-t border-mist bg-paper py-24 md:py-32">
      <div className="container">
        <div data-reveal>
        <Eyebrow number="05">Partner</Eyebrow>
        <h2 className="h-display mt-6 max-w-2xl text-4xl md:text-5xl">
          Wir wählen <em className="italic">streng</em>.
        </h2>
        </div>
      </div>

      <div className="mt-16 overflow-hidden" aria-hidden>
        <div className="animate-marquee flex gap-16 whitespace-nowrap">
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <span
              key={i}
              className="font-display text-[76px] leading-none tracking-tight text-ink/90 md:text-[110px]"
            >
              {b}
              <span className="text-bronze">·</span>
            </span>
          ))}
        </div>
      </div>
      <p className="sr-only">
        Partnermarken: {BRANDS.join(', ')}.
      </p>
    </section>
  );
}
