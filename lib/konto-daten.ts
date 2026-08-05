// Demo-Kontodaten für das Profi-Dashboard.
//
// Solange Supabase nicht verbunden ist, liefert dieses Modul einen realistischen
// Beispielkunden. Struktur und Feldnamen entsprechen dem, was später aus der
// Datenbank kommt — dann wird nur die Quelle getauscht, nicht die Oberfläche.
//
// TODO: gegen Supabase-Abfragen ersetzen (Tabellen: bestellungen, projekte,
// planungen, profiles). Siehe supabase/schema.sql.

export type BestellStatus = 'geliefert' | 'unterwegs' | 'in_bearbeitung';
export type ProjektStatus = 'anfrage' | 'planung' | 'freigegeben' | 'umgesetzt';

export interface BestellPosition {
  bestellnummer: string;
  bezeichnung: string;
  menge: number;
  einzelpreis: number;
}

export interface Bestellung {
  nummer: string;
  datum: string;
  status: BestellStatus;
  projekt?: string;
  positionen: BestellPosition[];
}

export interface Projekt {
  id: string;
  name: string;
  ort: string;
  status: ProjektStatus;
  angelegt: string;
  flaecheQm: number;
  notiz: string;
  /** Verknüpfte Planung, falls vorhanden. */
  planung?: string;
}

export interface Planung {
  id: string;
  name: string;
  erstellt: string;
  quelle: 'IRRISketch' | 'Systemplanung' | 'Upload';
  status: 'in_arbeit' | 'fertig';
  projektId?: string;
}

export interface Profikonto {
  firma: string;
  kundennummer: string;
  ansprechpartner: string;
  /**
   * Vereinbarte Einkaufspreise je Bestellnummer (netto). In der Demo hier, in
   * Produktion aus dem Backend — immer kundenspezifisch, nie als allgemeine
   * Rabatttabelle. Artikel ohne hinterlegten Preis gelten als "auf Anfrage".
   */
  ekPreise: Record<string, number>;
  zahlungsziel: string;
  bestellungen: Bestellung[];
  projekte: Projekt[];
  planungen: Planung[];
}

