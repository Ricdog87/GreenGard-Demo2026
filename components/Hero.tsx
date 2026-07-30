'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { MagneticButton } from '@/components/MagneticButton';
import { Button } from '@/components/ui/button';
import { useUI } from '@/store/ui';
import { CONTACT } from '@/lib/contact';

// Ein Span pro Buchstabe für den GSAP-Reveal — aber jedes Wort bleibt in einem
// nowrap-Wrapper. Ohne den würde der Umbruch mitten im Wort passieren, weil
// jeder Buchstabe ein eigenes Inline-Element ist ("unsichtba/re" auf 375px).
function HeroHeadline() {
  const lines: { text: string; italic?: boolean }[] = [
    { text: 'Der unsichtbare' },
    { text: 'Luxus eines' },
    { text: 'perfekten Gartens.', italic: true },
  ];

  return (
    <h1 className="hero-h mt-6 max-w-[15ch] text-linen">
      {lines.map((line, li) => {
        const words = line.text.split(' ');
        return (
          <span key={li} className="block overflow-hidden pb-[0.06em]">
            {words.map((word, wi) => (
              <span key={`${li}-${wi}`} className="inline-block whitespace-nowrap">
                {word.split('').map((ch, ci) => (
                  <span
                    key={`${li}-${wi}-${ci}`}
                    className={`hero-char inline-block ${line.italic ? 'italic' : ''}`}
                  >
                    {ch}
                  </span>
                ))}
                {wi < words.length - 1 && <span className="hero-char inline-block">&nbsp;</span>}
              </span>
            ))}
          </span>
        );
      })}
    </h1>
  );
}

function LiveStamp() {
  const [now, setNow] = useState('');
  useEffect(() => {
    const fmt = () =>
      setNow(new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }));
    fmt();
    const i = setInterval(fmt, 30_000);
    return () => clearInterval(i);
  }, []);
  return (
    <div className="font-mono num text-[10px] uppercase tracking-[0.22em] text-linen/70">
      Wiesbaden · {now || '—'} · 22°C · Sonnig
    </div>
  );
}

/**
 * Hintergrund-Video: nur ab 768px und nur ohne prefers-reduced-motion.
 * Darunter bleibt es beim Poster-Frame — 1,7 MB Video sind auf Mobilfunk
 * nichts, was man ungefragt laden lässt.
 */
function HeroMedia() {
  const [playVideo, setPlayVideo] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 768px)');
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const evaluate = () => setPlayVideo(wide.matches && !calm.matches);
    evaluate();
    wide.addEventListener('change', evaluate);
    calm.addEventListener('change', evaluate);
    return () => {
      wide.removeEventListener('change', evaluate);
      calm.removeEventListener('change', evaluate);
    };
  }, []);

  if (!playVideo) {
    return (
      <Image
        src="/videos/hero-poster.jpg"
        alt="Versenkregner bewässert einen Rasen im Abendlicht"
        fill
        priority
        sizes="100vw"
        className="object-cover"
        data-cursor="view"
      />
    );
  }

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster="/videos/hero-poster.jpg"
      aria-hidden
      data-cursor="view"
      className="absolute inset-0 h-full w-full object-cover"
    >
      <source src="/videos/hero-regner.webm" type="video/webm" />
      <source src="/videos/hero-regner.mp4" type="video/mp4" />
    </video>
  );
}

export function Hero() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const entryDone = useUI((s) => s.entryDone);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (calm) {
        gsap.set('.hero-char, .hero-reveal', { yPercent: 0, opacity: 1, y: 0 });
        return;
      }

      gsap.set('.hero-char', { yPercent: 110 });
      gsap.set('.hero-reveal', { opacity: 0, y: 18 });

      // Reveal startet erst, wenn Entry-Gate bzw. Loader weg sind.
      if (!entryDone) return;

      const tl = gsap.timeline({ delay: 0.15 });
      tl.to('.hero-char', { yPercent: 0, stagger: 0.018, duration: 0.9, ease: 'power3.out' });
      tl.to(
        '.hero-reveal',
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.7, ease: 'power3.out' },
        '-=0.5'
      );
    }, containerRef);

    return () => ctx.revert();
  }, [entryDone]);

  return (
    <section
      ref={containerRef}
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-forest text-linen"
    >
      <HeroMedia />
      <div className="absolute inset-0 bg-gradient-to-t from-forest/85 via-forest/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-forest/45 via-transparent to-transparent" />
      {/* Schutz für die Eyebrow-Zeile: der Himmel im Video ist oben sehr hell. */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-forest/55 to-transparent" />

      <div className="container absolute inset-0 z-10 flex flex-col justify-between py-8 pt-6 md:py-12">
        <div className="flex items-start justify-between gap-6">
          <p className="hero-reveal font-mono text-[10px] uppercase tracking-[0.22em] text-linen/80">
            Est. {CONTACT.foundedYear} · Wiesbaden
          </p>
          <p className="hero-reveal hidden font-mono text-[10px] uppercase tracking-[0.22em] text-linen/70 sm:block">
            Bewässerung · Licht · Robotik · Pool
          </p>
        </div>

        <div className="flex flex-1 items-end pb-4">
          <div className="w-full">
            <HeroHeadline />
            <p className="hero-reveal mt-8 max-w-xl text-base leading-snug text-linen/80 md:text-lg">
              <span className="italic">Smart Irrigation. Engineered Lighting. Autonomous Mowing.</span>{' '}
              Seit {CONTACT.foundedYear}.
            </p>
            <div className="hero-reveal mt-10 flex flex-wrap items-center gap-4">
              <MagneticButton>
                <Button asChild variant="accent" size="xl">
                  <Link href="/planung">
                    Planung beginnen <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </MagneticButton>
              <Button asChild variant="ghost" size="xl" className="text-linen hover:bg-linen/10">
                <Link href="/produkte">Produkte entdecken</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between gap-6">
          <div className="hero-reveal flex items-center gap-3 text-linen/80">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em]">Scroll</span>
            <span className="relative block h-px w-12 overflow-hidden bg-linen/40">
              <span className="absolute inset-y-0 left-0 w-1/3 animate-[marquee_2s_linear_infinite] bg-linen" />
            </span>
            <ArrowDown className="h-3.5 w-3.5" />
          </div>
          <div className="hero-reveal">
            <LiveStamp />
          </div>
        </div>
      </div>
    </section>
  );
}
