'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

export function MagneticButton({
  children,
  className,
  strength = 0.3,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & { strength?: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    const inner = innerRef.current;
    if (!el || !inner) return;

    // Ohne Maus (Touch) und bei reduzierter Bewegung: kein Magnet-Effekt.
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const xTo = gsap.quickTo(inner, 'x', { duration: 0.4, ease: 'elastic.out(1,0.5)' });
    const yTo = gsap.quickTo(inner, 'y', { duration: 0.4, ease: 'elastic.out(1,0.5)' });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      xTo((e.clientX - (rect.left + rect.width / 2)) * strength);
      yTo((e.clientY - (rect.top + rect.height / 2)) * strength);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength]);

  return (
    <div ref={ref} className={cn('inline-block', className)} {...rest}>
      <div ref={innerRef} className="inline-block will-change-transform">
        {children}
      </div>
    </div>
  );
}
