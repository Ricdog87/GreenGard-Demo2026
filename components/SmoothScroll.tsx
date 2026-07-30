'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Lenis-Smooth-Scroll, sauber mit GSAP ScrollTrigger synchronisiert:
 * Lenis meldet jede Scroll-Position an ScrollTrigger, der GSAP-Ticker treibt
 * Lenis — eine Uhr für alles, keine doppelten rAF-Loops.
 */
export function SmoothScroll() {
  useEffect(() => {
    // Reduced-Motion respektieren: native Scroll-Physik, keine Scroll-Effekte.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
