'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, RotateCcw } from 'lucide-react';
import { Eyebrow } from '@/components/Eyebrow';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DEMO_KONTO, STATUS_LABEL, type Bestellung } from '@/lib/konto-daten';
import { CONTACT } from '@/lib/contact';
import { cn } from '@/lib/utils';

/**
 * ISO-Datum rein als Zeichenkette umdrehen (2026-07-22 → 22.07.2026).
 * Bewusst ohne toLocaleDateString, damit Server- und Client-Ausgabe
 * zeichengenau übereinstimmen.
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

type Filter = 'alle' | 'offen' | 'geliefert';

const FILTER: { id: Filter; label: string }[] = [
  { id: 'alle', label: 'Alle' },
  { id: 'offen', label: 'Offen' },
  { id: 'geliefert', label: 'Geliefert' },
];

function passt(b: Bestellung, filter: Filter): boolean {
  if (filter === 'offen') return b.status !== 'geliefert';
  if (filter === 'geliefert') return b.status === 'geliefert';
  return true;
}

export function KontoBestellungen() {
  const [filter, setFilter] = useState<Filter>('alle');
  const [offen, setOffen] = useState<string[]>([]);

  // Jüngste zuerst — ISO-Datumsangaben sortieren sich als Zeichenkette korrekt.
  const alle = useMemo(
    () => [...DEMO_KONTO.bestellungen].sort((a, b) => b.datum.localeCompare(a.datum)),
    []
  );
  const sichtbar = alle.filter((b) => passt(b, filter));

  const toggle = (nummer: string) =>
    setOffen((prev) =>
      prev.includes(nummer) ? prev.filter((n) => n !== nummer) : [...prev, nummer]
    );

  // Meeting 12.08.2026: Produktbestellungen laufen über den Shop, nicht über
  // den Warenkorb der Website. "Erneut bestellen" erzeugt deshalb eine
  // vorbefüllte Nachbestell-Mail mit der Positionsliste — ohne Preise.
  // TODO: durch Shop-Deeplink ersetzen, sobald die Msoft-API steht.
  const erneutBestellen = (b: Bestellung) => {
    const zeilen = b.positionen.map((p) => `${p.bestellnummer} × ${p.menge} — ${p.bezeichnung}`);
    const body = encodeURIComponent(
      `Bitte erneut liefern (wie Bestellung ${b.nummer}):\n\n${zeilen.join('\n')}\n\nKundennummer: ${DEMO_KONTO.kundennummer}`
    );
    const subject = encodeURIComponent(`Nachbestellung zu ${b.nummer}`);
    window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
  };
  return (
    <section className="py-4">
      <div data-reveal>
        <Eyebrow>Bestellhistorie</Eyebrow>
        <h2 className="h-display mt-6 max-w-2xl text-balance text-4xl md:text-5xl">
          Alles, was Sie bei uns <em className="italic">bestellt</em> haben.
        </h2>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink/70">
          Klappen Sie eine Bestellung auf, um die einzelnen Positionen zu sehen — oder
          legen Sie den kompletten Bedarf mit einem Klick erneut in den Warenkorb.
        </p>
      </div>

      {/* Filterleiste */}
      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-mist py-4">
        <div className="flex min-w-0 flex-wrap gap-2" role="group" aria-label="Bestellungen filtern">
          {FILTER.map((f) => {
            const aktiv = f.id === filter;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                aria-pressed={aktiv}
                data-cursor="hover"
                className={cn(
                  'font-mono rounded-full border px-4 py-1.5 text-[10px] uppercase tracking-[0.18em] transition-colors',
                  aktiv
                    ? 'border-forest bg-forest text-linen'
                    : 'border-ink/15 text-ink/70 hover:border-ink/40'
                )}
              >
                {f.label}
                <span className="num ml-2 opacity-60">
                  {alle.filter((b) => passt(b, f.id)).length}
                </span>
              </button>
            );
          })}
        </div>
        <p className="font-mono num ml-auto text-[10px] uppercase tracking-[0.16em] text-ink/45">
          {sichtbar.length} von {alle.length} Bestellungen
        </p>
      </div>

      {/* Liste */}
      <ul data-reveal-group className="mt-2">
        {sichtbar.map((b) => {
          const aufgeklappt = offen.includes(b.nummer);
          const panelId = `positionen-${b.nummer}`;
          return (
            <li key={b.nummer} className="border-b border-mist">
              {/* Auf 375 px steht der Aufklapper allein in der Zeile, sonst quetscht
                  ihn der Button auf gut 140 px und jede Angabe bricht einzeln um. */}
              <div className="flex flex-col items-stretch gap-3 py-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-3">
                <button
                  type="button"
                  onClick={() => toggle(b.nummer)}
                  aria-expanded={aufgeklappt}
                  // aria-controls darf nur zeigen, was auch im DOM steht — das
                  // Panel wird erst beim Aufklappen gerendert.
                  aria-controls={aufgeklappt ? panelId : undefined}
                  data-cursor="hover"
                  className="group flex w-full min-w-0 flex-wrap items-baseline gap-x-4 gap-y-2 text-left sm:w-auto sm:flex-1"
                >
                  <ChevronDown
                    aria-hidden="true"
                    className={cn(
                      'h-4 w-4 shrink-0 self-center text-ink/35 transition-transform',
                      aufgeklappt && 'rotate-180'
                    )}
                  />
                  <span className="font-mono num text-[12px] tracking-[0.08em] text-ink transition-colors group-hover:text-bronze">
                    {b.nummer}
                  </span>
                  <span className="font-mono num text-[11px] uppercase tracking-[0.14em] text-ink/45">
                    {deDatum(b.datum)}
                  </span>
                  {b.projekt && (
                    <span className="font-display min-w-0 text-base leading-snug tracking-tight">
                      {b.projekt}
                    </span>
                  )}
                  <Badge variant={STATUS_VARIANT[b.status]}>{STATUS_LABEL[b.status]}</Badge>
                  {/* Kein Bestellwert mehr — Preise stehen im Shop (Meeting 12.08.2026). */}
                  <span className="num font-mono ml-auto whitespace-nowrap text-[11px] uppercase tracking-[0.14em] text-ink/45">
                    {b.positionen.length} {b.positionen.length === 1 ? 'Position' : 'Positionen'}
                  </span>
                </button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => erneutBestellen(b)}
                  // Ohne Zusatz lesen Screenreader in der Liste nur mehrfach
                  // "Erneut bestellen" — die Bestellnummer macht es eindeutig.
                  aria-label={`Nachbestellung zu ${b.nummer} anfragen`}
                  className="self-start sm:shrink-0 sm:self-auto"
                >
                  <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
                  Erneut bestellen
                </Button>
              </div>

              {aufgeklappt && (
                <div id={panelId} className="pb-7">
                  <div className="overflow-x-auto border-t border-mist bg-linen/50">
                    <table className="w-full min-w-[34rem] border-collapse text-left">
                      <caption className="sr-only">
                        Positionen der Bestellung {b.nummer} vom {deDatum(b.datum)}
                      </caption>
                      <thead>
                        <tr className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/45">
                          <th scope="col" className="px-4 py-3 font-normal">
                            Bestellnummer
                          </th>
                          <th scope="col" className="px-4 py-3 font-normal">
                            Bezeichnung
                          </th>
                          <th scope="col" className="px-4 py-3 text-right font-normal">
                            Menge
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {b.positionen.map((p) => (
                          <tr key={p.bestellnummer} className="border-t border-mist/70">
                            <td className="font-mono num whitespace-nowrap px-4 py-3 text-[12px] text-ink/70">
                              {p.bestellnummer}
                            </td>
                            <td className="px-4 py-3 text-sm text-ink">{p.bezeichnung}</td>
                            <td className="num px-4 py-3 text-right text-sm">{p.menge}</td>
                          </tr>
                        ))}
                      </tbody>
                      {/* Nettowert-Fuß entfernt — Preise pflegt allein der Shop. */}
                    </table>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {sichtbar.length === 0 && (
        <p className="py-10 text-sm text-ink/60">
          Für diesen Filter liegen keine Bestellungen vor.
        </p>
      )}

      <p className="font-mono mt-6 text-[10px] uppercase tracking-[0.16em] text-ink/40">
        Alle Preise netto zzgl. MwSt. · Zahlungsziel {DEMO_KONTO.zahlungsziel}
      </p>
    </section>
  );
}
