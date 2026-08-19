'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Mode } from '@/lib/pricing';
import { AUDIENCES, type Audience } from '@/lib/audience';

export interface CartLine {
  slug: string;
  name: string;
  /** Anbieter bzw. Art — bei Schulungen schlicht "Schulung". */
  brand: string;
  image: string;
  netPrice: number;
  qty: number;
  /** Gewählter Schulungstermin. Produkte laufen nicht mehr über den Warenkorb. */
  termin?: string;
}

interface CartState {
  /** Preisansicht: privat = brutto, profi = netto. Nachlässe werden nie angezeigt. */
  mode: Mode;
  setMode: (m: Mode) => void;
  /** Zielgruppe aus dem Entry-Fenster — steuert Navigation und Schnelleinstiege. */
  audience: Audience;
  /** true, sobald im Entry-Fenster gewählt wurde (persistiert). */
  audienceChosen: boolean;
  chooseAudience: (a: Audience) => void;
    /** Setzt die Auswahl zurück, das Entry-Fenster erscheint erneut. */
  resetAudience: () => void;
  /**
   * Angemeldeter Profi-Zugang. Steuert Konto-Link und Zugang zum Dashboard.
   * TODO: durch die Supabase-Session ersetzen, sobald Auth verbunden ist.
   */
  eingeloggt: boolean;
  anmelden: () => void;
  abmelden: () => void;

    items: CartLine[];
  drawerOpen: boolean;
  toast: { id: number; text: string } | null;
  /** Kurze Rückmeldung einblenden — auch außerhalb des Warenkorbs. */
  notify: (text: string) => void;
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
      // Der Header-Switch ändert nur die Preisansicht, nicht die Zielgruppe:
      // wer als Architekt kommt, will die Bruttopreise sehen können, ohne
      // seine Navigation zu verlieren.
      setMode: (m) => set({ mode: m }),
      audience: 'privat',
      audienceChosen: false,
      // Auswahl aus dem Entry-Fenster: Zielgruppe merken und die passende
      // Preisansicht setzen.
      chooseAudience: (a) => set({ audience: a, mode: AUDIENCES[a].mode, audienceChosen: true }),
            resetAudience: () => set({ audienceChosen: false }),
      eingeloggt: false,
      // Anmeldung schaltet zugleich die Profi-Preisansicht frei.
      anmelden: () => set({ eingeloggt: true, audience: 'profi', mode: 'profi', audienceChosen: true }),
      // Beim Abmelden zurück in die Standardansicht (Privat) — einen
      // manuellen Umschalter gibt es seit 18.08.2026 nicht mehr.
      abmelden: () => set({ eingeloggt: false, audience: 'privat', mode: 'privat' }),

      items: [],
      drawerOpen: false,
      toast: null,
            notify: (text) => set({ toast: { id: Date.now(), text } }),
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
      partialize: (s) => ({
        items: s.items,
        mode: s.mode,
                audience: s.audience,
        audienceChosen: s.audienceChosen,
        eingeloggt: s.eingeloggt,
      }),
      // Wichtig: NICHT automatisch hydrieren. Sonst rendert der Client beim
      // ersten Durchgang schon Profi-Nettopreise, während im statischen HTML
      // Bruttopreise stehen — das ist ein Hydration-Mismatch. Die Rehydration
      // löst <EntryExperience /> nach dem Mount aus.
      skipHydration: true,
    }
  )
);
