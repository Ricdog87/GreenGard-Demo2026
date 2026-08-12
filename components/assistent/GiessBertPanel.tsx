'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown, Mail, Phone, Search, Undo2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  suche,
  sucheFakten,
  FINDER_FLAECHEN,
  empfehleRoboter,
  mailtoFuer,
  richtpreisFuer,
  KONTAKT,
  type FinderFlaeche,
  type Treffer,
  type Fakt,
  type Richtpreis,
} from './wissen';
import { formatEURRound } from '@/lib/utils';

/**
 * Der Inhalt des Assistenten. Wird per dynamic() erst beim ersten Öffnen
 * geladen — die 139 Antworten (~57 KB) gehören nicht ins Startpaket jeder Seite.
 */

const SCHNELL = [
  { label: 'Was kostet Bewässerung für 800 m²?', frage: 'was kostet bewässerung für 800 qm' },
  { label: 'Öffnungszeiten', frage: 'öffnungszeiten' },
  { label: 'Lieferzeit', frage: 'lieferzeit' },
  { label: 'Auf Rechnung kaufen?', frage: 'rechnung' },
  { label: 'Bewässerung winterfest', frage: 'winterfest' },
] as const;

function RichtpreisKarte({ r }: { r: Richtpreis }) {
  return (
    <div className="border-l-2 border-copper bg-linen/70 px-4 py-3">
      <p className="font-display text-base tracking-tight">
        Richtwert für <span className="num">{r.qm.toLocaleString('de-DE')} m²</span>
      </p>
      <p className="mt-2 flex items-baseline gap-2">
        <span className="price text-2xl">≈ {formatEURRound(r.materialNetto)}</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/50">
          Material netto · Hauswasseranschluss
        </span>
      </p>
      <p className="mt-2 text-sm leading-relaxed text-ink/70">
        Mit Zisterne + {formatEURRound(r.zisterneNetto)} Technik, mit Brunnen +{' '}
        {formatEURRound(r.brunnenNetto)}. Ohne Montage und Erdarbeiten — den verbindlichen
        Preis liefert die Planung{r.ueberListe ? '; Flächen dieser Größe legen wir ohnehin individuell aus' : ''}.
      </p>
      <Link
        href="/planung"
        data-cursor="hover"
        className="mt-2 inline-flex items-center gap-1.5 border-b border-mist text-sm hover:border-ink"
      >
        Planung starten — 1–3 Werktage <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

function FaktKarte({ f }: { f: Fakt }) {
  return (
    <div className="border-l-2 border-moss bg-linen/70 px-4 py-3">
      <p className="font-display text-base tracking-tight">{f.titel}</p>
      {f.text.map((t, i) => (
        <p key={i} className="mt-1 text-sm leading-relaxed text-ink/75">
          {t}
        </p>
      ))}
      {f.href && (
        <Link
          href={f.href.url}
          data-cursor="hover"
          className="mt-2 inline-flex items-center gap-1.5 border-b border-mist text-sm hover:border-ink"
        >
          {f.href.label} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}

function TrefferListe({ treffer }: { treffer: Treffer[] }) {
  const [offen, setOffen] = useState<string | null>(null);
  const faqs = treffer.filter((t) => t.art === 'faq').slice(0, 4);
  const links = treffer.filter((t) => t.art !== 'faq').slice(0, 3);

  return (
    <div className="space-y-4">
      {faqs.length > 0 && (
        <div className="divide-y divide-mist border-y border-mist">
          {faqs.map((t) => t.art === 'faq' && (
            <div key={t.frage}>
              <button
                type="button"
                data-cursor="hover"
                onClick={() => setOffen(offen === t.frage ? null : t.frage)}
                aria-expanded={offen === t.frage}
                className="flex w-full items-start justify-between gap-3 py-3 text-left"
              >
                <span className="text-sm font-medium leading-snug">{t.frage}</span>
                <ChevronDown
                  className={cn('mt-0.5 h-4 w-4 shrink-0 text-ink/40 transition-transform', offen === t.frage && 'rotate-180')}
                />
              </button>
              {offen === t.frage && (
                <div className="space-y-2 pb-4 text-sm leading-relaxed text-ink/75">
                  {t.antwort.map((a, i) => (
                    <p key={i}>{a}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {links.length > 0 && (
        <div className="space-y-1.5">
          {links.map((t, i) => {
            const klasse =
              'flex items-baseline justify-between gap-3 border border-mist px-3.5 py-2.5 text-sm transition-colors hover:border-ink/40';
            const inhalt = (
              <>
                <span className="font-medium">
                  {t.art === 'produkt' ? t.name : (t as { label: string }).label}
                </span>
                <span className="font-mono shrink-0 text-[10px] uppercase tracking-[0.14em] text-ink/50">
                  {t.art === 'produkt' ? `${(t as { brand: string }).brand} · Shop ↗` : (t as { note: string }).note}
                </span>
              </>
            );
            // Produkte führen in den Shop (Meeting 12.08.2026) — externe Links.
            return t.art === 'produkt' ? (
              <a key={`p-${t.name}`} href={t.href} target="_blank" rel="noopener noreferrer" data-cursor="hover" className={klasse}>
                {inhalt}
              </a>
            ) : (
              <Link key={`s-${(t as { href: string }).href}-${i}`} href={(t as { href: string }).href} data-cursor="hover" className={klasse}>
                {inhalt}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RoboterFinder({ zurueck }: { zurueck: () => void }) {
  const [flaeche, setFlaeche] = useState<FinderFlaeche | null>(null);
  const [kabel, setKabel] = useState<boolean | null>(null);

  const empfehlung = flaeche !== null && kabel !== null ? empfehleRoboter(flaeche, kabel) : null;

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={zurueck}
        data-cursor="hover"
        className="inline-flex items-center gap-1.5 text-xs text-ink/60 hover:text-ink"
      >
        <Undo2 className="h-3.5 w-3.5" /> zurück
      </button>

      <div>
        <p className="eyebrow mb-3">1 · Wie groß ist die Rasenfläche?</p>
        <div className="flex flex-wrap gap-2">
          {FINDER_FLAECHEN.map((f) => (
            <button
              key={f.id}
              type="button"
              data-cursor="hover"
              onClick={() => setFlaeche(f.id)}
              aria-pressed={flaeche === f.id}
              className={cn(
                'border px-3.5 py-2 text-sm transition-colors',
                flaeche === f.id ? 'border-forest bg-forest text-linen' : 'border-mist hover:border-ink/40'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {flaeche !== null && (
        <div>
          <p className="eyebrow mb-3">2 · Begrenzungskabel verlegen?</p>
          <div className="flex flex-wrap gap-2">
            {[
              { v: true, label: 'Lieber ohne Kabel (Satellit)' },
              { v: false, label: 'Kabel ist in Ordnung' },
            ].map((o) => (
              <button
                key={String(o.v)}
                type="button"
                data-cursor="hover"
                onClick={() => setKabel(o.v)}
                aria-pressed={kabel === o.v}
                className={cn(
                  'border px-3.5 py-2 text-sm transition-colors',
                  kabel === o.v ? 'border-forest bg-forest text-linen' : 'border-mist hover:border-ink/40'
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {empfehlung && (
        <div>
          <p className="eyebrow mb-3">Unsere Empfehlung</p>
          <div className="space-y-2">
            {empfehlung.map((e, i) => (
              <a
                key={e.slug}
                href={e.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className={cn(
                  'block border px-4 py-3 transition-colors hover:border-ink/40',
                  i === 0 ? 'border-forest bg-linen/70' : 'border-mist'
                )}
              >
                <p className="flex items-baseline justify-between gap-3">
                  <span className="font-display text-base tracking-tight">{e.name}</span>
                  {i === 0 && (
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-moss">
                      Erste Wahl
                    </span>
                  )}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-ink/70">{e.grund}</p>
              </a>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-ink/55">
            Satellitenmodelle brauchen freie Sicht nach oben — bei dichten Baumkronen beraten wir
            kurz telefonisch.
          </p>
        </div>
      )}
    </div>
  );
}

export default function GiessBertPanel() {
  const [frage, setFrage] = useState('');
  const [finder, setFinder] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const fakten = useMemo(() => (frage.trim() ? sucheFakten(frage) : []), [frage]);
  const treffer = useMemo(() => (frage.trim() ? suche(frage) : []), [frage]);
  const richtpreis = useMemo(() => (frage.trim() ? richtpreisFuer(frage) : null), [frage]);
  const roboterAbsicht = /rasenrobot|m(ä|a)hrobot|automower|rasenm(ä|a)her/i.test(frage);
  const nichtsGefunden =
    frage.trim().length >= 3 && fakten.length === 0 && treffer.length === 0 && !richtpreis;

  return (
    <div className="flex h-full flex-col">
      {/* Eingabe */}
      <div className="border-b border-mist px-5 py-4">
        <label htmlFor="gb-frage" className="sr-only">
          Frage stellen
        </label>
        <div className="flex items-center gap-3 border-b border-mist focus-within:border-forest">
          <Search className="h-4 w-4 shrink-0 text-ink/40" aria-hidden />
          <input
            ref={inputRef}
            id="gb-frage"
            type="search"
            autoFocus
            value={frage}
            onChange={(e) => {
              setFrage(e.target.value);
              setFinder(false);
            }}
            placeholder="Fragen Sie, wie Sie uns anrufen würden …"
            className="h-11 w-full min-w-0 bg-transparent text-sm placeholder:text-ink/40 focus:outline-none"
          />
        </div>
      </div>

      {/* Inhalt */}
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        {finder ? (
          <RoboterFinder zurueck={() => setFinder(false)} />
        ) : frage.trim() === '' ? (
          <div className="space-y-6">
            <div>
              <p className="eyebrow mb-3">Häufig gefragt</p>
              <div className="flex flex-wrap gap-2">
                {SCHNELL.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    data-cursor="hover"
                    onClick={() => {
                      setFrage(s.frage);
                      inputRef.current?.focus();
                    }}
                    className="border border-mist px-3.5 py-2 text-sm transition-colors hover:border-ink/40"
                  >
                    {s.label}
                  </button>
                ))}
                <button
                  type="button"
                  data-cursor="hover"
                  onClick={() => setFinder(true)}
                  className="border border-moss/50 px-3.5 py-2 text-sm text-moss transition-colors hover:border-moss"
                >
                  Mähroboter finden →
                </button>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-ink/60">
              Gießbert kennt die <span className="num">139</span> Antworten aus unserem Learning
              Center, das Sortiment und unsere Serviceregeln — und antwortet sofort, rund um die
              Uhr.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {richtpreis && <RichtpreisKarte r={richtpreis} />}
            {fakten.map((f) => (
              <FaktKarte key={f.id} f={f} />
            ))}
            {roboterAbsicht && (
              <button
                type="button"
                data-cursor="hover"
                onClick={() => setFinder(true)}
                className="flex w-full items-center justify-between border border-moss/50 px-4 py-3 text-sm text-moss transition-colors hover:border-moss"
              >
                <span>Zwei Fragen — dann nennen wir das passende Modell.</span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </button>
            )}
            {treffer.length > 0 && <TrefferListe treffer={treffer} />}
            {nichtsGefunden && (
              <div className="space-y-4">
                <p className="text-sm leading-relaxed text-ink/70">
                  Dazu steht hier noch nichts — schreiben Sie uns über „Frage senden“, wir
                  antworten persönlich und nehmen die Frage mit auf.
                </p>
                <div className="space-y-1.5">
                  {[
                    { label: 'Alle 139 Antworten durchsuchen', note: 'Learning Center', href: '/learning-center#fragen' },
                    { label: 'Beratungstermin buchen', note: '30 Min., kostenfrei', href: '/beratung' },
                  ].map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      data-cursor="hover"
                      className="flex items-baseline justify-between gap-3 border border-mist px-3.5 py-2.5 text-sm transition-colors hover:border-ink/40"
                    >
                      <span className="font-medium">{l.label}</span>
                      <span className="font-mono shrink-0 text-[10px] uppercase tracking-[0.14em] text-ink/50">
                        {l.note}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Ausstieg zu Menschen — immer sichtbar, nie versteckt. */}
      <div className="border-t border-mist bg-linen/60 px-5 py-3.5">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
          <a
            href={mailtoFuer(frage)}
            data-cursor="hover"
            className="inline-flex items-center gap-1.5 text-sm hover:text-bronze"
          >
            <Mail className="h-3.5 w-3.5" /> Frage senden
          </a>
          <a
            href={KONTAKT.telefonHref}
            data-cursor="hover"
            className="num inline-flex items-center gap-1.5 text-sm hover:text-bronze"
          >
            <Phone className="h-3.5 w-3.5" /> {KONTAKT.telefon}
          </a>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/45">
            {KONTAKT.zeiten}
          </span>
        </div>
      </div>
    </div>
  );
}
