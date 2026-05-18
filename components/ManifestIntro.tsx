import Link from 'next/link';
import { Eyebrow } from '@/components/Eyebrow';

export function ManifestIntro() {
  return (
    <section className="py-28 md:py-40 border-t border-mist bg-paper">
      <div className="container grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <Eyebrow number="01">Manifest</Eyebrow>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-moss mt-12 hidden md:block">
            Wiesbaden · Mainzer Straße 142
          </p>
        </div>
        <div className="md:col-span-7">
          <h2 className="h-display text-4xl md:text-6xl lg:text-7xl text-balance">
            Wir verkaufen keine Produkte. Wir komponieren <em className="italic">Atmosphäre</em>.
          </h2>
          <div className="mt-12 grid sm:grid-cols-2 gap-8 text-[17px] leading-relaxed text-ink/80">
            <p className="dropcap">
              Ein Garten ist mehr als Rasen, Beet und Hecke. Er ist ein Raum, in dem
              Familien wachsen, Gespräche entstehen und Stille möglich wird. Unsere
              Aufgabe ist nicht, Komponenten zu liefern — sondern dafür zu sorgen,
              dass alles, was Technik braucht, unsichtbar bleibt.
            </p>
            <p>
              Seit 2004 arbeiten wir mit den weltbesten Herstellern für Bewässerung,
              Steuerung, Beleuchtung und Robotik. Wir wählen Komponenten aus, planen
              Systeme, schulen Handwerker — und stehen für jedes Projekt mit unserem
              Namen ein. <Link href="/manifest" data-cursor="hover" className="border-b border-mist hover:border-ink">Mehr →</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
