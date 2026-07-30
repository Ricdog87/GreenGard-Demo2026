'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Mode } from '@/lib/pricing';

export interface CartLine {
  slug: string;
  name: string;
  brand: string;
  image: string;
  netPrice: number;
  qty: number;
}

interface CartState {
  /** Preisansicht: privat = brutto, profi = netto + Staffelrabatt. */
  mode: Mode;
  setMode: (m: Mode) => void;
  /** true, sobald der Nutzer im Entry-Gate gewählt hat (persistiert). */
  audienceChosen: boolean;
  chooseAudience: (m: Mode) => void;

  items: CartLine[];
  drawerOpen: boolean;
  toast: { id: number; text: string } | null;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (item: Omit<CartLine, 'qty'> & { qty?: number }) => void;
  setQty: (slug: string, qty: number) => void;
  removeItem: (slug: string) => void;
  clear: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      mode: 'privat',
      setMode: (m) => set({ mode: m }),
      audienceChosen: false,
      // Auswahl aus dem Entry-Gate: setzt Preisansicht und merkt sich, dass das
      // Gate erledigt ist — dieselbe Logik wie der Header-Switch.
      chooseAudience: (m) => set({ mode: m, audienceChosen: true }),

      items: [],
      drawerOpen: false,
      toast: null,
      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),
      addItem: (item) => {
        const qty = item.qty ?? 1;
        const items = get().items.slice();
        const idx = items.findIndex((l) => l.slug === item.slug);
        if (idx >= 0) {
          items[idx] = { ...items[idx], qty: items[idx].qty + qty };
        } else {
          items.push({ ...item, qty });
        }
        set({ items, toast: { id: Date.now(), text: `${item.name} in den Warenkorb gelegt` } });
      },
      setQty: (slug, qty) => {
        if (qty <= 0) {
          set({ items: get().items.filter((l) => l.slug !== slug) });
        } else {
          set({ items: get().items.map((l) => (l.slug === slug ? { ...l, qty } : l)) });
        }
      },
      removeItem: (slug) => set({ items: get().items.filter((l) => l.slug !== slug) }),
      clear: () => set({ items: [] }),
    }),
    {
      name: 'gg-audience',
      // Warenkorb, Preisansicht und Gate-Status überleben den Reload.
      partialize: (s) => ({ items: s.items, mode: s.mode, audienceChosen: s.audienceChosen }),
      // Wichtig: NICHT automatisch hydrieren. Sonst rendert der Client beim
      // ersten Durchgang schon Profi-Nettopreise, während im statischen HTML
      // Bruttopreise stehen — das ist ein Hydration-Mismatch. Die Rehydration
      // löst <EntryExperience /> nach dem Mount aus.
      skipHydration: true,
    }
  )
);
