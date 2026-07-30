'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useUI } from '@/store/ui';
import { CONTACT } from '@/lib/contact';

/** Editorial-Loader für wiederkehrende Besucher (Erstbesucher sehen das Entry-Gate). */
export function Loader({ onDone }: { onDone: () => void }) {
  const finishEntry = useUI((s) => s.finishEntry);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence
      onExitComplete={() => {
        finishEntry();
        onDone();
      }}
    >
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed inset-0 z-[95] grid place-items-center bg-linen"
        >
          <div className="flex flex-col items-center">
            <span className="font-display text-3xl tracking-tight text-ink">GREEN-GARD</span>
            <div className="mt-4 h-px w-32 overflow-hidden bg-copper/30">
              <span className="animate-line-grow block h-full bg-copper" />
            </div>
            <span className="eyebrow mt-4">
              Wiesbaden · Est. {CONTACT.foundedYear}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
