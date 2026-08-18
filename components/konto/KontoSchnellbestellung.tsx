'use client';

import { useMemo, useState } from 'react';
import { AlertCircle, ClipboardPaste, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Eyebrow } from '@/components/Eyebrow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DEMO_KONTO } from '@/lib/konto-daten';
import { CONTACT } from '@/lib/contact';
import { findeArtikel, katalogArtikel, type KatalogArtikel } from '@/lib/katalog-daten';
import { cn } from '@/lib/utils';

/**
 * Schnellbestellung über Bestellnummern.
 *
 * Das Werkzeug für Profis, die ihre Nummern aus der Kalkulation kennen: eintippen
 * oder ganze Listen einfügen, statt sich durch den Katalog zu klicken. Die
 * Auflösung passiert während der Eingabe, damit ein Zahlendreher sofort auffällt.
 */

interface Zeile {
  id: number;
  nummer: string;
  menge: string;
}

const START_ZEILEN = 5;

function leereZeilen(anzahl: number, ab = 0): Zeile[] {
  return Array.from({ length: anzahl }, (_, i) => ({ id: ab + i, nummer: '', menge: '' }));
}

/** Höchste vergebene ID — per reduce statt Spread, damit lange Listen nicht den Stack sprengen. */
function naechsteId(zeilen: Zeile[]): number {
  return zeilen.reduce((max, z) => (z.id > max ? z.id : max), 0) + 1;
}

/** Deutsche Ein-/Mehrzahl, damit nirgends „1 Positionen“ steht. */
function anzahlText(n: number, einzahl: string, mehrzahl: string): string {
  return `${n} ${n === 1 ? einzahl : mehrzahl}`;
}

/** "100000030;4", "100000030 4" oder nur die Nummer — alles zulässig. */
function parseListe(text: string): { nummer: string; menge: string }[] {
  return text
    .split(/\r?\n/)
    .map((z) => z.trim())
    .filter(Boolean)
    .map((z) => {
      const teile = z.split(/[;,\t ]+/).filter(Boolean);
      return { nummer: teile[0] ?? '', menge: teile[1] ?? '1' };
    });
}

interface AufgeloesteZeile {
  zeile: Zeile;
  artikel?: KatalogArtikel;
  menge: number;
  leer: boolean;
  fehler: boolean;
}

