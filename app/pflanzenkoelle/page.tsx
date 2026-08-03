import type { Metadata } from 'next';
import { Lock, Play } from 'lucide-react';
import { Eyebrow } from '@/components/Eyebrow';
import { CONTACT } from '@/lib/contact';
import { ProjektFormular } from './ProjektFormular';
import standorte from '@/data/pflanzenkoelle-standorte.json';

// Kundennummer aus der Standortliste des Kunden (Termin 31.07.2026).
const KUNDENNUMMER = '116057';

// Die Seite ist ausschließlich über den direkten Link erreichbar: kein Eintrag
// in Menü oder Footer, kein Index. Der Kundenname steht bewusst NICHT im Titel
// und nicht in der Description — Suchmaschinen und Link-Vorschauen sollen ihn
// nicht ausspielen (Wettbewerbsgründe, Absprache mit Jan).
export const metadata: Metadata = {
  title: 'Projektanfrage · Geschützter Bereich',
  description: 'Interner Projektbereich. Nicht öffentlich.',
  robots: { index: false, follow: false },
};

// TODO: Die echten Erklärvideos folgen — dann je Kachel eine Video-ID hinterlegen
// und den Platzhalter durch den Player ersetzen.
const VIDEOS = [
  { nr: 'I', titel: 'Wassermenge bei 2,5 bar richtig messen', dauer: '4:12' },
  { nr: 'II', titel: 'Hunter Hydrawise einrichten und Zonen anlegen', dauer: '6:38' },
  { nr: 'III', titel: 'Tropfschlauch im Beet — Abstände und Verlegung', dauer: '5:05' },
  { nr: 'IV', titel: 'Anlage winterfest machen: entleeren und ausblasen', dauer: '3:47' },
];

export default function PflanzenkoellePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-forest text-linen">
        <div className="container relative py-24 md:py-36">
          <Eyebrow className="text-linen/70 [&>span:first-child]:bg-linen/30">
            Geschützter Projektbereich
          </Eyebrow>
          <h1 className="hero-h mt-8 max-w-[16ch]">
            Projekt <em className="italic">melden</em>.
          </h1>
          <p className="mt-10 max-w-xl leading-relaxed text-linen/80">
            Dieses Formular fragt alles ab, was wir für die Auslegung einer Bewässerung
            brauchen: Standort, Wasserquelle, Wassermenge bei 2,5 bar, Pumpe, Flächen und
            Steuergerät. Eine vollständige Anfrage erspart beiden Seiten das Nachtelefonieren
            — wir gehen direkt in die Planung und melden uns mit Auslegung und Stückliste
            zurück.
          </p>

          <dl className="mt-14 grid gap-x-10 gap-y-8 border-t border-linen/15 pt-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="min-w-0">
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-linen/55">
                Kunde
              </dt>
              <dd className="font-display mt-2 text-2xl tracking-tight">Pflanzenkölle</dd>
            </div>
            <div className="min-w-0">
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-linen/55">
                Kundennummer
              </dt>
              <dd className="num font-mono mt-2 text-2xl tracking-[0.02em]">{KUNDENNUMMER}</dd>
            </div>
            <div className="min-w-0">
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-linen/55">
                Hinterlegte Standorte
              </dt>
              <dd className="num font-display mt-2 text-2xl tracking-tight">{standorte.length}</dd>
            </div>
            <div className="min-w-0">
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-linen/55">
                Rückmeldung
              </dt>
              <dd className="font-display mt-2 text-2xl tracking-tight">2 Werktage</dd>
            </div>
          </dl>

          <p className="mt-12 flex items-start gap-3 text-sm text-linen/55">
            <Lock aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="max-w-lg">
              Diese Seite ist weder verlinkt noch über Suchmaschinen auffindbar. Bitte geben
              Sie ausschließlich den direkten Link innerhalb Ihres Hauses weiter.
            </span>
          </p>
        </div>
      </section>

      <ProjektFormular kundennummer={KUNDENNUMMER} />

      <section className="border-t border-mist py-24 md:py-32">
        <div className="container">
          <Eyebrow number="V">Erklärvideos</Eyebrow>
          <h2 className="h-display mt-6 max-w-2xl text-balance text-4xl md:text-5xl">
            Die vier Handgriffe, nach denen am <em className="italic">häufigsten</em> gefragt wird.
          </h2>
          <p className="mt-6 max-w-xl text-ink/70">
            Kurze Anleitungen für Ihre Mitarbeitenden — damit Messung, Inbetriebnahme und
            Einwinterung ohne Rückruf gelingen.
          </p>

          <div
            data-reveal-group
            className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {VIDEOS.map((v) => (
              <article key={v.nr} className="min-w-0 border border-mist bg-paper">
                <div className="relative flex aspect-video items-center justify-center bg-forest">
                  <span
                    aria-hidden
                    className="grid h-14 w-14 place-items-center rounded-full border border-linen/30 text-linen"
                  >
                    <Play className="h-5 w-5 translate-x-[1px]" />
                  </span>
                  <span className="num font-mono absolute bottom-3 right-3 text-[10px] tracking-[0.14em] text-linen/60">
                    {v.dauer}
                  </span>
                </div>
                <div className="p-5">
                  <p className="eyebrow">Kapitel {v.nr}</p>
                  <h3 className="font-display mt-2 text-xl leading-tight tracking-tight">
                    {v.titel}
                  </h3>
                  <p className="font-mono mt-4 text-[10px] uppercase tracking-[0.16em] text-ink/45">
                    In Vorbereitung
                  </p>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-12 text-sm text-ink/60">
            Etwas fehlt oder Sie brauchen ein Video zu einem anderen Thema? Schreiben Sie uns
            an{' '}
            <a
              href={`mailto:${CONTACT.email}`}
              data-cursor="hover"
              className="underline decoration-mist underline-offset-4 hover:decoration-ink"
            >
              {CONTACT.email}
            </a>{' '}
            oder rufen Sie an:{' '}
            <a
              href={CONTACT.phoneHref}
              data-cursor="hover"
              className="num underline decoration-mist underline-offset-4 hover:decoration-ink"
            >
              {CONTACT.phoneDisplay}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
