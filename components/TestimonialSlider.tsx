'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { testimonials } from '@/lib/data';
import { Eyebrow } from '@/components/Eyebrow';
import { cn } from '@/lib/utils';

type Filter = 'alle' | '5' | '4';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'alle', label: 'Alle' },
  { id: '5', label: '5 ★' },
  { id: '4', label: '4 ★' },
];

// Mock-Durchschnitt für die Demo — echte Zahlen kommen später aus der Quelle.
// TODO: Google Reviews API oder ProvenExpert-Embed evaluieren.
const REVIEW_COUNT = 27;
const REVIEW_AVERAGE = '4,9';

function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1', className)} aria-label={`${rating} von 5 Sternen`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn('h-3.5 w-3.5', i <= rating ? 'fill-copper text-copper' : 'text-copper/30')}
        />
      ))}
    </span>
  );
}

export function TestimonialSlider() {
  const [filter, setFilter] = useState<Filter>('alle');
  const [i, setI] = useState(0);

  const list = useMemo(() => {
    if (filter === 'alle') return testimonials;
    return testimonials.filter((t) => String(t.rating) === filter);
  }, [filter]);

  const len = list.length;
  const safeIndex = len > 0 ? Math.min(i, len - 1) : 0;
  const t = list[safeIndex];

  function applyFilter(f: Filter) {
    setFilter(f);
    setI(0);
  }

  return (
    <section className="bg-bark py-28 text-linen md:py-36">
      <div className="container">
        <div data-reveal className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow number="07" className="text-linen/70 [&>span:first-child]:bg-linen/30">
              Stimmen
            </Eyebrow>
            <h2 className="h-display mt-6 max-w-3xl text-4xl md:text-6xl">
              Was unsere Kunden <em className="italic">sagen</em>.
            </h2>
            <p className="num font-mono mt-5 text-[11px] uppercase tracking-[0.18em] text-linen/60">
              {REVIEW_AVERAGE} von 5 · {REVIEW_COUNT} Bewertungen
            </p>
          </div>

          {/* Sterne-Filter */}
          <div
            className="flex items-center gap-1 self-start border border-linen/25 md:self-end"
            role="tablist"
            aria-label="Bewertungen filtern"
          >
            {FILTERS.map((f) => {
              const count =
                f.id === 'alle'
                  ? testimonials.length
                  : testimonials.filter((x) => String(x.rating) === f.id).length;
              return (
                <button
                  key={f.id}
                  role="tab"
                  aria-selected={filter === f.id}
                  data-cursor="hover"
                  onClick={() => applyFilter(f.id)}
                  className={cn(
                    'num font-mono px-4 py-2.5 text-[10px] uppercase tracking-[0.18em] transition-colors',
                    filter === f.id ? 'bg-linen text-ink' : 'text-linen/60 hover:text-linen'
                  )}
                >
                  {f.label} <span className="opacity-60">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {t ? (
          <div data-reveal className="mt-16 grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                  className="relative aspect-[4/5] overflow-hidden bg-forest"
                >
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 25vw"
                    className="object-cover grayscale"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="lg:col-span-9">
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={t.name}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35 }}
                  className="font-display text-balance text-2xl italic leading-[1.15] md:text-4xl lg:text-5xl"
                >
                  „{t.quote}“
                </motion.blockquote>
              </AnimatePresence>

              <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <Stars rating={t.rating} className="mb-3" />
                  <p className="font-display text-xl tracking-tight">{t.name}</p>
                  <p className="font-mono mt-1 text-[11px] uppercase tracking-[0.18em] text-linen/60">
                    {t.role}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <span className="num font-mono text-[11px] uppercase tracking-[0.18em] text-linen/60">
                    {String(safeIndex + 1).padStart(2, '0')} / {String(len).padStart(2, '0')}
                  </span>
                  <div className="flex gap-2">
                    <button
                      data-cursor="hover"
                      onClick={() => setI((safeIndex - 1 + len) % len)}
                      className="grid h-10 w-10 place-items-center border border-linen/30 hover:bg-linen/10"
                      aria-label="Vorherige Bewertung"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <button
                      data-cursor="hover"
                      onClick={() => setI((safeIndex + 1) % len)}
                      className="grid h-10 w-10 place-items-center border border-linen/30 hover:bg-linen/10"
                      aria-label="Nächste Bewertung"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-16 text-linen/60">Für diese Auswahl liegen keine Bewertungen vor.</p>
        )}
      </div>
    </section>
  );
}
