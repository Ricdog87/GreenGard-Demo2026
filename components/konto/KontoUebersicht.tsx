'use client';

import { Badge } from '@/components/ui/badge';
import {
  DEMO_KONTO,
  STATUS_LABEL,
  PROJEKT_LABEL,
  type Bestellung,
} from '@/lib/konto-daten';

/**
 * ISO-Datum rein als Zeichenkette umdrehen (2026-07-22 → 22.07.2026).
 * Bewusst ohne toLocaleDateString: Server und Client müssen zeichengenau
 * dasselbe ausgeben, sonst meldet React einen Hydration-Fehler.
 */
function deDatum(iso: string): string {
  const [jahr, monat, tag] = iso.split('-');
  if (!jahr || !monat || !tag) return iso;
  return `${tag}.${monat}.${jahr}`;
}

const STATUS_VARIANT: Record<Bestellung['status'], 'mist' | 'bronze' | 'outline'> = {
  geliefert: 'mist',
  unterwegs: 'bronze',
  in_bearbeitung: 'outline',
};

export function KontoUebersicht() {
  const { ansprechpartner, zahlungsziel, bestellungen, projekte } = DEMO_KONTO;

  const offeneBestellungen = bestellungen.filter((b) => b.status !== 'geliefert').length;
  const laufendeProjekte = projekte.filter((p) => p.status !== 'umgesetzt').length;

  // Bezugsjahr aus den Daten ableiten statt aus new Date(): Der Server dürfte
  // sonst ein anderes Jahr sehen als der Client, und die Kennzahl behauptet
  // "laufendes Jahr", während sie in Wahrheit alles aufsummiert.
  const bezugsjahr = bestellungen
    .reduce((juengstes, b) => (b.datum > juengstes ? b.datum : juengstes), '')
    .slice(0, 4);
  const bestellungenImJahr = bestellungen.filter((b) => b.datum.startsWith(bezugsjahr)).length;

  // Jüngste zuerst — ISO-Datumsangaben lassen sich direkt als Zeichenkette sortieren.
  const zuletztBestellt = [...bestellungen]
    .sort((a, b) => b.datum.localeCompare(a.datum))
    .slice(0, 3);

  const naechsteSchritte = projekte.filter(
    (p) => p.status === 'anfrage' || p.status === 'planung'
  );

  const kennzahlen: { label: string; wert: string; klein?: boolean }[] = [
    { label: 'Offene Bestellungen', wert: String(offeneBestellungen) },
    { label: 'Laufende Projekte', wert: String(laufendeProjekte) },
    // Bestellwert entfernt — keine Preise im Dashboard (Meeting 12.08.2026).
    { label: `Bestellungen ${bezugsjahr}`, wert: String(bestellungenImJahr), klein: false },
    { label: 'Zahlungsziel', wert: zahlungsziel, klein: true },
  ];

  return (
    <section className="py-4">
      {/* Begrüßung — Firma und Kundennummer stehen bereits im Seitenkopf. */}
      <div data-reveal>
        <h2 className="h-display max-w-3xl text-balance text-3xl md:text-4xl">
          Guten Tag, <em className="italic">{ansprechpartner}</em>.
        </h2>
      </div>

      {/* Kennzahlen */}
      <div
        data-reveal-group
        className="mt-14 grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-12"
      >
        {kennzahlen.map((k) => (
          <div key={k.label} className="min-w-0 border-t border-mist pt-6">
            <span
              className={
                k.klein
                  ? 'font-display num block break-words text-2xl tracking-tight md:text-3xl'
                  : 'font-display num block text-5xl tracking-tightest md:text-6xl'
              }
            >
              {k.wert}
            </span>
            <p className="font-mono mt-3 text-[11px] uppercase tracking-[0.18em] text-ink/70">
              {k.label}
            </p>
          </div>
        ))}
      </div>

      {/* Zwei Spalten: Historie kurz, Aufgaben kurz */}
      <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div data-reveal className="min-w-0">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-moss">
            Zuletzt bestellt
          </h3>
          <ul className="mt-5 border-t border-mist">
            {zuletztBestellt.map((b) => (
              <li
                key={b.nummer}
                className="flex flex-wrap items-baseline gap-x-4 gap-y-2 border-b border-mist py-4"
              >
                <span className="font-mono num min-w-0 text-[12px] tracking-[0.08em] text-ink">
                  {b.nummer}
                </span>
                <span className="font-mono num text-[11px] uppercase tracking-[0.14em] text-ink/45">
                  {deDatum(b.datum)}
                </span>
                <Badge variant={STATUS_VARIANT[b.status]}>{STATUS_LABEL[b.status]}</Badge>
                {/* Kein Bestellwert — Preise stehen im Shop (Meeting 12.08.2026). */}
                <span className="num font-mono ml-auto whitespace-nowrap text-[11px] uppercase tracking-[0.14em] text-ink/45">
                  {b.positionen.length} {b.positionen.length === 1 ? 'Position' : 'Positionen'}
                </span>
              </li>
            ))}
          </ul>
          <p className="font-mono mt-4 text-[10px] uppercase tracking-[0.16em] text-ink/40">
            Preise und Konditionen folgen im neuen Shop — bald verfügbar.
          </p>
        </div>

        <div data-reveal className="min-w-0">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-moss">
            Nächste Schritte
          </h3>
          <ul className="mt-5 border-t border-mist">
            {naechsteSchritte.map((p) => (
              <li key={p.id} className="border-b border-mist py-4">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                  <span className="font-display min-w-0 text-lg leading-snug tracking-tight">
                    {p.name}
                  </span>
                  <Badge variant="outline" className="ml-auto">
                    {PROJEKT_LABEL[p.status]}
                  </Badge>
                </div>
                <p className="font-mono num mt-1.5 text-[11px] uppercase tracking-[0.14em] text-ink/45">
                  {p.ort} · {p.flaecheQm} m²
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{p.notiz}</p>
              </li>
            ))}
            {naechsteSchritte.length === 0 && (
              <li className="border-b border-mist py-4 text-sm text-ink/60">
                Derzeit sind keine Projekte in Anfrage oder Planung.
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
