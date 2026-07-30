'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export function Cursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const [variant, setVariant] = useState<'default' | 'hover' | 'view'>('default');
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Nur bei echter Maus — Touch-Geräte behalten das Systemverhalten.
    const mq = window.matchMedia('(pointer: fine)');
    setEnabled(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setEnabled(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    if (!dot) return;

    const xTo = gsap.quickTo(dot, 'x', { duration: 0.35, ease: 'power3.out' });
    const yTo = gsap.quickTo(dot, 'y', { duration: 0.35, ease: 'power3.out' });

    const handleMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);

      const target = e.target as HTMLElement | null;
      const interactive = target?.closest('[data-cursor]') as HTMLElement | null;
      if (interactive) {
        setVariant(interactive.dataset.cursor === 'view' ? 'view' : 'hover');
      } else {
        setVariant('default');
      }
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [enabled]);

  if (!enabled) return null;

  const size = variant === 'view' ? 64 : variant === 'hover' ? 48 : 8;
  const blend = variant === 'default' ? 'normal' : 'difference';
  const bg = variant === 'default' ? '#0A0F0C' : '#F5F1E8';

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[80] hidden -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full transition-[width,height] duration-200 ease-out md:grid"
      style={{
        width: size,
        height: size,
        background: bg,
        mixBlendMode: blend as React.CSSProperties['mixBlendMode'],
      }}
    >
      {variant === 'view' && (
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-forest">View</span>
      )}
    </div>
  );
}
