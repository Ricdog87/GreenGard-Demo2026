'use client';

import { useMemo, useState } from 'react';
import { Play, Search, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CONTACT } from '@/lib/contact';
import { cn } from '@/lib/utils';
import videosJson from '@/data/videos.json';

export type VideoCategory =
  | 'bewaesserung'
  | 'steuerung'
  | 'pumpentechnik'
  | 'beleuchtung'
  | 'maehroboter'
  | 'pool'
  | 'zubehoer';

export type VideoLevel = 'Grundlagen' | 'Praxis' | 'Profi';

export interface LearningVideo {
  slug: string;
  title: string;
  description: string;
  category: VideoCategory;
  youtubeId: string;
  duration: string;
  level: VideoLevel;
}

// Aus JSON leitet TypeScript nur `string` ab — der Cast hält die Unions oben gültig.
const VIDEOS = videosJson.videos as LearningVideo[];

// Nur Rubriken und Stufen anbieten, zu denen es Videos gibt — leere Chips
// sähen aus wie kaputte Filter. Wachsen die Videos, wachsen die Chips mit.
const ALLE_CATEGORIES: { id: VideoCategory; label: string }[] = [
  { id: 'bewaesserung', label: 'Bewässerung' },
  { id: 'steuerung', label: 'Steuerung' },
  { id: 'pumpentechnik', label: 'Pumpentechnik' },
  { id: 'beleuchtung', label: 'Beleuchtung' },
  { id: 'maehroboter', label: 'Mähroboter' },
  { id: 'pool', label: 'Pool' },
  { id: 'zubehoer', label: 'Zubehör' },
];
const VORHANDEN = new Set(VIDEOS.map((v) => v.category));
const CATEGORIES = ALLE_CATEGORIES.filter((c) => VORHANDEN.has(c.id));

const VORHANDENE_LEVEL = new Set(VIDEOS.map((v) => v.level));
const LEVELS = (['Grundlagen', 'Praxis', 'Profi'] as VideoLevel[]).filter((l) =>
  VORHANDENE_LEVEL.has(l)
);

const CAT_LABEL = new Map(CATEGORIES.map((c) => [c.id, c.label]));

/** Umlaute einebnen, damit "bewasserung" und "maehroboter" ebenfalls treffen. */
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

const INDEX = VIDEOS.map((v) => ({
  ...v,
  haystack: normalize([v.title, v.description, CAT_LABEL.get(v.category) ?? '', v.level].join(' ')),
}));

// Bis Green-Gard die echten YouTube-IDs liefert (siehe _todo in videos.json),
// steht in allen Datensätzen dieselbe Dummy-ID. Die darf nicht eingebettet
// werden — sonst läuft hinter jedem Fachthema ein fremdes Video. Solange die ID
// unverändert ist, zeigt die Lightbox eine Platzhalterfläche statt des Embeds;
// mit den echten IDs greift der Zweig von selbst nicht mehr.
const PLATZHALTER_ID = 'dQw4w9WgXcQ';

/** "8:24" → "8 Minuten 24 Sekunden" — sonst liest der Screenreader den Doppelpunkt mit. */
function gesprocheneLaufzeit(d: string): string {
  const [min, sek] = d.split(':');
  const s = Number(sek);
  return s > 0 ? `${Number(min)} Minuten ${s} Sekunden` : `${Number(min)} Minuten`;
}

const LEVEL_STYLE: Record<VideoLevel, string> = {
  Grundlagen: 'border-mist text-ink/60',
  Praxis: 'border-moss/50 text-moss',
  Profi: 'border-bronze/60 text-bronze',
};

/** Nur Chip-Filter, keine URL-Parameter: Monteure teilen den Link, nicht den Filter. */
function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      data-cursor="hover"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        // min-h-[44px] auf Mobile: Tap-Fläche für Handschuhe auf der Baustelle.
        'min-h-[44px] border px-4 py-2 text-sm transition-colors',
        active
          ? 'border-forest bg-forest text-linen'
          : 'border-mist text-ink/70 hover:border-ink/40 hover:text-ink'
      )}
    >
      {children}
    </button>
  );
}

