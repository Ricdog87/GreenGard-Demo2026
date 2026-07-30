'use client';

import { motion } from 'framer-motion';

export function PullQuote({
  children,
  attribution,
}: {
  children: React.ReactNode;
  attribution?: string;
}) {
  return (
    <section className="border-y border-mist bg-linen py-32 md:py-48">
      <div className="container">
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="font-display mx-auto max-w-5xl text-balance text-center text-4xl italic leading-[1.05] tracking-tight md:text-6xl lg:text-7xl"
        >
          „{children}“
        </motion.blockquote>
        {attribution && (
          <p className="font-mono mt-10 text-center text-[11px] uppercase tracking-[0.18em] text-moss">
            — {attribution}
          </p>
        )}
      </div>
    </section>
  );
}
