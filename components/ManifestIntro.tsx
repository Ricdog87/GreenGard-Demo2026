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
          <h2 className="h-display text-balance text-4xl md:text-6xl lg:text-7xl">
            Wir verkaufen keine Produkte. Wir planen <em className="italic">Systeme</em>.
          </h2>
          <div className="mt-12 grid gap-8 text-[17px] leading-relaxed text-ink/80 sm:grid-cols-2">
            <p className="dropcap">
              Ein Garten ist mehr als Rasen, Beet und Hecke. Er ist ein Raum, in dem
              Familien wachsen, Gespräche entstehen und Stille möglich wird. Unsere
              Aufgabe ist nicht, Komponenten zu liefern — sondern dafür zu sorgen,
              dass alles, was Technik braucht, unsichtbar bleibt.
            </p>
            <p>
              Seit {CONTACT.foundedYear} arbeiten wir mit den weltbesten Herstellern für
              Bewässerung, Steuerung, Beleuchtung, Robotik und Poolpflege. Wir wählen
              Komponenten aus, planen Systeme, schulen Handwerker — und stehen für jedes
              Projekt mit unserem Namen ein.{' '}
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
