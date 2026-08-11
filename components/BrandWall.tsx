import Image from 'next/image';
import { Eyebrow } from '@/components/Eyebrow';

/**
 * Logos, die auf green-gard.de als Partner geführt werden. Die Laufschrift
 * darüber bleibt die Bühne; die Logos darunter sind der Beleg — ein GaLaBauer
 * erkennt sie im Vorbeiscrollen, ohne lesen zu müssen.
 *
 * TODO: Nutzungsfreigabe je Hersteller bestätigen (OFFENE-PUNKTE B6).
 */
const LOGOS = [
  { slug: 'rainbird', name: 'Rain Bird' },
  { slug: 'hunter', name: 'Hunter' },
  { slug: 'in-lite', name: 'In-Lite' },
  { slug: 'kress', name: 'Kress' },
  { slug: 'husqvarna', name: 'Husqvarna' },
  { slug: 'pedrollo', name: 'Pedrollo' },
  { slug: 'speck', name: 'Speck' },
  { slug: 'rainworks', name: 'Rainworks' },
];

// Bayrol und Beatbot sind mit dem Pool-Sortiment dazugekommen.
// Markennamen Bayrol/Beatbot final mit Kunde verifizieren.
const BRANDS = [
  'Rainbird',
  'Hunter',
  'Netafim',
  'Rain',
  'Pedrollo',
  'Speck',
  'Grundfos',
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
      <div className="container">
        {/* Die Logodateien des Kunden haben keinen Alphakanal. Statt gegen den
            weißen Grund zu arbeiten, wird er zur Kachel — einheitliche
            Geometrie, ruhiger als acht verschieden große Freisteller. */}
        <div
          data-reveal-group
          className="mt-16 grid grid-cols-2 gap-3 border-t border-mist pt-12 sm:grid-cols-4 lg:grid-cols-8"
        >
          {LOGOS.map((l) => (
            <div
              key={l.slug}
              className="group relative aspect-[5/2] overflow-hidden border border-mist bg-white"
            >
              <Image
                src={`/img/foto/marke/${l.slug}.png`}
                alt={l.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 12vw"
                className="object-contain p-3 grayscale transition duration-500 group-hover:grayscale-0"
              />
            </div>
          ))}
        </div>
      </div>

      <p className="sr-only">
        Partnermarken: {BRANDS.join(', ')}.
      </p>
    </section>
  );
}
