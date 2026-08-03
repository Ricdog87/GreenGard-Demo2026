'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Eyebrow } from '@/components/Eyebrow';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DEMO_KONTO } from '@/lib/konto-daten';
import {
  katalogArtikel,
  ekPreis,
  RABATTGRUPPEN,
  ABSCHNITTE_VERFUEGBAR,
  ABSCHNITTE_GESAMT,
  type KatalogArtikel,
} from '@/lib/katalog-daten';
import { formatEUR, cn } from '@/lib/utils';

/**
 * Persönliche Einkaufspreise.
 *
 * Zeigt den Katalog mit dem Preis, der für dieses Konto gilt: Rabattgruppe des
 * Artikels plus persönliche Konditionsstufe. Die Ersparnis steht daneben, damit
 * der Vorteil ohne Kopfrechnen sichtbar ist.
 */

/** Umlaute einebnen, damit "Bewasserung" und "Bewässerung" gleich treffen. */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

interface IndexEintrag {
  artikel: KatalogArtikel;
  haystack: string;
}

const INDEX: IndexEintrag[] = katalogArtikel.map((a) => ({
  artikel: a,
  haystack: normalize([a.bestellnummer, a.hersteller, a.modell ?? '', a.beschreibung].join(' ')),
}));

/**
 * Prozent mit deutschem Dezimalkomma, ohne Intl — so ist die Ausgabe auf Server
 * und Client garantiert identisch. Nachkommastelle nur, wenn sie etwas aussagt.
 */
function prozent(anteil: number): string {
  const wert = Math.round(anteil * 1000) / 10;
  const text = Number.isInteger(wert) ? String(wert) : wert.toFixed(1).replace('.', ',');
  return `${text} %`;
}

