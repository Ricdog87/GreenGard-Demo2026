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
 * Rabattgruppen des Katalogs. Die Prozentsätze sind eine plausible Annahme —
 * die echten Konditionen hängen am Kundenkonto.
 * TODO: mit Jan abgleichen und je Kunde aus Supabase laden.
 */
export const RABATTGRUPPEN: Record<string, number> = {
  A: 0.25,
  B: 0.2,
  C: 0.15,
  D: 0.1,
};

/** Einkaufspreis eines Artikels für einen Profi mit gegebener Kondition. */
export function ekPreis(artikel: KatalogArtikel, aufschlagStufe = 0): number {
  const rabatt = (RABATTGRUPPEN[artikel.rabattgruppe] ?? 0) + aufschlagStufe;
  return artikel.preisVE * (1 - Math.min(rabatt, 0.45));
}

export function findeArtikel(bestellnummer: string): KatalogArtikel | undefined {
  const gesucht = bestellnummer.trim();
  return katalogArtikel.find((a) => a.bestellnummer === gesucht);
}
