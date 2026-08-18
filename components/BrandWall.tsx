import Image from 'next/image';
import { Eyebrow } from '@/components/Eyebrow';

/**
 * Logos, die auf green-gard.de als Partner geführt werden.
 *
 * Umbau 18.08.2026 (Kundenwunsch): Die große Namens-Laufschrift ist raus —
 * stattdessen laufen die Original-Logos selbst als Karussell automatisch
 * durch, ohne dass jemand klicken muss. Bei reduzierter Bewegung steht der
 * Streifen still (globals.css schaltet animate-marquee ab).
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

      {/* Logo-Karussell: Liste doppelt, Animation fährt exakt -50 % — nahtlose
          Schleife. Abstand als margin an der Kachel (nicht als flex-gap), damit
          die halbe Streifenbreite genau auf einer Kachelgrenze liegt.
          Die Logodateien des Kunden haben keinen Alphakanal — der weiße Grund
          wird zur Kachel, einheitliche Geometrie statt acht Freisteller. */}
      <div className="mt-16 overflow-hidden" aria-hidden>
        <div className="animate-marquee flex w-max">
          {[...LOGOS, ...LOGOS].map((l, i) => (
            <div
              key={`${l.slug}-${i}`}
              className="group relative mr-3 aspect-[5/2] w-40 shrink-0 overflow-hidden border border-mist bg-white sm:w-48"
            >
              <Image
                src={`/img/foto/marke/${l.slug}.png`}
                alt=""
                fill
                sizes="192px"
                className="object-contain p-3 grayscale transition duration-500 group-hover:grayscale-0"
              />
            </div>
          ))}
        </div>
      </div>

      <p className="sr-only">
        Partnermarken: {LOGOS.map((l) => l.name).join(', ')}.
      </p>
    </section>
  );
}
