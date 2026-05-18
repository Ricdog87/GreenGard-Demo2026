// Pricing helpers. We store NET prices in the product data.
// B2C = brutto (netto * 1.19). B2B = netto. Volume discount only applies for B2B.

export type Mode = 'b2c' | 'b2b';

export const VAT_RATE = 0.19;

export function priceFor(netPrice: number, mode: Mode): number {
  return mode === 'b2c' ? netPrice * (1 + VAT_RATE) : netPrice;
}

export function priceLabel(mode: Mode): string {
  return mode === 'b2c' ? 'inkl. MwSt.' : 'zzgl. MwSt.';
}

// B2B volume discount tiers (per line item quantity).
export function volumeDiscount(qty: number, mode: Mode): number {
  if (mode !== 'b2b') return 0;
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
