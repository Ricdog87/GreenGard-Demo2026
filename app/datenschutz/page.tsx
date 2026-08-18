import { Eyebrow } from '@/components/Eyebrow';
import rechtliches from '@/data/rechtliches.json';

/**
 * Datenschutzerklärung — Inhalt 1:1 von green-gard.de/datenschutz
 * (abgerufen 12.08.2026). Der chocoBRAIN-Baukasten-Absatz der alten Agentur
 * wurde entfernt; der Rest bleibt Wort für Wort, bis Green Gard eine an die
 * neue Technik angepasste Fassung liefert (siehe UEBERGABE.md).
 */
export const metadata = {
  title: 'Datenschutzerklärung · Green-Gard',
  robots: { index: false, follow: true },
};

export default function DatenschutzPage() {
  return (
    <article className="container max-w-3xl py-20 md:py-28">
      <Eyebrow>Rechtliches</Eyebrow>
      <h1 className="h-display mt-6 text-4xl md:text-6xl">Datenschutzerklärung</h1>
      <div className="mt-12 space-y-10">
        {rechtliches.datenschutz.map((b, i) => (
          <section key={i}>
            {b.titel && <h2 className="font-display text-xl tracking-tight md:text-2xl">{b.titel}</h2>}
            <div className="mt-3 space-y-2 text-sm leading-relaxed text-ink/80">
              {b.absaetze.map((a, j) => (
                <p key={j}>{a}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