export function KontoPreise() {
  const [query, setQuery] = useState('');
  const stufe = DEMO_KONTO.konditionsstufe;

  const treffer = useMemo(() => {
    const q = normalize(query);
    if (!q) return INDEX;
    const terms = q.split(' ').filter(Boolean);
    return INDEX.filter((e) => terms.every((t) => e.haystack.includes(t)));
  }, [query]);

  const gruppen = Object.entries(RABATTGRUPPEN);

  return (
    <section className="border-t border-mist bg-paper py-16 md:py-24" data-reveal-group>
      <div className="container">
        <Eyebrow number="P">Ihre Preise</Eyebrow>
        <h2 className="h-display mt-5 max-w-2xl text-balance text-3xl md:text-5xl" data-reveal>
          Einkaufspreise, <em className="italic">wie sie für Sie gelten</em>.
        </h2>

        {/* Kondition erklären: Rabattgruppe des Artikels + persönlicher Zusatz. */}
        <div className="mt-8 border border-mist bg-linen p-5 md:p-7" data-reveal>
          <p className="max-w-2xl text-sm text-ink/70">
            Jeder Artikel gehört einer Rabattgruppe an. Auf diesen Katalograbatt kommt Ihr
            persönlicher Zusatzrabatt aus der Konditionsvereinbarung. Alle Preise verstehen sich
            netto zzgl. MwSt., Zahlungsziel {DEMO_KONTO.zahlungsziel}.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {gruppen.map(([gruppe, satz]) => (
              <Badge key={gruppe} variant="mist">
                Gruppe {gruppe} · {prozent(satz)}
              </Badge>
            ))}
            <Badge variant="bronze">Ihr Zusatzrabatt · {prozent(stufe)}</Badge>
          </div>
          <p className="font-mono mt-4 text-[10px] uppercase tracking-[0.16em] text-ink/45">
            Kundennummer {DEMO_KONTO.kundennummer} · {DEMO_KONTO.firma}
          </p>
        </div>

        {/* Suche */}
        <div className="mt-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0 md:max-w-sm md:flex-1">
            <label
              htmlFor="preise-suche"
              className="font-mono block text-[10px] uppercase tracking-[0.18em] text-ink/50"
            >
              Suche
            </label>
            <div className="mt-1 flex items-center gap-2 border-b border-mist">
              <Search className="h-3.5 w-3.5 shrink-0 text-ink/40" aria-hidden="true" />
              <Input
                id="preise-suche"
                type="search"
                value={query}
                autoComplete="off"
                spellCheck={false}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Bestellnummer, Hersteller oder Beschreibung …"
                className="min-w-0 border-b-0"
              />
            </div>
          </div>
          {/* Trefferzahl als Live-Region: Die Suche filtert ohne Absenden. */}
          <p
            role="status"
            aria-live="polite"
            className="font-mono num shrink-0 text-[10px] uppercase tracking-[0.16em] text-ink/45"
          >
            {treffer.length} von {katalogArtikel.length} Artikeln
          </p>
        </div>

        {/* Breite Tabelle: eigener Scroll-Container, damit die Seite auf 375px steht.
            tabIndex macht den Bereich per Tastatur scrollbar (WCAG 2.1.1). */}
        <div
          className="mt-4 overflow-x-auto border border-mist bg-paper"
          tabIndex={0}
          role="region"
          aria-label="Preisliste, horizontal scrollbar"
        >
          <table className="w-full min-w-[880px] border-collapse text-left text-sm">
            <caption className="sr-only">
              Katalogartikel mit Listenpreis, Rabattgruppe und Ihrem Einkaufspreis
            </caption>
            <thead>
              <tr className="border-b border-mist bg-linen">
                {[
                  'Bestellnummer',
                  'Hersteller',
                  'Beschreibung',
                  'VE',
                  'Listenpreis',
                  'Gruppe',
                  'Ihr EK',
                ].map((kopf) => (
                  <th
                    key={kopf}
                    scope="col"
                    className={cn(
                      'font-mono px-4 py-3 text-[10px] font-normal uppercase tracking-[0.16em] text-ink/55',
                      (kopf === 'Listenpreis' || kopf === 'Ihr EK') && 'text-right'
                    )}
                  >
                    {kopf}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {treffer.map(({ artikel }) => {
                const ek = ekPreis(artikel, stufe);
                const ersparnis = artikel.preisVE > 0 ? (1 - ek / artikel.preisVE) * 100 : 0;
                return (
                  <tr key={artikel.bestellnummer} className="border-b border-mist/70 last:border-0">
                    <th
                      scope="row"
                      className="font-mono num whitespace-nowrap px-4 py-4 text-left text-xs font-normal text-ink/80"
                    >
                      {artikel.bestellnummer}
                    </th>
                    <td className="whitespace-nowrap px-4 py-4">
                      <span className="block">{artikel.hersteller}</span>
                      {artikel.modell && (
                        <span className="font-mono block text-[10px] uppercase tracking-[0.14em] text-ink/45">
                          {artikel.modell}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className="block max-w-[24rem] text-ink/80">{artikel.beschreibung}</span>
                      <span className="font-mono block text-[10px] uppercase tracking-[0.14em] text-moss">
                        {artikel.abschnitt}
                      </span>
                    </td>
                    <td className="font-mono whitespace-nowrap px-4 py-4 text-[11px] uppercase tracking-[0.14em] text-ink/55">
                      {artikel.verpackungseinheit}
                    </td>
                    <td className="num whitespace-nowrap px-4 py-4 text-right text-ink/50 line-through">
                      {formatEUR(artikel.preisVE)}
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant="outline">{artikel.rabattgruppe}</Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-right">
                      <span className="price block text-base">{formatEUR(ek)}</span>
                      <span className="font-mono num block text-[10px] uppercase tracking-[0.14em] text-bronze">
                        <span className="sr-only">Ersparnis </span>
                        {`−${ersparnis.toFixed(1).replace('.', ',')} %`}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {treffer.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-ink/55">
                    Kein Artikel gefunden. Rufen Sie uns an — wir beschaffen auch, was noch nicht
                    im Katalog steht.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Stand der Einpflege — kein Fehler, sondern Fortschritt. */}
        <p className="font-mono mt-4 text-[10px] uppercase tracking-[0.16em] text-ink/45">
          Stand der Einpflege: <span className="num">{ABSCHNITTE_VERFUEGBAR}</span> von{' '}
          <span className="num">{ABSCHNITTE_GESAMT}</span> Katalogabschnitten · die Liste wächst
          laufend mit
        </p>
      </div>
    </section>
  );
}
