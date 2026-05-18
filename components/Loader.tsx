'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Loader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Page-Loader nur beim ersten Visit pro Session zeigen.
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem('gg_loader_done')) {
      setDone(true);
      return;
    }
    const t = setTimeout(() => {
      sessionStorage.setItem('gg_loader_done', '1');
      setDone(true);
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed inset-0 z-[100] grid place-items-center bg-linen"
        >
          <div className="flex flex-col items-center">
            <span className="font-display text-3xl tracking-tight text-ink">GREEN-GARD</span>
            <div className="mt-4 h-px w-32 bg-copper/30 overflow-hidden">
              <span className="block h-full bg-copper animate-line-grow" />
            </div>
            <span className="eyebrow mt-4">Wiesbaden · Est. 2004</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
