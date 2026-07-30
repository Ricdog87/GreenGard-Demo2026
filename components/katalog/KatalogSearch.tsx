'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Search } from 'lucide-react';
import { products, categories } from '@/lib/data';
import { useCart } from '@/store/cart';
import { priceFor } from '@/lib/pricing';
import { formatEUR, cn } from '@/lib/utils';

/**
 * Katalog-Suche als Kommandozeile (⌘K / Strg+K).
 *
 * Sucht über Artikelname, Marke, Disziplin und technische Daten — normalisiert,
 * damit "kress", "mahroboter" und "rtk" alle beim richtigen Gerät landen.
 * Vollständig per Tastatur bedienbar: Pfeile wählen, Enter öffnet, Esc schließt.
 */

const CAT_NAME = new Map(categories.map((c) => [c.slug, c.name]));

/** Umlaute und Sonderzeichen einebnen, damit "mahroboter" auch trifft. */
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

const INDEX = products.map((p) => ({
  slug: p.slug,
  name: p.name,
  brand: p.brand,
  category: p.category,
  categoryName: CAT_NAME.get(p.category) ?? p.category,
  netPrice: p.netPrice,
  haystack: normalize(
    [p.name, p.brand, CAT_NAME.get(p.category) ?? '', p.shortDesc, Object.values(p.specs).join(' ')].join(' ')
  ),
}));

export function KatalogSearch() {
  const router = useRouter();
  const mode = useCart((s) => s.mode);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  const results = useMemo(() => {
    const q = normalize(query);
    if (!q) return INDEX.slice(0, 8);
    const terms = q.split(' ').filter(Boolean);
    return INDEX.filter((item) => terms.every((t) => item.haystack.includes(t))).slice(0, 8);
  }, [query]);

  // ⌘K / Strg+K öffnet, Esc schließt — global.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      // Fokus erst nach dem Öffnen setzen, sonst scrollt Safari die Seite.
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  // Aktive Zeile im Blickfeld halten.
  useEffect(() => {
    const el = listRef.current?.children[active] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  function onInputKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    }
    if (e.key === 'Enter' && results[active]) {
      e.preventDefault();
      go(results[active].slug);
    }
  }

  function go(slug: string) {
    setOpen(false);
    router.push(`/produkte/${slug}`);
  }

  return (
    <>
      <button
        type="button"
        data-cursor="hover"
        onClick={() => setOpen(true)}
        className="group inline-flex items-center gap-3 border border-linen/25 px-4 py-2.5 text-left transition-colors hover:border-linen/60"
        aria-label="Katalog durchsuchen"
      >
        <Search className="h-3.5 w-3.5 text-linen/60" />
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-linen/60 group-hover:text-linen">
          Katalog durchsuchen
        </span>
        <kbd className="font-mono ml-2 hidden border border-linen/25 px-1.5 py-0.5 text-[9px] text-linen/50 sm:inline">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[90] flex items-start justify-center bg-ink/70 px-4 pt-[12vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Katalog-Suche"
        >
          <div
            className="w-full max-w-2xl border border-mist bg-paper shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-mist px-5">
              <Search className="h-4 w-4 shrink-0 text-ink/40" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="Artikel, Marke oder Disziplin …"
                aria-label="Suchbegriff"
                className="h-14 w-full bg-transparent text-base placeholder:text-ink/35 focus:outline-none"
              />
              <kbd className="font-mono hidden border border-mist px-1.5 py-0.5 text-[9px] uppercase text-ink/40 sm:inline">
                Esc
              </kbd>
            </div>

            {results.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-ink/55">
                Kein Artikel gefunden. Rufen Sie uns an — wir beschaffen auch, was nicht im
                Katalog steht.
              </p>
            ) : (
              <ul ref={listRef} className="max-h-[52vh] overflow-y-auto">
                {results.map((r, i) => (
                  <li key={r.slug}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onClick={() => go(r.slug)}
                      className={cn(
                        'flex w-full items-center gap-4 px-5 py-3 text-left transition-colors',
                        i === active ? 'bg-linen' : 'hover:bg-linen/60'
                      )}
                    >
                      <span className="font-mono w-16 shrink-0 text-[10px] uppercase tracking-[0.16em] text-moss">
                        {r.brand}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm">{r.name}</span>
                        <span className="font-mono block text-[10px] uppercase tracking-[0.16em] text-ink/45">
                          {r.categoryName}
                        </span>
                      </span>
                      <span className="price shrink-0 text-sm">
                        {formatEUR(priceFor(r.netPrice, mode))}
                      </span>
                      <ArrowRight
                        className={cn(
                          'h-3.5 w-3.5 shrink-0 transition-opacity',
                          i === active ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="font-mono flex items-center justify-between border-t border-mist px-5 py-2.5 text-[9px] uppercase tracking-[0.16em] text-ink/40">
              <span>↑ ↓ wählen · ⏎ öffnen</span>
              <span className="num">{products.length} Artikel im Katalog</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
