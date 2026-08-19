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
 *   data-reveal-group      Kinder gestaffelt nacheinander
 *   data-parallax="6"      Bild driftet beim Scrollen (±6 %) und ist dafür
 *                          leicht vergrößert — nur in overflow-hidden-Rahmen!
 *
 * Bewusst NUR vertikale Offsets: ein horizontales `x` verschiebt Elemente, die
 * noch auf ihren Reveal warten, nach rechts aus dem Viewport — das verbreitert
 * das Dokument und erzeugt einen horizontalen Scrollbalken.
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
      // Premium-Pass 18.08.2026: power4-Easing statt power3 — die Bewegung
      // startet zügig und läuft butterweich aus, das wirkt teurer als ein
      // gleichmäßiges Abbremsen.
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 32,
          opacity: 0,
          duration: 1.2,
          ease: 'power4.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
        const items = Array.from(group.children) as HTMLElement[];
        if (items.length === 0) return;
        gsap.from(items, {
          y: 36,
          scale: 0.985,
          opacity: 0,
          duration: 1.2,
          ease: 'power4.out',
          stagger: 0.08,
          scrollTrigger: { trigger: group, start: 'top 86%', once: true },
        });
      });

      // Parallax nur auf großen Screens mit Maus: auf dem Handy kostet der
      // Scrub Bildrate und die Vergrößerung Schärfe — natives Scrollen ohne
      // Drift fühlt sich dort hochwertiger an.
      const darfParallax = window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches;
      if (darfParallax) {
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
      }
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
