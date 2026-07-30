'use client';

import { useEffect, useState } from 'react';
import { categories } from '@/lib/data';
import { cn } from '@/lib/utils';

/**
 * Mitlaufendes Inhaltsverzeichnis des Katalogs.
 *
 * Links das Kapitelregister (Desktop, sticky), das beim Scrollen mitwandert;
 * auf schmalen Displays stattdessen eine dünne Fortschrittslinie mit dem
 * aktuellen Kapitelnamen. Beobachtet wird über IntersectionObserver — kein
 * Scroll-Listener, der bei jedem Pixel rechnet.
 */
export function KatalogIndex({ counts }: { counts: Record<string, number> }) {
  const [activeSlug, setActiveSlug] = useState(categories[0]?.slug ?? '');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const sections = categories
      .map((c) => document.getElementById(`kapitel-${c.slug}`))
      .filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0) return;

    // Das Kapitel gilt als aktiv, sobald es das obere Drittel erreicht.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveSlug(visible.target.id.replace('kapitel-', ''));
      },
      { rootMargin: '-18% 0px -66% 0px', threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));

    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? Math.min(1, doc.scrollTop / max) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const activeIndex = Math.max(0, categories.findIndex((c) => c.slug === activeSlug));
  const active = categories[activeIndex];

  return (
    <>
      {/* Desktop: Kapitelregister */}
      <nav aria-label="Katalog-Kapitel" className="hidden xl:block">
        <p className="font-mono mb-5 text-[10px] uppercase tracking-[0.18em] text-ink/40">
          Inhalt
        </p>
        <ul className="space-y-1">
          {categories.map((c) => {
            const isActive = c.slug === activeSlug;
            return (
              <li key={c.slug}>
                <a
                  href={`#kapitel-${c.slug}`}
                  data-cursor="hover"
                  className={cn(
                    'group flex items-baseline gap-3 py-1.5 transition-colors',
                    isActive ? 'text-ink' : 'text-ink/45 hover:text-ink/80'
                  )}
                >
                  <span className="font-mono w-6 shrink-0 text-[10px] tracking-[0.16em]">
                    {c.roman}
                  </span>
                  <span className="flex-1 text-sm">{c.name}</span>
                  <span className="num font-mono text-[10px] text-ink/35">
                    {counts[c.slug] ?? 0}
                  </span>
                  <span
                    className={cn(
                      'h-px transition-all duration-500',
                      isActive ? 'w-6 bg-bronze' : 'w-0 bg-transparent'
                    )}
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobil und Tablet: Fortschrittsleiste mit aktuellem Kapitel */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-mist bg-paper/95 backdrop-blur xl:hidden">
        <div className="h-px bg-mist">
          <div
            className="h-full bg-bronze transition-[width] duration-150"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <div className="container flex items-center justify-between gap-4 py-2.5">
          <p className="font-mono truncate text-[10px] uppercase tracking-[0.18em] text-ink/60">
            <span className="text-bronze">{active?.roman}</span> · {active?.name}
          </p>
          <p className="num font-mono shrink-0 text-[10px] uppercase tracking-[0.18em] text-ink/40">
            {activeIndex + 1} / {categories.length}
          </p>
        </div>
      </div>
    </>
  );
}