export function KontoSchnellbestellung() {
  const [zeilen, setZeilen] = useState<Zeile[]>(() => leereZeilen(START_ZEILEN));
  const [listeText, setListeText] = useState('');
  const [hinweis, setHinweis] = useState<string | null>(null);


  const aufgeloest: AufgeloesteZeile[] = useMemo(
    () =>
      zeilen.map((z) => {
        const leer = z.nummer.trim() === '';
        const artikel = leer ? undefined : findeArtikel(z.nummer);
        const gemeldet = Number.parseInt(z.menge, 10);
        const menge = Number.isFinite(gemeldet) && gemeldet > 0 ? gemeldet : 1;
        // Meeting 12.08.2026: keine Preise im Dashboard — die Liste geht als
        // Bestellanfrage raus, die Preise stehen im Shop bzw. in der AB.
        return { zeile: z, artikel, menge, leer, fehler: !leer && !artikel };
      }),
    [zeilen]
  );

  const gueltige = aufgeloest.filter((a) => a.artikel);

  function setzeFeld(id: number, feld: 'nummer' | 'menge', wert: string) {
    setHinweis(null);
    // Mengen auf Ziffern begrenzen: Sonst zeigt das Feld etwas anderes an,
    // als die Position rechnet.
    const bereinigt = feld === 'menge' ? wert.replace(/\D/g, '') : wert;
    setZeilen((alt) => alt.map((z) => (z.id === id ? { ...z, [feld]: bereinigt } : z)));
  }

  function zeileHinzufuegen() {
    setZeilen((alt) => [...alt, ...leereZeilen(1, naechsteId(alt))]);
  }

  function zeileLeeren(id: number) {
    setZeilen((alt) => alt.map((z) => (z.id === id ? { ...z, nummer: '', menge: '' } : z)));
  }

  function listeUebernehmen() {
    const eintraege = parseListe(listeText);
    if (eintraege.length === 0) {
      setHinweis('Die Liste ist leer. Format: Bestellnummer;Menge — eine Position je Zeile.');
      return;
    }
    const neu: Zeile[] = eintraege.map((e, i) => ({ id: i, nummer: e.nummer, menge: e.menge }));
    // Immer mindestens fünf Zeilen stehen lassen, damit weiter getippt werden kann.
    if (neu.length < START_ZEILEN) neu.push(...leereZeilen(START_ZEILEN - neu.length, neu.length));
    setZeilen(neu);
    setListeText('');
    setHinweis(`${anzahlText(eintraege.length, 'Zeile', 'Zeilen')} übernommen.`);
  }

  function nummerEinsetzen(bestellnummer: string) {
    setHinweis(null);
    setZeilen((alt) => {
      const idx = alt.findIndex((z) => z.nummer.trim() === '');
      if (idx === -1) {
        return [...alt, { id: naechsteId(alt), nummer: bestellnummer, menge: '1' }];
      }
      return alt.map((z, i) => (i === idx ? { ...z, nummer: bestellnummer, menge: z.menge || '1' } : z));
    });
  }

  function bestellungSenden() {
    if (gueltige.length === 0) {
      setHinweis('Noch keine gültige Position. Bitte Bestellnummer prüfen.');
      return;
    }
    const zeilenText = gueltige.map(
      (a) => `${a.artikel!.bestellnummer} × ${a.menge} — ${a.artikel!.beschreibung}`
    );
    const body = encodeURIComponent(
      `Bestellung:\n\n${zeilenText.join('\n')}\n\nKundennummer: ${DEMO_KONTO.kundennummer}\nLieferung: wie vereinbart`
    );
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
      `Bestellung Kundennummer ${DEMO_KONTO.kundennummer}`
    )}&body=${body}`;
    setHinweis(`${anzahlText(gueltige.length, 'Position', 'Positionen')} als Bestellung vorbereitet — Ihr Mailprogramm öffnet sich.`);
  }

  return (
    <section className="border-t border-mist bg-linen py-16 md:py-24" data-reveal-group>
      <div className="container">
        <Eyebrow number="S">Schnellbestellung</Eyebrow>
        <h2 className="h-display mt-5 max-w-2xl text-balance text-3xl md:text-5xl" data-reveal>
          Nummer eintippen, <em className="italic">fertig</em>.
        </h2>
        <p className="mt-5 max-w-2xl text-sm text-ink/70" data-reveal>
          Sie kennen Ihre Bestellnummern — dann brauchen Sie den Katalog nicht. Tippen Sie die
          Positionen ein oder fügen Sie Ihre Liste aus der Kalkulation ein. Die Preise stehen
          in Ihrer Auftragsbestätigung.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          {/* Positionszeilen */}
          <div className="min-w-0">
            <div className="border border-mist bg-paper">
              <div className="font-mono hidden border-b border-mist bg-linen px-5 py-3 text-[10px] uppercase tracking-[0.16em] text-ink/55 md:grid md:grid-cols-[9rem_5rem_minmax(0,1fr)_7rem_2rem] md:gap-4">
                <span>Bestellnummer</span>
                <span>Menge</span>
                <span>Artikel</span>
                <span className="text-right">Position</span>
                <span className="sr-only">Aktion</span>
              </div>

              <ul>
                {aufgeloest.map((a, i) => (
                  <li
                    key={a.zeile.id}
                    className="grid gap-3 border-b border-mist/70 px-5 py-4 last:border-0 md:grid-cols-[9rem_5rem_minmax(0,1fr)_7rem_2rem] md:items-center md:gap-4"
                  >
                    <div className="min-w-0">
                      <label
                        htmlFor={`sb-nr-${a.zeile.id}`}
                        className="font-mono block text-[10px] uppercase tracking-[0.16em] text-ink/50 md:sr-only"
                      >
                        Bestellnummer Zeile {i + 1}
                      </label>
                      <Input
                        id={`sb-nr-${a.zeile.id}`}
                        value={a.zeile.nummer}
                        inputMode="numeric"
                        autoComplete="off"
                        placeholder="z. B. 100000030"
                        aria-invalid={a.fehler || undefined}
                        aria-describedby={a.fehler ? `sb-fehler-${a.zeile.id}` : undefined}
                        onChange={(e) => setzeFeld(a.zeile.id, 'nummer', e.target.value)}
                        className={cn('font-mono num min-w-0 text-xs', a.fehler && 'border-bronze')}
                      />
                    </div>

                    <div className="min-w-0">
                      <label
                        htmlFor={`sb-menge-${a.zeile.id}`}
                        className="font-mono block text-[10px] uppercase tracking-[0.16em] text-ink/50 md:sr-only"
                      >
                        Menge Zeile {i + 1}
                      </label>
                      <Input
                        id={`sb-menge-${a.zeile.id}`}
                        value={a.zeile.menge}
                        inputMode="numeric"
                        autoComplete="off"
                        placeholder="1"
                        onChange={(e) => setzeFeld(a.zeile.id, 'menge', e.target.value)}
                        className="num min-w-0 text-sm"
                      />
                    </div>

                    <div className="min-w-0">
                      {a.artikel ? (
                        <>
                          <span className="block truncate text-sm text-ink/85">
                            {a.artikel.beschreibung}
                          </span>
                          {/* Wirksame Menge mitschreiben: Ein leeres Mengenfeld rechnet mit 1. */}
                          <span className="font-mono num block text-[10px] uppercase tracking-[0.14em] text-moss">
                            {a.artikel.hersteller}
                            {a.artikel.modell ? ` · ${a.artikel.modell}` : ''} ·{' '}
                            {a.artikel.verpackungseinheit} · Menge {a.menge}
                          </span>
                        </>
                      ) : a.fehler ? (
                        <span
                          id={`sb-fehler-${a.zeile.id}`}
                          className="flex items-center gap-2 text-xs text-bronze"
                        >
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                          Diese Bestellnummer ist noch nicht eingepflegt. Bitte prüfen Sie die
                          Eingabe oder rufen Sie uns kurz an.
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/35">
                          Bitte Nummer eingeben
                        </span>
                      )}
                    </div>

                    <div className="num text-sm md:text-right">
                      {/* Auf 375px fehlt der Spaltenkopf — deshalb hier ein eigenes Label. */}
                      <span className="font-mono mr-2 text-[10px] uppercase tracking-[0.16em] text-ink/50 md:hidden">
                        Position
                      </span>
                      {a.artikel ? (
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-moss">
                          erfasst
                        </span>
                      ) : (
                        <span className="text-ink/25">—</span>
                      )}
                    </div>

                    <div className="md:text-right">
                      <button
                        type="button"
                        data-cursor="hover"
                        onClick={() => zeileLeeren(a.zeile.id)}
                        aria-label={`Zeile ${i + 1} leeren`}
                        className="inline-flex h-8 w-8 items-center justify-center text-ink/35 transition-colors hover:text-ink"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-mist bg-linen px-5 py-4">
                <Button type="button" variant="outline" size="sm" onClick={zeileHinzufuegen}>
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  Zeile hinzufügen
                </Button>
                {/* Keine Summen — Preise stehen in AB und Shop (Meeting 12.08.2026). */}
                <div className="text-right">
                  <span className="font-mono block text-[10px] uppercase tracking-[0.16em] text-ink/50">
                    Bereit zum Senden
                  </span>
                  <span className="num font-display block text-2xl">{gueltige.length} Positionen</span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <Button type="button" variant="accent" size="lg" onClick={bestellungSenden}>
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                Als Bestellung senden
              </Button>
              {/* Live-Region dauerhaft im DOM, sonst liest der Screenreader den
                  Hinweis nicht vor, wenn er erst beim Klick eingehängt wird. */}
              <p
                role="status"
                aria-live="polite"
                className="font-mono min-w-0 text-[10px] uppercase tracking-[0.16em] text-moss"
              >
                {hinweis}
              </p>
            </div>
          </div>

          {/* Liste einfügen + Nummernhilfe */}
          <div className="min-w-0 space-y-8">
            <div className="border border-mist bg-paper p-5">
              <h3 className="font-display text-xl">Liste einfügen</h3>
              <p id="sb-liste-hinweis" className="mt-2 text-sm text-ink/70">
                Eine Position je Zeile, im Format <span className="font-mono">Nummer;Menge</span>{' '}
                oder <span className="font-mono">Nummer Menge</span>. So wandert Ihre Kalkulation
                ohne Abtippen in die Bestellung.
              </p>
              <label
                htmlFor="sb-liste"
                className="font-mono mt-4 block text-[10px] uppercase tracking-[0.16em] text-ink/50"
              >
                Positionsliste
              </label>
              <textarea
                id="sb-liste"
                value={listeText}
                onChange={(e) => setListeText(e.target.value)}
                rows={6}
                spellCheck={false}
                aria-describedby="sb-liste-hinweis"
                placeholder={'100000030;4\n102000118 2'}
                className="font-mono mt-1 block w-full min-w-0 resize-y border border-mist bg-transparent p-3 text-xs placeholder:text-ink/35 focus-visible:border-forest focus-visible:outline-none"
              />
              <Button
                type="button"
                variant="primary"
                size="sm"
                className="mt-4"
                onClick={listeUebernehmen}
              >
                <ClipboardPaste className="h-3.5 w-3.5" aria-hidden="true" />
                Übernehmen
              </Button>
            </div>

            <div className="border border-mist bg-paper p-5">
              <h3 className="font-display text-xl">Verfügbare Bestellnummern</h3>
              <p className="mt-2 text-sm text-ink/70">
                Der Katalog wird abschnittsweise eingepflegt. Diese Nummern liegen bereits vor —
                ein Klick setzt sie in die nächste freie Zeile.
              </p>
              {/* Höhe begrenzt: Die Liste wächst mit jedem eingepflegten Abschnitt. */}
              <ul className="mt-4 max-h-80 space-y-2 overflow-y-auto">
                {katalogArtikel.map((art) => (
                  <li key={art.bestellnummer}>
                    <button
                      type="button"
                      data-cursor="hover"
                      onClick={() => nummerEinsetzen(art.bestellnummer)}
                      className="flex w-full items-center gap-3 border border-mist px-3 py-2 text-left transition-colors hover:border-ink/40"
                    >
                      <span className="font-mono num shrink-0 text-xs text-ink/80">
                        {art.bestellnummer}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-xs text-ink/60">
                        {art.beschreibung}
                      </span>
                      <Badge variant="mist" className="shrink-0">
                        {art.verpackungseinheit}
                      </Badge>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
