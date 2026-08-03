'use client';

import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import faqJson from '@/data/faq.json';

// Die Fragen und Antworten stammen 1:1 von green-gard.de/learningcenter.
// Hier wird nur gefiltert und dargestellt — kein Text wird umformuliert.

interface FaqEintrag {
  position: number;
  frage: string;
  antwort: string[];
  kategorie: string;
}

const EINTRAEGE = faqJson.eintraege as FaqEintrag[];

/** Reihenfolge der Rubriken auf der Seite — die Rubrik selbst ist unsere Zutat. */
const RUBRIKEN: { id: string; label: string }[] = [
  { id: 'unternehmen', label: 'Bestellen & Abholen' },
  { id: 'planung', label: 'Planung & Beratung' },
  { id: 'bewaesserung', label: 'Bewässerung' },
  { id: 'steuerung', label: 'Steuerung' },
  { id: 'pumpen', label: 'Pumpentechnik' },
  { id: 'beleuchtung', label: 'Beleuchtung' },
  { id: 'maehroboter', label: 'Mähroboter' },
];

const RUBRIK_LABEL = new Map(RUBRIKEN.map((r) => [r.id, r.label]));

/** Umlaute einebnen, damit „bewasserung“ und „maehroboter“ ebenfalls treffen. */
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

const INDEX = EINTRAEGE.map((e) => ({
  ...e,
  haystack: normalize([e.frage, ...e.antwort, RUBRIK_LABEL.get(e.kategorie) ?? ''].join(' ')),
}));

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

export function FaqAccordion() {
  const [rubrik, setRubrik] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const treffer = useMemo(() => {
    const terms = normalize(query).split(' ').filter(Boolean);
    return INDEX.filter((e) => {
      if (rubrik && e.kategorie !== rubrik) return false;
      return terms.every((t) => e.haystack.includes(t));
    });
  }, [rubrik, query]);

  const gefiltert = Boolean(rubrik) || query.trim().length > 0;

  return (
    <section id="fragen" className="border-t border-mist bg-linen py-16 md:py-24">
      <div className="container">
        <p className="eyebrow">Fragen &amp; Antworten</p>
        <h2 className="h-display mt-6 max-w-[18ch] text-balance text-4xl md:text-5xl">
          Hier finden Sie Antworten auf <em className="italic">Ihre Fragen</em>.
        </h2>
        <p className="mt-6 max-w-2xl text-ink/70">
          <span className="num">{EINTRAEGE.length}</span> Antworten aus der täglichen Praxis —
          von der Lieferzeit über den Vordruck bis zur Überwinterung. Suchen Sie nach einem
          Stichwort oder gehen Sie über die Rubriken.
        </p>

        <div data-reveal className="mt-12 grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
          <div className="min-w-0 lg:col-span-8">
            <p className="eyebrow mb-3" id="faq-filter-rubrik">
              Rubrik
            </p>
            <div role="group" aria-labelledby="faq-filter-rubrik" className="flex flex-wrap gap-2">
              <FilterChip active={!rubrik} onClick={() => setRubrik(null)}>
                Alle
              </FilterChip>
              {RUBRIKEN.map((r) => (
                <FilterChip
                  key={r.id}
                  active={rubrik === r.id}
                  onClick={() => setRubrik(rubrik === r.id ? null : r.id)}
                >
                  {r.label}
                </FilterChip>
              ))}
            </div>
          </div>

          {/* min-w-0: das Suchfeld darf das Grid nicht aufziehen. */}
          <div className="min-w-0 lg:col-span-4">
            <label className="eyebrow mb-3 block" htmlFor="faq-search">
              Suche
            </label>
            <div className="flex min-w-0 items-center gap-3 border-b border-mist focus-within:border-forest">
              <Search className="h-4 w-4 shrink-0 text-ink/40" aria-hidden />
              <input
                id="faq-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Zisterne, Trafo, Systemtrenner …"
                className="h-11 w-full min-w-0 bg-transparent text-sm placeholder:text-ink/35 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Suche leeren"
                  data-cursor="hover"
                  className="shrink-0 text-ink/40 hover:text-ink"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <p aria-live="polite" className="font-mono mt-8 text-[11px] uppercase tracking-[0.18em] text-ink/50">
          <span className="num">{treffer.length}</span>{' '}
          {treffer.length === 1 ? 'Antwort' : 'Antworten'}
          {gefiltert && (
            <>
              {' · '}
              <button
                type="button"
                onClick={() => {
                  setRubrik(null);
                  setQuery('');
                }}
                data-cursor="hover"
                className="underline underline-offset-4 hover:text-ink"
              >
                Filter zurücksetzen
              </button>
            </>
          )}
        </p>

        {treffer.length === 0 ? (
          <p className="mt-10 max-w-xl text-lg text-ink/70">
            Dazu steht hier noch nichts. Rufen Sie an — dann beantworten wir es direkt und
            nehmen die Frage mit auf.
          </p>
        ) : (
          <Accordion type="single" collapsible className="mt-6 border-b border-mist">
            {treffer.map((e) => (
              <AccordionItem key={e.position} value={`faq-${e.position}`}>
                <AccordionTrigger className="text-lg md:text-xl">{e.frage}</AccordionTrigger>
                <AccordionContent className="max-w-3xl space-y-3 leading-[1.7]">
                  {e.antwort.map((absatz, i) => (
                    <p key={i}>{absatz}</p>
                  ))}
                  <p className="font-mono pt-2 text-[10px] uppercase tracking-[0.16em] text-ink/40">
                    {RUBRIK_LABEL.get(e.kategorie) ?? e.kategorie}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </section>
  );
}
