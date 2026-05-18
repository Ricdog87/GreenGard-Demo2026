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
    <section className="bg-linen border-y border-mist py-32 md:py-48">
      <div className="container">
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="font-display italic text-balance text-center mx-auto max-w-5xl text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05]"
        >
          „{children}"
        </motion.blockquote>
        {attribution && (
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-moss mt-10 text-center">
            — {attribution}
          </p>
        )}
      </div>
    </section>
  );
}
