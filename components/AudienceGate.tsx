'use client';

import Image from 'next/image';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useCart } from '@/store/cart';
import { useUI } from '@/store/ui';
import type { Mode } from '@/lib/pricing';

const CHOICES: {
  mode: Mode;
  kicker: string;
  title: string;
  claim: string;
  image: string;
  alt: string;
}[] = [
  {
    mode: 'privat',
    kicker: 'I',
    title: 'Privatkunde',
    claim: 'Lösungen für Ihren Garten',
    image: '/videos/hero-poster.jpg',
    alt: 'Versenkregner in gepflegtem Privatgarten',
  },
  {
    mode: 'profi',
    kicker: 'II',
    title: 'Handwerker & GaLaBau',
    claim: 'Konditionen für Profis',
    image:
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=80',
    alt: 'Werkzeug und Substrat auf der Arbeitsfläche eines Gartenbaubetriebs',
  },
];

export function AudienceGate({ onDone }: { onDone: () => void }) {
  const chooseAudience = useCart((s) => s.chooseAudience);
  const finishEntry = useUI((s) => s.finishEntry);
  const [visible, setVisible] = useState(true);

  function choose(mode: Mode) {
    // Auswahl steuert dieselbe Preis-Logik wie der Header-Switch und wird
    // über den Zustand-Store in localStorage persistiert.
    chooseAudience(mode);
    setVisible(false);
  }

  return (
    <AnimatePresence
      onExitComplete={() => {
        finishEntry();
        onDone();
      }}
    >
      {visible && (
        <motion.div
          key="audience-gate"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          role="dialog"
          aria-modal="true"
          aria-label="Kundenart wählen"
          className="fixed inset-0 z-[95] overflow-y-auto bg-linen"
        >
          {/* Höhen bewusst knapp gehalten: auf 1440×900 muss alles inklusive
              Hinweiszeile ohne Scrollen sichtbar bleiben. */}
          <div className="container flex min-h-full flex-col justify-center py-8">
            <div className="text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-green-gard.svg"
                alt="Green-Gard"
                className="mx-auto h-7 w-auto sm:h-8"
              />
              <h1 className="h-display mt-6 text-4xl sm:text-5xl">
                Willkommen bei <span className="italic">Green-Gard</span>.
              </h1>
              <p className="mt-3 text-ink/70">Damit wir Ihnen die richtigen Inhalte zeigen:</p>
            </div>

            <div className="mt-8 grid gap-5 md:mt-10 md:grid-cols-2 md:gap-6">
              {CHOICES.map((c, i) => (
                <motion.button
                  key={c.mode}
                  type="button"
                  data-cursor="hover"
                  onClick={() => choose(c.mode)}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.08, ease: 'easeOut' }}
                  className="group relative bg-paper text-left transition-transform duration-500 hover:-translate-y-1.5"
                >
                  <div className="relative aspect-[16/10] overflow-hidden md:aspect-[16/11]">
                    <Image
                      src={c.image}
                      alt={c.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={i === 0}
                      className="object-cover transition-transform [transition-duration:1200ms] group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest/45 to-transparent" />
                  </div>
                  <div className="flex items-start justify-between gap-4 p-5 md:p-6">
                    <div>
                      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-moss">
                        {c.kicker}
                      </span>
                      <h2 className="font-display mt-1 text-2xl tracking-tight md:text-3xl">
                        {c.title}
                      </h2>
                      <p className="font-display mt-1 text-sm italic text-moss">{c.claim}</p>
                    </div>
                    <ArrowRight className="mt-2 h-5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                  {/* Hairline zieht beim Hover durch die Karte */}
                  <span className="absolute bottom-0 left-0 h-px w-0 bg-bronze transition-all duration-500 group-hover:w-full" />
                </motion.button>
              ))}
            </div>

            <p className="font-mono mt-8 text-center text-[10px] uppercase tracking-[0.18em] text-ink/45">
              Die Auswahl lässt sich später oben im Header jederzeit wechseln
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
