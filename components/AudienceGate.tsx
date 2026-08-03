'use client';

import Image from 'next/image';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, LogIn, X } from 'lucide-react';
import { LoginForm } from '@/components/LoginForm';
import { Button } from '@/components/ui/button';
import { useCart } from '@/store/cart';
import { useUI } from '@/store/ui';
import { AUDIENCES, AUDIENCE_ORDER, type Audience } from '@/lib/audience';

/**
 * Entry-Fenster direkt nach dem Laden: Zielgruppe wählen oder anmelden.
 * Die Auswahl steuert Preisansicht, Navigation und Schnelleinstiege — damit
 * jede Besucherin sofort die passende Maske sieht.
 */
export function AudienceGate({ onDone }: { onDone: () => void }) {
  const chooseAudience = useCart((s) => s.chooseAudience);
  const finishEntry = useUI((s) => s.finishEntry);
  const [visible, setVisible] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);

  function close() {
    setVisible(false);
  }

  function choose(audience: Audience) {
    chooseAudience(audience);
    close();
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
          aria-label="Zielgruppe wählen oder anmelden"
          className="fixed inset-0 z-[95] overflow-y-auto bg-linen"
        >
          <div className="container flex min-h-full flex-col justify-center py-8">
            <div className="text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-green-gard.svg"
                alt="Green-Gard"
                className="mx-auto h-7 w-auto sm:h-8"
              />
              <h1 className="h-display mt-5 text-[26px] sm:mt-6 sm:text-4xl md:text-5xl">
                Willkommen bei <span className="italic">Green-Gard</span>.
              </h1>
              {/* Auf kleinen Displays nur die Frage — das Fenster soll kurz bleiben. */}
              <p className="mt-3 hidden text-ink/70 sm:block">
                Damit wir gleich die richtigen Inhalte und Preise zeigen:
              </p>
              <p className="mt-2 font-medium text-ink sm:mt-1">
                Sind Sie GaLaBau / Architekt, privat unterwegs oder Händler?
              </p>
            </div>

            {/* Drei Zielgruppen. Mobile als kompakte Reihen, ab md als Karten. */}
            <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-3 md:gap-5">
              {AUDIENCE_ORDER.map((id, i) => {
                const a = AUDIENCES[id];
                return (
                  <motion.button
                    key={a.id}
                    type="button"
                    data-cursor="hover"
                    onClick={() => choose(a.id)}
                    // Der Button heißt nach der Auswahl, nicht nach dem Bild —
                    // sonst liest ein Screenreader die Bildbeschreibung vor.
                    aria-label={`${a.title} — ${a.claim}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.12 + i * 0.07, ease: 'easeOut' }}
                    className="group relative flex items-center gap-4 bg-paper p-3 text-left transition-transform duration-500 hover:-translate-y-1 md:flex-col md:items-stretch md:gap-0 md:p-0"
                  >
                    <div className="relative h-16 w-20 shrink-0 overflow-hidden md:aspect-[16/11] md:h-auto md:w-full">
                      <Image
                        src={a.image}
                        alt=""
                        aria-hidden
                        fill
                        sizes="(max-width: 768px) 96px, 33vw"
                        priority={i === 0}
                        className="object-cover transition-transform [transition-duration:1200ms] group-hover:scale-[1.04]"
                      />
                    </div>
                    {/* pr-10 hält den Pfeil unten rechts vom Text frei. */}
                    <div className="min-w-0 flex-1 md:p-5 md:pr-12">
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-moss">
                        {a.kicker}
                      </span>
                      <h2 className="font-display text-lg leading-tight tracking-tight md:mt-0.5 md:text-2xl">
                        {a.title}
                      </h2>
                      <p className="font-display text-[13px] italic leading-snug text-moss md:text-sm">
                        {a.claim}
                      </p>
                      <p className="mt-2 hidden text-sm leading-snug text-ink/65 md:block">
                        {a.detail}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1 md:absolute md:bottom-5 md:right-5" />
                    {/* Hairline zieht beim Hover durch die Karte */}
                    <span className="absolute bottom-0 left-0 h-px w-0 bg-bronze transition-all duration-500 group-hover:w-full" />
                  </motion.button>
                );
              })}
            </div>

            {/* Anmeldung für bestehende Profi-Zugänge */}
            <div className="mx-auto mt-6 w-full max-w-2xl border-t border-mist pt-5 md:mt-8 md:pt-6">
                            {loginOpen ? (
                <div className="border border-forest/25 bg-paper p-6">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <p className="eyebrow">Anmelden</p>
                      <p className="font-display mt-1 text-xl tracking-tight">
                        Profi-Zugang
                      </p>
                    </div>
                    <button
                      type="button"
                      data-cursor="hover"
                      onClick={() => setLoginOpen(false)}
                      className="p-1 text-ink/50 hover:text-ink"
                      aria-label="Anmeldung schließen"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <LoginForm compact onSuccess={close} />
                </div>
              ) : (
                                // Profis sollen nicht erst eine Zielgruppe wählen müssen: ein Klick
                // aufs Anmelden bringt sie direkt in ihr Konto.
                <div className="flex flex-col items-center justify-between gap-4 bg-forest px-6 py-5 text-linen sm:flex-row">
                  <div className="text-center sm:text-left">
                    <p className="font-display text-lg tracking-tight">
                      Sie haben einen Profi-Zugang?
                    </p>
                    <p className="mt-0.5 text-sm text-linen/70">
                      Direkt zu Ihren Einkaufspreisen, Bestellungen und Projekten.
                    </p>
                  </div>
                  <Button
                    variant="accent"
                    size="lg"
                    className="shrink-0"
                    onClick={() => setLoginOpen(true)}
                  >
                    <LogIn className="h-4 w-4" /> Anmelden
                  </Button>
                </div>
              )}
            </div>

                        <p className="font-mono mt-5 text-center text-[10px] uppercase tracking-[0.18em] text-ink/45">
              Kein Profi-Zugang nötig — Auswahl treffen und weiter. Änderbar über Header
              oder Footer.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
