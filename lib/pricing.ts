// Preis-Logik. In den Daten stehen NETTO-Preise.
// Privatkunde = brutto (netto × 1,19), Profi = netto.
//
// WICHTIG: Auf der Website werden keine Preisnachlässe abgebildet. Konditionen
// werden je Kunde individuell vereinbart (Kooperationsvertrag bzw. Abstimmung)
// und dürfen weder angezeigt noch als Tabelle im Client-Bundle liegen — von dort
// wären sie auslesbar. Kundenspezifische Preise kommen nach der Anmeldung aus
// dem Backend.

export type Mode = 'privat' | 'profi';

export const VAT_RATE = 0.19;

export function priceFor(netPrice: number, mode: Mode): number {
  return mode === 'privat' ? netPrice * (1 + VAT_RATE) : netPrice;
}

export function priceLabel(mode: Mode): string {
  return mode === 'privat' ? 'inkl. MwSt.' : 'zzgl. MwSt.';
}



export function lineTotal(netPrice: number, qty: number, mode: Mode): number {
  return priceFor(netPrice, mode) * qty;
}


