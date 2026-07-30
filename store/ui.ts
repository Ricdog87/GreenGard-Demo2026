'use client';

import { create } from 'zustand';

interface UIState {
  /**
   * true, sobald Entry-Gate bzw. Loader durch sind. Der Hero startet seinen
   * GSAP-Reveal erst danach — sonst läuft die Animation hinter dem Overlay ab.
   */
  entryDone: boolean;
  finishEntry: () => void;
}

export const useUI = create<UIState>()((set) => ({
  entryDone: false,
  finishEntry: () => set({ entryDone: true }),
}));
