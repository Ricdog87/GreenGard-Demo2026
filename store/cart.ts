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
  mode: Mode;
  setMode: (m: Mode) => void;
  items: CartLine[];
  drawerOpen: boolean;
  toast: { id: number; text: string } | null;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (item: Omit<CartLine, 'qty'> & { qty?: number }) => void;
  setQty: (slug: string, qty: number) => void;
  removeItem: (slug: string) => void;
  clear: () => void;
  count: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      mode: 'b2c',
      setMode: (m) => set({ mode: m }),
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
      count: () => get().items.reduce((s, l) => s + l.qty, 0),
    }),
    {
      name: 'gg-cart',
      partialize: (s) => ({ items: s.items, mode: s.mode }),
    }
  )
);
