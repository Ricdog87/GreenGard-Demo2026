'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Das Signature-Piece beim Scrollen: das Zitat füllt sich Wort für Wort mit
 * Tinte, direkt an die Scroll-Position gekoppelt (scrub) — vorwärts wie
 * rückwärts. Ohne JavaScript oder mit reduzierter Bewegung steht der Text
 * einfach voll da.
 */
export function PullQuote({
  children,
  attribution,
}: {
  children: string;
  attribution?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const words = children.split(' ');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.pq-word',
        { opacity: 0.13 },
        {
          opacity: 1,
          ease: 'none',
          duration: 1,
          stagger: 0.18,
          scrollTrigger: {
            trigger: el,
            start: 'top 78%',
            end: 'center 42%',
            scrub: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [children]);

  return (
    <section ref={ref} className="border-y border-mist bg-linen py-32 md:py-48">
      <div className="container">
        <blockquote className="font-display mx-auto max-w-5xl text-balance text-center text-4xl italic leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
          <span aria-hidden className="pq-word">„</span>
          {words.map((w, i) => (
            <span key={i} className="pq-word">
              {w}
              {i < words.length - 1 ? ' ' : ''}
            </span>
          ))}
          <span aria-hidden className="pq-word">“</span>
        </blockquote>
        {attribution && (
          <p
            data-reveal
            className="font-mono mt-10 text-center text-[11px] uppercase tracking-[0.18em] text-moss"
          >
            — {attribution}
          </p>
        )}
      </div>
    </section>
  );
}
