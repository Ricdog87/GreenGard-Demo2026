'use client';

import { useEffect, useRef, useState } from 'react';
import { Eyebrow } from '@/components/Eyebrow';
import { CONTACT } from '@/lib/contact';

function CountUp({ to, suffix }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setStarted(true);
      },
      { threshold: 0.4 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const dur = 1400;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setValue(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [started, to]);

  return (
    <span ref={ref} className="num">
      {value}
      {suffix}
    </span>
  );
}

// Gründungsjahr 2006 — die Jahre werden daraus berechnet, damit die Zahl nicht
// wieder veraltet.
const YEARS_ACTIVE = new Date().getFullYear() - CONTACT.foundedYear;

const STATS = [
  { label: `Jahre am Markt · seit ${CONTACT.foundedYear}`, value: YEARS_ACTIVE, suffix: '' },
  { label: 'Beratungen pro Jahr', value: 500, suffix: '+' },
  { label: 'Projekte pro Jahr', value: 450, suffix: '+' },
  { label: 'Werktage Lieferzeit', value: 3, suffix: '' },
];

export function Stats() {
  return (
    <section className="border-t border-mist bg-paper py-24 md:py-32">
      <div className="container">
        <Eyebrow number="06">Kennzahlen</Eyebrow>
        <h2 className="h-display mt-6 max-w-3xl text-4xl md:text-6xl">
          Konsequent, seit <em className="italic">{CONTACT.foundedYear}</em>.
        </h2>
        <div className="mt-16 grid grid-cols-2 gap-10 lg:grid-cols-4 lg:gap-16">
          {STATS.map((s) => (
            <div key={s.label} className="border-t border-mist pt-6">
              <span className="font-display text-6xl tracking-tightest md:text-7xl">
                <CountUp to={s.value} suffix={s.suffix} />
              </span>
              <p className="font-mono mt-3 text-[11px] uppercase tracking-[0.18em] text-ink/70">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
