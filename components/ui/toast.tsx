'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCart } from '@/store/cart';

export function Toaster() {
  const toast = useCart((s) => s.toast);
  const [visibleId, setVisibleId] = useState<number | null>(null);

  useEffect(() => {
    if (!toast) return;
    setVisibleId(toast.id);
    const t = setTimeout(() => setVisibleId((cur) => (cur === toast.id ? null : cur)), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[100] max-w-[calc(100vw-3rem)]">
      <AnimatePresence>
        {toast && visibleId === toast.id && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto flex items-center gap-3 bg-forest text-linen px-5 py-4 shadow-2xl"
          >
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-linen/10">
              <Check className="h-3.5 w-3.5" />
            </span>
            <span className="text-sm">{toast.text}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
