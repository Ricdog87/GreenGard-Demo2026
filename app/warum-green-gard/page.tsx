import Image from 'next/image';
import Link from 'next/link';
import { Eyebrow } from '@/components/Eyebrow';
import { PullQuote } from '@/components/PullQuote';
import { Button } from '@/components/ui/button';
import { CONTACT } from '@/lib/contact';
import { team, teamGruppenfoto } from '@/lib/data';

export const metadata = {
  title: 'Warum Green-Gard · Wiesbaden seit 2006',
  description:
    'Wer wir sind, wie wir auswählen und warum wir mit GaLaBau-Betrieben auf Augenhöhe arbeiten. Seit 2006 in Wiesbaden.',
};

const YEARS = new Date().getFullYear() - CONTACT.foundedYear;

export default function WarumGreenGardPage() {
  return (
    <article>
      <section className="border-b border-mist bg-paper">
        <div className="container py-24 md:py-40">
          <Eyebrow number="00">Warum Green-Gard</Eyebrow>
          <h1 className="hero-h mt-8 max-w-[18ch]">
            <span className="num">{YEARS}</span> Jahre <em className="italic">Hingabe</em>.
          </h1>
          <p className="font-mono mt-12 text-[11px] uppercase tracking-[0.18em] text-moss">
            Wiesbaden · Est. {CONTACT.foundedYear} · Kapitel I – IV
          </p>
        </div>
      </section>

      <section className="container max-w-3xl py-24 md:py-32">
        <p className="eyebrow">Kapitel I · Beginn</p>
        <h2 className="h-display mb-10 mt-6 text-balance text-4xl md:text-5xl">
          Eine kleine Werkstatt in Wiesbaden.
        </h2>
        <p className="dropcap text-lg leading-[1.7] text-ink/85">
          Als {CONTACT.company.replace(' GmbH', '')} {CONTACT.foundedYear} mit einer Werkbank,
          einem Telefon und drei Rainbird-Mustern die Geschäftstür aufschloss, war Smart
          Garden noch ein abstraktes Wort. Aber die Idee war schon da: dass Bewässerung
          kein Baumarkt-Thema sein muss, sondern Handwerk, das mit guter Planung beginnt. Dass ein
          Garten Atmosphäre braucht — und dass Technik dabei dienen muss, nicht dominieren.
          Zwei Jahrzehnte später ist der Anspruch unverändert. Nur der Lieferwagen ist neu.
        </p>
      </section>

      <PullQuote attribution="Jan Leifermann">
        Wir verkaufen keine Regner. Wir verkaufen die Ruhe eines Gartens, der sich um sich selbst kümmert.
      </PullQuote>

      <section className="container max-w-3xl py-24 md:py-32">
        <p className="eyebrow">Kapitel II · Auswahl</p>
        <h2 className="h-display mb-10 mt-6 text-balance text-4xl md:text-5xl">
          Wir wählen <em className="italic">streng</em>.
        </h2>
        <p className="dropcap text-lg leading-[1.7] text-ink/85">
          Im Sortiment ist nichts, was uns nicht selbst überzeugt hätte. Hunter und Rainbird
          haben sich über Jahrzehnte bewiesen — wir führen beide, weil sie in
          unterschiedlichen Situationen unterschiedliche Stärken haben. Netafim ist die
          Referenz für druckkompensierten Tropfschlauch. Pedrollo baut die zuverlässigsten
          Pumpen, die wir je im Bestand hatten. Kress hat die Robotik neu erfunden — keine
          Begrenzungsdrähte mehr, RTK-Satellitennavigation, 53 dB. In-Lite liefert mit dem
          12V-Steckersystem das, was Beleuchtung sein sollte: schnell installiert,
          blendfrei, jahrelang dicht. Und für den Pool arbeiten wir mit Bayrol und Beatbot,
          weil Wasserpflege planbar sein soll und nicht zum Hobby werden muss.
        </p>
      </section>

      <section className="container py-12 md:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="relative aspect-[5/4] overflow-hidden bg-linen">
              <Image
                src="/videos/hero-poster.jpg"
                alt="Versenkregner auf gepflegtem Rasen im Abendlicht"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                data-parallax="7"
                className="object-cover"
                data-cursor="view"
              />
            </div>
          </div>
          <div className="lg:col-span-5">
            <p className="eyebrow">Bild · I</p>
            <p className="font-display mt-4 text-xl italic text-moss">
              Bewässerung beginnt vor dem ersten Tropfen — beim Verstehen, was ein Garten
              braucht.
            </p>
          </div>
        </div>
      </section>

      <section className="container max-w-3xl py-24 md:py-32">
        <p className="eyebrow">Kapitel III · Handwerk</p>
        <h2 className="h-display mb-10 mt-6 text-balance text-4xl md:text-5xl">
          Mit GaLaBauern auf Augenhöhe.
        </h2>
        <p className="dropcap text-lg leading-[1.7] text-ink/85">
          Wir haben uns früh entschieden, nicht am Handwerk vorbei zu verkaufen. Wer eine Anlage installieren lässt, soll einen GaLaBauer haben, der mit
          unseren Komponenten arbeitet und für sie einsteht. Wir liefern Lager, Schulungen
          und Direktfahrten — sie liefern Hände, Verstand und Verantwortung. Diese
          Arbeitsteilung ist das eigentliche Geschäftsmodell: 450 Projekte pro Jahr laufen
          so, ohne dass wir jede Baustelle selbst betreten.{' '}
          <Link href="/profi" className="border-b border-mist hover:border-ink" data-cursor="hover">
            Konditionen für Profis →
          </Link>
        </p>
      </section>

      {/* Team — bewusst ohne Rollenbezeichnungen (Kundenwunsch) */}
      <section className="border-t border-mist bg-linen py-24 md:py-32">
        <div className="container">
          <Eyebrow number="T">Team</Eyebrow>
          <h2 className="h-display mt-6 max-w-3xl text-4xl md:text-6xl">
            Die Menschen <em className="italic">dahinter</em>.
          </h2>
          <p className="mt-6 max-w-xl text-ink/70">
            Kurze Wege, feste Ansprechpartner. Schreiben Sie direkt der Person, mit der Sie
            zuletzt gesprochen haben — oder an {CONTACT.email}.
          </p>

          {/* Gruppenaufnahme 2025 — Originaldatei vom Kunden */}
          <figure data-reveal className="relative mt-14 aspect-[16/9] overflow-hidden bg-paper">
            <Image
              src={teamGruppenfoto}
              alt="Das Team von Green Gard, Aufnahme 2025"
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover"
            />
          </figure>

          {/* Porträts liegen im Original gemischt vor (S/W und Farbe) — Graustufen
              vereinheitlicht sie, Farbe kommt beim Hover zurück. */}
          <div data-reveal-group className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3">
            {team.map((m) => (
              <div key={m.email} className="group">
                <div className="relative aspect-[3/4] overflow-hidden bg-paper">
                  <Image
                    src={m.photo}
                    alt={`${m.first} ${m.last}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover grayscale transition-[transform,filter] [transition-duration:1200ms] group-hover:scale-[1.03] group-hover:grayscale-0"
                  />
                </div>
                <div className="mt-4 border-t border-mist pt-3">
                  <h3 className="font-display text-xl tracking-tight">
                    {m.first} {m.last}
                  </h3>
                  <a
                    href={`mailto:${m.email}`}
                    data-cursor="hover"
                    className="font-mono mt-1 block break-all text-[10px] uppercase tracking-[0.12em] text-moss hover:text-bronze"
                  >
                    {m.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rainworks — Platzhaltertext */}
      <section className="container max-w-3xl py-24 md:py-32">
        <p className="eyebrow">Partnerschaft</p>
        <h2 className="h-display mb-10 mt-6 text-balance text-4xl md:text-5xl">
          Rainworks.
        </h2>
        {/* TODO: Rainworks-Text vom Kunden. */}
        <p className="text-lg leading-[1.7] text-ink/85">
          Mit Rainworks verbindet uns eine Partnerschaft, die über den Handel hinausgeht:
          gemeinsame Projektplanung, abgestimmte Systemauslegung und ein direkter Draht,
          wenn es auf der Baustelle schnell gehen muss. Für unsere Kunden heißt das:
          Komponenten, Planung und Ausführung greifen ineinander, ohne dass jemand zwischen
          zwei Ansprechpartnern vermitteln muss.
        </p>
        <p className="font-mono mt-6 text-[10px] uppercase tracking-[0.16em] text-ink/45">
          Platzhaltertext · finale Fassung folgt vom Kunden
        </p>
      </section>

      <section className="border-y border-mist bg-forest py-24 text-linen md:py-32">
        <div className="container max-w-3xl">
          <Eyebrow number="IV" className="text-linen/70 [&>span:first-child]:bg-linen/30">
            Brief des Geschäftsführers
          </Eyebrow>
          <h2 className="h-display mb-10 mt-6 text-balance text-4xl md:text-5xl">
            An die, die das hier lesen.
          </h2>
          <p className="text-lg leading-[1.7] text-linen/85">
            Wenn Sie planen, in den nächsten Jahren etwas Festes anzulegen — sei es der
            erste Smart-Garden oder die Aufrüstung einer bestehenden Anlage — sprechen Sie
            mit uns. Wir empfehlen, was zu Ihrer Situation passt, auch wenn das bedeutet,
            weniger zu verkaufen. Wir sind Händler, ja. Aber vor allem sind wir Gärtner — und das färbt ab.
          </p>
          <p className="font-display mt-12 text-2xl italic text-linen">Jan Leifermann</p>
          <p className="font-mono mt-1 text-[10px] uppercase tracking-[0.18em] text-linen/60">
            Geschäftsführer · {CONTACT.company}
          </p>
        </div>
      </section>

      <section className="container py-24 text-center md:py-32">
        <h2 className="h-display text-balance text-4xl md:text-6xl">
          Lust auf ein <em className="italic">Gespräch</em>?
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button asChild variant="primary" size="lg">
            <Link href="/beratung">Termin vereinbaren →</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/planung">Planung beginnen</Link>
          </Button>
        </div>
      </section>
    </article>
  );
}
