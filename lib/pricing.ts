// Preis-Logik. In den Daten stehen NETTO-Preise.
// Privatkunde = brutto (netto × 1,19). Profi = netto + Staffelrabatt.

export type Mode = 'privat' | 'profi';

export const VAT_RATE = 0.19;

export function priceFor(netPrice: number, mode: Mode): number {
  return mode === 'privat' ? netPrice * (1 + VAT_RATE) : netPrice;
}

export function priceLabel(mode: Mode): string {
  return mode === 'privat' ? 'inkl. MwSt.' : 'zzgl. MwSt.';
}

/** Staffelrabatt je Position — nur für Profi-Kunden. */
export function volumeDiscount(qty: number, mode: Mode): number {
  if (mode !== 'profi') return 0;
  if (qty >= 25) return 0.15;
  if (qty >= 10) return 0.10;
  if (qty >= 5) return 0.05;
  return 0;
}

export function lineTotal(netPrice: number, qty: number, mode: Mode): number {
  const discount = volumeDiscount(qty, mode);
  const unit = priceFor(netPrice, mode) * (1 - discount);
  return unit * qty;
}

export const DISCOUNT_TIERS = [
  { range: '5 – 9', percent: 5 },
  { range: '10 – 24', percent: 10 },
  { range: '25 +', percent: 15 },
] as const;
