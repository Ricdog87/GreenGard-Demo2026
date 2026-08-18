import Image from 'next/image';
import Link from 'next/link';
import { Eyebrow } from '@/components/Eyebrow';
import { Button } from '@/components/ui/button';
import { CONTACT } from '@/lib/contact';
import { RAINWORKS_URL } from '@/lib/links';
import { rainworks as rw } from '@/lib/data';

// Inhalte kommen 1:1 von green-gard.de/rainworks (data/rainworks.json).
// Geändert wurde nur die Form — der Wortlaut bleibt, wie ihn der Kunde führt.

export const metadata = {
  title: `${rw.titel} · ${rw.untertitel}`,
  description: rw.mitgliederText.slice(0, 155),
};

/** Häkchen wie auf der Kundenseite, hier als Vektor statt als Bilddatei. */
function Haken() {
  return (
    <span
      aria-hidden
      className="mt-[0.45rem] inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-moss/12"
    >
      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-moss" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 6.4 4.6 9 10 3.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function Liste({ punkte }: { punkte: readonly string[] }) {
  return (
    <ul data-reveal-group className="mt-8 space-y-4">
      {punkte.map((p) => (
        <li key={p} className="flex gap-4 text-lg leading-[1.65] text-ink/85">
          <Haken />
          <span>{p}</span>
        </li>
      ))}
    </ul>
  );
}

export default function RainworksPage() {
  return (
    <article>
      <section className="border-b border-mist bg-paper">
        <div className="container py-24 md:py-40">
          <Eyebrow number="00">Allianz</Eyebrow>
          <h1 className="hero-h mt-8 max-w-[14ch]">{rw.titel}</h1>
          <p className="h-display mt-8 max-w-[22ch] text-2xl italic text-ink/70 md:text-3xl">
            {rw.untertitel}
          </p>
          <p className="font-mono mt-12 text-[11px] uppercase tracking-[0.18em] text-moss">
            International Irrigation Experts · {rw.karte.mitglieder.length} Mitglieder in Europa
          </p>
        </div>
      </section>

      {/* Vorteile für Green-Gard-Kunden */}
      <section className="container max-w-3xl py-24 md:py-32">
        <p className="eyebrow">Kapitel I · Vorteil</p>
        <h2 className="h-display mt-6 text-balance text-4xl md:text-5xl">
          {rw.vorteileTitel}
        </h2>
        <Liste punkte={rw.vorteile} />
      </section>

      {/* Mitglieder + Karte */}
      <section className="border-y border-mist bg-linen py-24 md:py-32">
        <div className="container">
          <div className="max-w-3xl">
            <p className="eyebrow">Kapitel II · Mitglieder</p>
            <h2 className="h-display mt-6 text-balance text-4xl md:text-5xl">
              {rw.mitgliederTitel}
            </h2>
            <p className="mt-8 text-lg leading-[1.7] text-ink/85">{rw.mitgliederText}</p>
          </div>

          <figure data-reveal className="mt-14">
            <div className="relative mx-auto max-w-4xl overflow-hidden bg-paper">
              <Image
                src={rw.karte.src}
                alt={rw.karte.alt}
                width={1600}
                height={1540}
                sizes="(max-width: 768px) 100vw, 900px"
                className="h-auto w-full"
              />
            </div>
            <figcaption className="font-mono mx-auto mt-5 max-w-4xl text-[10px] uppercase tracking-[0.16em] text-ink/45">
              {rw.karte.mitglieder.join(' · ')}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Diagramm */}
      <section className="container py-24 md:py-32">
        <div className="max-w-3xl">
          <p className="eyebrow">Kapitel III · Struktur</p>
          <h2 className="h-display mt-6 text-balance text-4xl md:text-5xl">
            Was <em className="italic">hineingeht</em>, und was dabei herauskommt.
          </h2>
        </div>
        <figure data-reveal className="mt-12 overflow-x-auto">
          <div className="relative mx-auto min-w-[560px] max-w-5xl">
            <Image
              src={rw.diagramm.src}
              alt={rw.diagramm.alt}
              width={1600}
              height={539}
              sizes="(max-width: 1024px) 100vw, 1000px"
              className="h-auto w-full"
            />
          </div>
        </figure>
      </section>

      {/* Unsere Arbeit */}
      <section className="border-t border-mist bg-linen py-24 md:py-32">
        <div className="container max-w-3xl">
          <p className="eyebrow">Kapitel IV · Arbeit</p>
          <h2 className="h-display mt-6 text-balance text-4xl md:text-5xl">
            {rw.arbeitTitel}
          </h2>
          <p className="mt-8 text-lg leading-[1.7] text-ink/85">{rw.arbeitIntro}</p>
          <Liste punkte={rw.arbeitPunkte} />

          <p className="mt-16 text-lg leading-[1.7] text-ink/85">{rw.ergebnisIntro}</p>
          <Liste punkte={rw.ergebnisPunkte} />
        </div>
      </section>

      <section className="container py-24 md:py-32">
        <div className="grid items-end gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <Eyebrow>Weiter</Eyebrow>
            <h2 className="h-display mt-6 text-balance text-3xl md:text-4xl">
              Was die Allianz bringt, landet bei Ihnen auf der{' '}
              <em className="italic">Baustelle</em>.
            </h2>
          </div>
          <div className="flex flex-wrap gap-4 md:col-span-5 md:justify-end">
            <Button asChild>
              <Link href="/warum-green-gard">Warum Green-Gard</Link>
            </Button>
            {/* Externer Link zur Rainworks-Website — Meeting 18.08.2026. */}
            <Button asChild variant="outline">
              <a href={RAINWORKS_URL} target="_blank" rel="noopener noreferrer">
                rainworks.eu ↗
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={`mailto:${CONTACT.email}`}>Kontakt aufnehmen</a>
            </Button>
          </div>
        </div>
      </section>
    </article>
  );
}
