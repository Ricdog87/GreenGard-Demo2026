'use client';

import { useMemo, useState } from 'react';
import { FileUp, MapPin, Paperclip } from 'lucide-react';
import { Eyebrow } from '@/components/Eyebrow';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DEMO_KONTO,
  PROJEKT_LABEL,
  type Planung,
  type Projekt,
  type ProjektStatus,
} from '@/lib/konto-daten';
import { cn } from '@/lib/utils';

/**
 * Bauvorhaben und Planungen.
 *
 * Projekte und die dazugehörigen Planungsdateien stehen bewusst zusammen: Auf der
 * Baustelle zählt, welcher Plan zu welchem Vorhaben gehört — nicht die Ablagelogik.
 */

/** ISO-Datum ohne Locale-Abhängigkeit umwandeln (sonst Hydration-Mismatch). */
function datumDE(iso: string): string {
  const [jahr, monat, tag] = iso.split('-');
  if (!jahr || !monat || !tag) return iso;
  return `${tag}.${monat}.${jahr}`;
}

/** Tausenderpunkte ohne Intl — identische Ausgabe auf Server und Client. */
function zahlDE(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

const PLANUNG_STATUS: Record<Planung['status'], string> = {
  in_arbeit: 'In Arbeit',
  fertig: 'Fertig',
};

const FILTER: { wert: ProjektStatus | 'alle'; label: string }[] = [
  { wert: 'alle', label: 'Alle' },
  ...(Object.keys(PROJEKT_LABEL) as ProjektStatus[]).map((s) => ({
    wert: s,
    label: PROJEKT_LABEL[s],
  })),
];

const BADGE_VARIANT: Record<ProjektStatus, 'default' | 'bronze' | 'outline' | 'mist'> = {
  anfrage: 'outline',
  planung: 'mist',
  freigegeben: 'bronze',
  umgesetzt: 'default',
};

/** Planungen eines Projekts — verknüpft über projektId oder das Feld planung. */
function planungenZu(projekt: Projekt): Planung[] {
  return DEMO_KONTO.planungen.filter(
    (p) => p.projektId === projekt.id || p.id === projekt.planung
  );
}

export function KontoProjekte() {
  const [filter, setFilter] = useState<ProjektStatus | 'alle'>('alle');
  const [dateien, setDateien] = useState<string[]>([]);
  const [zuordnung, setZuordnung] = useState<string>(DEMO_KONTO.projekte[0]?.id ?? '');
  const [hinweis, setHinweis] = useState<string | null>(null);

  const projekte = useMemo(
    () =>
      filter === 'alle'
        ? DEMO_KONTO.projekte
        : DEMO_KONTO.projekte.filter((p) => p.status === filter),
    [filter]
  );

  function dateienGewaehlt(liste: FileList | null) {
    // Demo-Modus: Es wird nichts übertragen, nur der Dateiname angezeigt.
    // TODO: Upload nach Supabase Storage (Bucket "planungen"), Pfad
    // `${kundennummer}/${projektId}/${dateiname}`, danach Zeile in Tabelle
    // "planungen" anlegen (quelle: 'Upload', status: 'in_arbeit').
    setDateien(liste ? Array.from(liste).map((f) => f.name) : []);
    setHinweis(null);
  }

  function hinterlegen() {
    if (dateien.length === 0) {
      setHinweis('Bitte zuerst eine Datei auswählen.');
      return;
    }
    const projekt = DEMO_KONTO.projekte.find((p) => p.id === zuordnung);
    const anzahl = `${dateien.length} ${dateien.length === 1 ? 'Datei' : 'Dateien'}`;
    setHinweis(
      `Demo-Modus: ${anzahl} für „${projekt?.name ?? 'ohne Zuordnung'}“ vorgemerkt — es wurde nichts hochgeladen.`
    );
  }

  return (
    <section className="border-t border-mist bg-paper py-16 md:py-24" data-reveal-group>
      <div className="container">
        <Eyebrow number="B">Bauvorhaben</Eyebrow>
        <h2 className="h-display mt-5 max-w-2xl text-balance text-3xl md:text-5xl" data-reveal>
          Projekte und Planungen, <em className="italic">an einem Ort</em>.
        </h2>

        {/* Statusfilter */}
        <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Projekte nach Status filtern">
          {FILTER.map((f) => {
            const aktiv = filter === f.wert;
            const anzahl =
              f.wert === 'alle'
                ? DEMO_KONTO.projekte.length
                : DEMO_KONTO.projekte.filter((p) => p.status === f.wert).length;
            return (
              <button
                key={f.wert}
                type="button"
                data-cursor="hover"
                aria-pressed={aktiv}
                onClick={() => setFilter(f.wert)}
                className={cn(
                  'font-mono border px-3 py-2 text-[10px] uppercase tracking-[0.16em] transition-colors',
                  aktiv
                    ? 'border-forest bg-forest text-linen'
                    : 'border-mist text-ink/60 hover:border-ink/40 hover:text-ink'
                )}
              >
                {f.label} <span className="num opacity-60">{anzahl}</span>
              </button>
            );
          })}
        </div>

        {/* Projektkarten */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {projekte.map((projekt) => {
            const planungen = planungenZu(projekt);
            return (
              <article
                key={projekt.id}
                data-reveal
                className="flex min-w-0 flex-col border border-mist bg-linen p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="font-display text-2xl leading-tight">{projekt.name}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-ink/60">
                      <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span className="truncate">{projekt.ort}</span>
                    </p>
                  </div>
                  <Badge variant={BADGE_VARIANT[projekt.status]} className="shrink-0">
                    {PROJEKT_LABEL[projekt.status]}
                  </Badge>
                </div>

                <dl className="font-mono mt-5 grid grid-cols-2 gap-4 border-y border-mist py-4 text-[10px] uppercase tracking-[0.16em] text-ink/50">
                  <div className="min-w-0">
                    <dt>Fläche</dt>
                    <dd className="num mt-1 text-sm normal-case tracking-normal text-ink">
                      {zahlDE(projekt.flaecheQm)} m²
                    </dd>
                  </div>
                  <div className="min-w-0">
                    <dt>Angelegt</dt>
                    <dd className="num mt-1 text-sm normal-case tracking-normal text-ink">
                      {datumDE(projekt.angelegt)}
                    </dd>
                  </div>
                </dl>

                <p className="mt-4 text-sm text-ink/70">{projekt.notiz}</p>

                <div className="mt-5 border-t border-mist pt-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/50">
                    Planungen
                  </p>
                  {planungen.length === 0 ? (
                    <p className="mt-2 text-sm text-ink/45">
                      Noch keine Planung hinterlegt. Laden Sie unten Ihre Zeichnung hoch — wir
                      legen die Hydraulik aus.
                    </p>
                  ) : (
                    <ul className="mt-3 space-y-3">
                      {planungen.map((pl) => (
                        <li key={pl.id} className="flex min-w-0 items-start gap-3">
                          <Paperclip
                            className="mt-1 h-3.5 w-3.5 shrink-0 text-moss"
                            aria-hidden="true"
                          />
                          <div className="min-w-0">
                            <span className="block text-sm text-ink/85">{pl.name}</span>
                            <span className="mt-1 flex flex-wrap items-center gap-2">
                              <Badge variant="mist">{pl.quelle}</Badge>
                              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-moss">
                                {PLANUNG_STATUS[pl.status]}
                              </span>
                              <span className="font-mono num text-[10px] uppercase tracking-[0.14em] text-ink/45">
                                {datumDE(pl.erstellt)}
                              </span>
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {projekte.length === 0 && (
          <p className="mt-8 border border-mist bg-linen px-6 py-12 text-center text-sm text-ink/55">
            Kein Projekt in diesem Status.
          </p>
        )}

        {/* Planung hinterlegen */}
        <div className="mt-12 border border-mist bg-linen p-6 md:p-8" data-reveal>
          <h3 className="font-display text-2xl">Planung hinterlegen</h3>
          <p className="mt-2 max-w-2xl text-sm text-ink/70">
            Zeichnung, IRRISketch-Datei oder Lageplan — wir prüfen die Hydraulik und melden uns
            mit der Auslegung. In dieser Demo werden Dateien nur angezeigt, nicht übertragen.
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="min-w-0">
              <label
                htmlFor="planung-datei"
                className="font-mono block text-[10px] uppercase tracking-[0.16em] text-ink/50"
              >
                Dateien auswählen (mehrere möglich)
              </label>
              <input
                id="planung-datei"
                type="file"
                multiple
                aria-describedby="planung-dateiliste"
                onChange={(e) => dateienGewaehlt(e.target.files)}
                className="mt-2 block w-full min-w-0 border border-mist bg-paper p-2 text-xs file:mr-3 file:border-0 file:bg-forest file:px-3 file:py-1.5 file:text-[10px] file:uppercase file:tracking-[0.16em] file:text-linen"
              />
            </div>

            <div className="min-w-0">
              <label
                htmlFor="planung-projekt"
                className="font-mono block text-[10px] uppercase tracking-[0.16em] text-ink/50"
              >
                Projektzuordnung
              </label>
              <select
                id="planung-projekt"
                value={zuordnung}
                onChange={(e) => setZuordnung(e.target.value)}
                className="mt-2 block h-11 w-full min-w-0 border border-mist bg-paper px-3 text-sm focus-visible:border-forest focus-visible:outline-none"
              >
                {DEMO_KONTO.projekte.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.ort}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dauerhaft im DOM, damit Screenreader die Auswahl auch wirklich melden. */}
          <ul
            id="planung-dateiliste"
            aria-live="polite"
            className="font-mono mt-5 space-y-1 text-[11px] text-ink/60 empty:mt-0"
          >
            {dateien.map((name) => (
              <li key={name} className="flex min-w-0 items-center gap-2">
                <Paperclip className="h-3 w-3 shrink-0 text-moss" aria-hidden="true" />
                <span className="truncate">{name}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Button type="button" variant="primary" size="md" onClick={hinterlegen}>
              <FileUp className="h-4 w-4" aria-hidden="true" />
              Planung hinterlegen
            </Button>
            <p
              role="status"
              aria-live="polite"
              className="font-mono min-w-0 text-[10px] uppercase tracking-[0.16em] text-moss"
            >
              {hinweis}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
