'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Globale Scroll-Choreografie. Server-Komponenten markieren Elemente nur mit
 * Daten-Attributen — die gesamte Bewegung entsteht hier an einer Stelle:
 *
 *   data-reveal            sanftes Aufsteigen beim Eintritt in den Viewport
 *   data-reveal-group      Kinder gestaffelt nacheinander (optional ="x":
 *                          seitliches Einlaufen, z.B. für horizontale Reihen)
 *   data-parallax="6"      Bild driftet beim Scrollen (±6 %) und ist dafür
 *                          leicht vergrößert — nur in overflow-hidden-Rahmen!
 *
 * Bewusst nur Opacity/Transform (Compositor-only) und `once`-Trigger für
 * Reveals: schnell, ruhig, kein Nachflackern. prefers-reduced-motion
 * deaktiviert alles.
 */
export function ScrollFx() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 28,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
        const items = Array.from(group.children) as HTMLElement[];
        if (items.length === 0) return;
        const horizontal = group.dataset.revealGroup === 'x';
        gsap.from(items, {
          ...(horizontal ? { x: 48 } : { y: 34 }),
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.09,
          scrollTrigger: { trigger: group, start: 'top 86%', once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
        const amount = parseFloat(el.dataset.parallax || '6');
        gsap.fromTo(
          el,
          { yPercent: -amount, scale: 1.12 },
          {
            yPercent: amount,
            scale: 1.12,
            ease: 'none',
            scrollTrigger: {
              trigger: el.parentElement ?? el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      });
    });

    // Nach spät ladenden Bildern die Trigger-Positionen nachjustieren.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    const t = setTimeout(refresh, 700);

    return () => {
      window.removeEventListener('load', refresh);
      clearTimeout(t);
      ctx.revert();
    };
  }, [pathname]);

  return null;
}
