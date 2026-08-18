import { Eyebrow } from '@/components/Eyebrow';
import rechtliches from '@/data/rechtliches.json';

/**
 * Impressum — Inhalt 1:1 von green-gard.de/impressum (abgerufen 12.08.2026).
 * Pflichtseite nach §5 DDG; ohne sie darf die Seite nicht live gehen.
 * E-Mail-Adresse aus dem Spam-Schutz der alten Seite wiederhergestellt.
 */
export const metadata = {
  title: 'Impressum · Green-Gard',
  robots: { index: false, follow: true },
};

export default function ImpressumPage() {
  return (
    <article className="container max-w-3xl py-20 md:py-28">
      <Eyebrow>Rechtliches</Eyebrow>
      <h1 className="h-display mt-6 text-4xl md:text-6xl">Impressum</h1>
      <div className="mt-12 space-y-10">
        {rechtliches.impressum.map((b, i) => (
          <section key={i}>
            {b.titel && <h2 className="font-display text-2xl tracking-tight">{b.titel}</h2>}
            <div className="mt-3 space-y-2 leading-relaxed text-ink/80">
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
