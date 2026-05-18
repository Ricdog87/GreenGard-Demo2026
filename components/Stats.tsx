'use client';

import { useEffect, useRef, useState } from 'react';
import { Eyebrow } from '@/components/Eyebrow';

function CountUp({ to, suffix }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1400;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const ease = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(to * ease));
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

const STATS = [
  { label: 'Jahre Erfahrung', value: 20, suffix: '+' },
  { label: 'Beratungen pro Jahr', value: 500, suffix: '+' },
  { label: 'Projekte pro Jahr', value: 450, suffix: '+' },
  { label: 'Werktage Lieferzeit', value: 3, suffix: '' },
];

export function Stats() {
  return (
    <section className="bg-paper border-t border-mist py-24 md:py-32">
      <div className="container">
        <Eyebrow number="05">Kennzahlen</Eyebrow>
        <h2 className="h-display text-4xl md:text-6xl mt-6 max-w-3xl">
          Konsequent, seit <em className="italic">zwei Jahrzehnten</em>.
        </h2>
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
          {STATS.map((s) => (
            <div key={s.label} className="border-t border-mist pt-6">
              <span className="font-display text-6xl md:text-7xl tracking-tightest">
                <CountUp to={s.value} suffix={s.suffix} />
              </span>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] mt-3 text-ink/70">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
