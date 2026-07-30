import Link from 'next/link';
import { Eyebrow } from '@/components/Eyebrow';
import { CONTACT } from '@/lib/contact';

export function ManifestIntro() {
  return (
    <section className="border-t border-mist bg-paper py-28 md:py-40">
      <div className="container grid grid-cols-1 gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <Eyebrow number="01">Haltung</Eyebrow>
          <p className="font-mono mt-12 hidden text-[11px] uppercase tracking-[0.18em] text-moss md:block">
            {CONTACT.city} · {CONTACT.street}
          </p>
        </div>
        <div className="md:col-span-7">
          <h2 data-reveal className="h-display text-balance text-4xl md:text-6xl lg:text-7xl">
            Wir verkaufen keine Produkte. Wir machen Gärten <em className="italic">luxuriöser</em>.
          </h2>
          <div data-reveal-group className="mt-12 grid gap-8 text-[17px] leading-relaxed text-ink/80 sm:grid-cols-2">
            <p className="dropcap">
              Luxus im Garten heißt nicht mehr Fläche — er heißt mehr Sorglosigkeit. Die Bewässerung läuft im Morgengrauen, der Mähroboter zieht lautlos seine Bahnen, das Poolwasser bleibt von selbst klar, und am Abend setzt das Licht Haus und Bäume in Szene. Ohne dass Sie einen Handgriff tun. Dieses Gefühl ist unser Produkt.
            </p>
            <p>
              Seit {CONTACT.foundedYear} rüsten wir Gärten mit den besten Herstellern ihrer Klasse auf: Hunter und Rainbird für die Bewässerung, Kress und Husqvarna für die Robotik, In-Lite für das Licht, Bayrol und Beatbot für den Pool. Wir planen das System, liefern ab Lager und stehen mit unserem Namen für jedes Projekt ein.{' '}
              <Link
                href="/warum-green-gard"
                data-cursor="hover"
                className="border-b border-mist hover:border-ink"
              >
                Mehr →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