// Bewusst ein erfundener Betrieb: Namen echter Kunden (etwa aus den
// Bewertungen) dürfen nicht als Demo-Konto auftauchen.
export const DEMO_KONTO: Profikonto = {
  firma: 'Musterbau Garten- und Landschaftsbau GmbH',
  kundennummer: '114029',
  ansprechpartner: 'Demo-Zugang',
  ekPreise: {
    // TODO: aus Supabase je Konto laden (geplante Tabelle: kundenpreise).
    '100000030': 74.59,
    '101000023': 54.27,
    '102000118': 42.36,
  },
  zahlungsziel: '30 Tage netto',
  bestellungen: [
    {
      nummer: 'GG-2026-0412',
      datum: '2026-07-22',
      status: 'unterwegs',
      projekt: 'Villa Sonnenhang',
      positionen: [
        { bestellnummer: '100000030', bezeichnung: 'Tropfrohr 16 mm, 2,2 l/h, 100 m', menge: 4, einzelpreis: 103.59 },
        { bestellnummer: '102000118', bezeichnung: 'Mikroschlauch 3/5 mm, 200 m', menge: 2, einzelpreis: 57.25 },
      ],
    },
    {
      nummer: 'GG-2026-0388',
      datum: '2026-07-09',
      status: 'geliefert',
      projekt: 'Reihenhaus Idstein',
      positionen: [
        { bestellnummer: '101000023', bezeichnung: 'Rain Bird XFD233350, 50 m Rolle', menge: 6, einzelpreis: 75.37 },
      ],
    },
    {
      nummer: 'GG-2026-0351',
      datum: '2026-06-18',
      status: 'geliefert',
      projekt: 'Hofgut Wallau',
      positionen: [
        { bestellnummer: '100000030', bezeichnung: 'Tropfrohr 16 mm, 2,2 l/h, 100 m', menge: 12, einzelpreis: 103.59 },
        { bestellnummer: '102000118', bezeichnung: 'Mikroschlauch 3/5 mm, 200 m', menge: 5, einzelpreis: 57.25 },
      ],
    },
    {
      nummer: 'GG-2026-0307',
      datum: '2026-05-27',
      status: 'geliefert',
      positionen: [
        { bestellnummer: '101000023', bezeichnung: 'Rain Bird XFD233350, 50 m Rolle', menge: 3, einzelpreis: 75.37 },
      ],
    },
    {
      nummer: 'GG-2026-0455',
      datum: '2026-07-30',
      status: 'in_bearbeitung',
      projekt: 'Neubau Taunusstein',
      positionen: [
        { bestellnummer: '100000030', bezeichnung: 'Tropfrohr 16 mm, 2,2 l/h, 100 m', menge: 8, einzelpreis: 103.59 },
      ],
    },
  ],
  projekte: [
    {
      id: 'p-001',
      name: 'Villa Sonnenhang',
      ort: 'Wiesbaden-Sonnenberg',
      status: 'freigegeben',
      angelegt: '2026-07-14',
      flaecheQm: 1150,
      notiz: 'Hanglage, zwei Druckzonen, Zisterne 8 m³. Material ist unterwegs.',
      planung: 'pl-001',
    },
    {
      id: 'p-002',
      name: 'Neubau Taunusstein',
      ort: 'Taunusstein',
      status: 'planung',
      angelegt: '2026-07-28',
      flaecheQm: 640,
      notiz: 'Rasen und Hecke, Hydrawise gewünscht. Wasserwerte liegen vor.',
      planung: 'pl-002',
    },
    {
      id: 'p-003',
      name: 'Hofgut Wallau',
      ort: 'Hofheim-Wallau',
      status: 'umgesetzt',
      angelegt: '2026-05-30',
      flaecheQm: 2400,
      notiz: 'Vier Kreise, Brunnenspeisung. Abnahme erfolgt.',
    },
    {
      id: 'p-004',
      name: 'Gartenanlage Bierstadt',
      ort: 'Wiesbaden-Bierstadt',
      status: 'anfrage',
      angelegt: '2026-08-01',
      flaecheQm: 380,
      notiz: 'Kunde wünscht Angebot bis Ende der Woche.',
    },
  ],
  planungen: [
    {
      id: 'pl-001',
      name: 'Villa Sonnenhang — Bewässerungsschema',
      erstellt: '2026-07-16',
      quelle: 'IRRISketch',
      status: 'fertig',
      projektId: 'p-001',
    },
    {
      id: 'pl-002',
      name: 'Neubau Taunusstein — Zeichnung Kunde',
      erstellt: '2026-07-29',
      quelle: 'IRRISketch',
      status: 'in_arbeit',
      projektId: 'p-002',
    },
    {
      id: 'pl-003',
      name: 'Hofgut Wallau — Hydraulik-Auslegung',
      erstellt: '2026-06-02',
      quelle: 'Systemplanung',
      status: 'fertig',
      projektId: 'p-003',
    },
  ],
};

export const STATUS_LABEL: Record<BestellStatus, string> = {
  geliefert: 'Geliefert',
  unterwegs: 'Unterwegs',
  in_bearbeitung: 'In Bearbeitung',
};

export const PROJEKT_LABEL: Record<ProjektStatus, string> = {
  anfrage: 'Anfrage',
  planung: 'In Planung',
  freigegeben: 'Freigegeben',
  umgesetzt: 'Umgesetzt',
};

/** Vereinbarter Einkaufspreis, falls für dieses Konto hinterlegt. */
export function ekPreisFuer(bestellnummer: string): number | null {
  return DEMO_KONTO.ekPreise[bestellnummer] ?? null;
}

/** Nettowert einer Bestellung. */
export function bestellwert(b: Bestellung): number {
  return b.positionen.reduce((s, p) => s + p.einzelpreis * p.menge, 0);
}