export function LearningGrid() {
  const [cat, setCat] = useState<VideoCategory | null>(null);
  const [level, setLevel] = useState<VideoLevel | null>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<LearningVideo | null>(null);

  const filtered = useMemo(() => {
    const terms = normalize(query).split(' ').filter(Boolean);
    return INDEX.filter((v) => {
      if (cat && v.category !== cat) return false;
      if (level && v.level !== level) return false;
      return terms.every((t) => v.haystack.includes(t));
    });
  }, [cat, level, query]);

  const filtersActive = Boolean(cat) || Boolean(level) || query.trim().length > 0;

  function resetFilters() {
    setCat(null);
    setLevel(null);
    setQuery('');
  }

  return (
    <section className="border-t border-mist py-16 md:py-24">
      <div className="container">
        <h2 className="sr-only">Videothek</h2>

        {/* Filterleiste */}
        <div data-reveal className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
          <div className="min-w-0 space-y-6 lg:col-span-8">
            <div>
              <p className="eyebrow mb-3" id="lc-filter-disziplin">
                Disziplin
              </p>
              <div role="group" aria-labelledby="lc-filter-disziplin" className="flex flex-wrap gap-2">
                <FilterChip active={!cat} onClick={() => setCat(null)}>
                  Alle
                </FilterChip>
                {CATEGORIES.map((c) => (
                  <FilterChip
                    key={c.id}
                    active={cat === c.id}
                    onClick={() => setCat(cat === c.id ? null : c.id)}
                  >
                    {c.label}
                  </FilterChip>
                ))}
              </div>
            </div>

            <div>
              <p className="eyebrow mb-3" id="lc-filter-stufe">
                Stufe
              </p>
              <div role="group" aria-labelledby="lc-filter-stufe" className="flex flex-wrap gap-2">
                <FilterChip active={!level} onClick={() => setLevel(null)}>
                  Alle
                </FilterChip>
                {LEVELS.map((l) => (
                  <FilterChip
                    key={l}
                    active={level === l}
                    onClick={() => setLevel(level === l ? null : l)}
                  >
                    {l}
                  </FilterChip>
                ))}
              </div>
            </div>
          </div>

          {/* min-w-0: das Suchfeld darf das Grid nicht aufziehen. */}
          <div className="min-w-0 lg:col-span-4">
            <label className="eyebrow mb-3 block" htmlFor="lc-search">
              Suche
            </label>
            <div className="flex min-w-0 items-center gap-3 border-b border-mist focus-within:border-forest">
              <Search className="h-4 w-4 shrink-0 text-ink/40" aria-hidden />
              <input
                id="lc-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ventil, Hydrawise, Trafo …"
                className="h-11 w-full min-w-0 bg-transparent text-sm placeholder:text-ink/35 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  data-cursor="hover"
                  onClick={() => setQuery('')}
                  aria-label="Suche zurücksetzen"
                  className="shrink-0 p-2 text-ink/40 transition-colors hover:text-ink"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <p
                className="font-mono num text-[11px] uppercase tracking-[0.18em] text-ink/55"
                aria-live="polite"
              >
                {filtered.length} von {VIDEOS.length} Videos
              </p>
              {filtersActive && (
                <button
                  type="button"
                  data-cursor="hover"
                  onClick={resetFilters}
                  className="font-mono border-b border-mist text-[11px] uppercase tracking-[0.18em] text-ink/55 transition-colors hover:border-ink hover:text-ink"
                >
                  Filter zurücksetzen
                </button>
              )}
              <a
                href={videosJson.kanal}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className="font-mono border-b border-mist text-[11px] uppercase tracking-[0.18em] text-ink/55 transition-colors hover:border-ink hover:text-ink"
              >
                Alle Videos auf YouTube ↗
              </a>
            </div>
          </div>
        </div>

        {/* Video-Raster */}
        {filtered.length === 0 ? (
          <div className="mt-16 border border-mist bg-linen/60 p-10 text-center">
            <p className="font-display text-2xl tracking-tight">Dazu haben wir noch kein Video.</p>
            <p className="mx-auto mt-3 max-w-md text-sm text-ink/70">
              Das heißt nicht, dass wir die Antwort nicht haben. Rufen Sie an — und sagen Sie
              uns, welches Thema Ihnen fehlt. Wir drehen nach Bedarf.
            </p>
            <a
              href={CONTACT.phoneHref}
              data-cursor="hover"
              className="font-display mt-6 inline-block border-b border-bronze/60 text-xl tracking-tight transition-colors hover:text-bronze"
            >
              {CONTACT.phoneDisplay}
            </a>
          </div>
        ) : (
          <ul
            data-reveal-group
            className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((v) => (
              <li key={v.slug} className="min-w-0">
                <button
                  type="button"
                  data-cursor="hover"
                  onClick={() => setActive(v)}
                  aria-label={`Video öffnen: ${v.title}. Laufzeit ${gesprocheneLaufzeit(v.duration)}, Stufe ${v.level}.`}
                  className="group flex h-full w-full flex-col border border-mist bg-paper text-left transition-colors hover:border-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/40"
                >
                  {/* Echtes YouTube-Thumbnail (i.ytimg.com braucht kein next/image
                      — schlichtes img mit lazy loading genügt für eine Kachel). */}
                  <span className="relative flex aspect-video w-full items-center justify-center overflow-hidden bg-forest">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform [transition-duration:1200ms] group-hover:scale-[1.04]"
                    />
                    <span
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-ink/25"
                    />
                    <span
                      aria-hidden
                      className="relative grid h-16 w-16 place-items-center rounded-full border border-linen/30 bg-linen/10 text-linen transition-transform duration-300 group-hover:scale-110"
                    >
                      <Play className="h-6 w-6 translate-x-[2px] fill-current" />
                    </span>
                    <span className="font-mono absolute left-4 top-4 text-[10px] uppercase tracking-[0.18em] text-linen/60">
                      {CAT_LABEL.get(v.category)}
                    </span>
                    <span className="font-mono num absolute bottom-3 right-3 bg-ink/70 px-2 py-1 text-[10px] tracking-[0.14em] text-linen">
                      {v.duration}
                    </span>
                  </span>

                  <span className="flex flex-1 flex-col p-6">
                    <span
                      className={cn(
                        'font-mono self-start border px-2 py-1 text-[10px] uppercase tracking-[0.16em]',
                        LEVEL_STYLE[v.level]
                      )}
                    >
                      {v.level}
                    </span>
                    <span className="font-display mt-4 block text-xl leading-snug tracking-tight transition-colors group-hover:text-bronze">
                      {v.title}
                    </span>
                    <span className="mt-3 block text-sm leading-relaxed text-ink/70">
                      {v.description}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Lightbox */}
      <Dialog open={Boolean(active)} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-h-[92vh] w-[calc(100%-1.5rem)] max-w-3xl gap-0 overflow-y-auto p-5 sm:p-8">
          {active && (
            <>
              <p className="eyebrow pr-10">
                {CAT_LABEL.get(active.category)} · {active.level}
              </p>
              <DialogTitle className="mt-2 pr-10 text-xl leading-snug md:text-2xl">
                {active.title}
              </DialogTitle>

              <div className="relative mt-5 aspect-video w-full overflow-hidden bg-forest">
                {active.youtubeId === PLATZHALTER_ID ? (
                  <div className="absolute inset-0 grid place-items-center px-6 text-center">
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-copper">
                        Aufnahme folgt
                      </p>
                      <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-linen/70">
                        Dieses Erklärvideo wird derzeit an einer laufenden Anlage
                        aufgenommen. Bis es online ist, beantworten wir die Frage gern
                        direkt am Telefon.
                      </p>
                    </div>
                  </div>
                ) : (
                  <iframe
                    // key erzwingt ein frisches iframe je Video — sonst läuft das
                    // vorherige beim Wechsel im Hintergrund weiter.
                    key={active.slug}
                    src={`https://www.youtube-nocookie.com/embed/${active.youtubeId}?rel=0&modestbranding=1`}
                    title={`Erklärvideo: ${active.title}`}
                    loading="lazy"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full border-0"
                  />
                )}
              </div>

              <DialogDescription className="mt-5">{active.description}</DialogDescription>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-mist pt-5">
                <p className="font-mono num text-[10px] uppercase tracking-[0.16em] text-ink/50">
                  Laufzeit {active.duration}
                </p>
                <a
                  href={CONTACT.phoneHref}
                  data-cursor="hover"
                  className="font-mono border-b border-mist text-[10px] uppercase tracking-[0.16em] text-ink/60 transition-colors hover:border-ink hover:text-ink"
                >
                  Frage offen? {CONTACT.phoneDisplay}
                </a>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
