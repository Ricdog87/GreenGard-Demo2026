// Zugriff auf die echten Katalogdaten aus knowledge/green-gard/.
//
// Der Katalog 2025/26 wird abschnittsweise extrahiert. catalog_meta.json listet
// alle acht Abschnitte; eingebunden wird hier, was bereits als Datei vorliegt.
// Kommt ein Abschnitt dazu, genügt ein Import in SECTION_FILES — Dashboard,
// Schnellbestellung und EK-Preise ziehen ihn automatisch mit.

import meta from '@/knowledge/green-gard/catalog_meta.json';
import bewTropfMicro from '@/knowledge/green-gard/bewaesserung_tropf_micro.json';

export interface KatalogArtikel {
  bestellnummer: string;
  hersteller: string;
  modell?: string;
  beschreibung: string;
  /** Rabattgruppe des Artikels — bestimmt den Profi-Einkaufspreis. */
  rabattgruppe: string;
  verpackungseinheit: string;
  /** Listenpreis netto je Verpackungseinheit. */
  preisVE: number;
  /** Abschnitt innerhalb des Katalogs, z.B. "Tropfrohr". */
  abschnitt: string;
  /** Oberkategorie, z.B. "Bewaesserung - Tropf & Mikro". */
  bereich: string;
}

interface RohSection {
  category: string;
  sections: {
    id: string;
    title: string;
    description?: string;
    products: {
      bestellnummer: string;
      hersteller: string;
      modell?: string;
      beschreibung: string;
      rabattgruppe: string;
      verpackungseinheit: string;
      preis_ve_eur: number;
    }[];
  }[];
}

/** Bereits extrahierte Abschnittsdateien. Weitere hier ergänzen. */
const SECTION_FILES: RohSection[] = [bewTropfMicro as RohSection];

export const KATALOG_META = meta;

/** Wie viele Abschnitte laut catalog_meta.json noch fehlen. */
export const ABSCHNITTE_GESAMT = meta.sections.length;
export const ABSCHNITTE_VERFUEGBAR = SECTION_FILES.length;

export const katalogArtikel: KatalogArtikel[] = SECTION_FILES.flatMap((datei) =>
  datei.sections.flatMap((abschnitt) =>
    abschnitt.products.map((p) => ({
      bestellnummer: p.bestellnummer,
      hersteller: p.hersteller,
      modell: p.modell,
      beschreibung: p.beschreibung,
      rabattgruppe: p.rabattgruppe,
      verpackungseinheit: p.verpackungseinheit,
      preisVE: p.preis_ve_eur,
      abschnitt: abschnitt.title,
      bereich: datei.category,
    }))
  )
);

/**
 * Bewusst KEIN Rabattschlüssel in dieser Datei.
 *
 * Preisnachlässe werden je Kunde individuell vereinbart (Kooperationsvertrag
 * bzw. Abstimmung) und dürfen nicht veröffentlicht werden. Eine Prozenttabelle
 * hier läge im Client-Bundle und wäre für jeden auslesbar — auch wenn sie
 * nirgends angezeigt würde. Kundenspezifische Einkaufspreise kommen deshalb
 * ausschließlich aus dem Konto (lib/konto-daten.ts, später aus Supabase).
 *
 * Die Rabattgruppe eines Artikels bleibt als Buchstabe erhalten: ein internes
 * Sortiermerkmal ohne Aussage über die Höhe.
 */

export function findeArtikel(bestellnummer: string): KatalogArtikel | undefined {
  const gesucht = bestellnummer.trim();
  return katalogArtikel.find((a) => a.bestellnummer === gesucht);
}
