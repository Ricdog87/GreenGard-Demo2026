'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import testimonials from '@/data/testimonials.json';
import { Eyebrow } from '@/components/Eyebrow';

export function TestimonialSlider() {
  const [i, setI] = useState(0);
  const t = testimonials[i];
  const len = testimonials.length;

  return (
    <section className="bg-bark text-linen py-28 md:py-36">
      <div className="container">
        <Eyebrow number="06" className="text-linen/70 [&>span:first-child]:bg-linen/30">Stimmen</Eyebrow>
        <h2 className="h-display text-4xl md:text-6xl mt-6 max-w-3xl">
          Was unsere Kunden <em className="italic">sagen</em>.
        </h2>

        <div className="mt-16 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={t.name}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                className="relative aspect-[4/5] overflow-hidden bg-forest"
              >
                <Image
                  src={t.avatar}
                  alt={t.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 25vw"
                  className="object-cover grayscale"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={t.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
                className="font-display italic text-balance text-2xl md:text-4xl lg:text-5xl leading-[1.15]"
              >
                „{t.quote}"
              </motion.blockquote>
            </AnimatePresence>

            <div className="mt-10 flex items-end justify-between">
              <div>
                <p className="font-display text-xl tracking-tight">{t.name}</p>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-linen/60 mt-1">{t.role}</p>
              </div>
              <div className="flex items-center gap-6">
                <span className="num font-mono text-[11px] uppercase tracking-[0.18em] text-linen/60">
                  {String(i + 1).padStart(2, '0')} / {String(len).padStart(2, '0')}
                </span>
                <div className="flex gap-2">
                  <button data-cursor="hover" onClick={() => setI((i - 1 + len) % len)} className="grid h-10 w-10 place-items-center border border-linen/30 hover:bg-linen/10" aria-label="Vorheriges">
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <button data-cursor="hover" onClick={() => setI((i + 1) % len)} className="grid h-10 w-10 place-items-center border border-linen/30 hover:bg-linen/10" aria-label="Nächstes">
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
