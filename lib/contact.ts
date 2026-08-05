// Zentrale Kontaktdaten — site-weit die einzige Quelle.
// Kundenwunsch: KEINE direkten Durchwahlen, nur die zentrale Nummer mit
// Endung -30. Persönliche Team-E-Mails bleiben (siehe data/team.json).
//
// Daten aus der Signatur von Jan Leifermann (Mail vom 30.07.2026):
// Green Gard GmbH, Max-Planck-Ring 11, 65205 Wiesbaden, +49 6122 95895-xx.
// Jans Durchwahl ist -34, deshalb steht hier die Zentrale auf -30.
// Bestätigt über green-gard.de (Stand 03.08.2026): 06122 95895-30 ist die
// Sammelnummer, erreichbar Mo–Fr 7:30–17:00 Uhr.

export const CONTACT = {
  /** Firmierung wie in der Signatur; die Wortmarke bleibt GREEN-GARD. */
  company: 'Green Gard GmbH',
  street: 'Max-Planck-Ring 11',
  zip: '65205',
  city: 'Wiesbaden',
  /** Ortsteil laut Stellenausschreibung auf green-gard.de. */
  district: 'Wiesbaden-Delkenheim',
  phoneDisplay: '+49 6122 95895-30',
  phoneHref: 'tel:+4961229589530',
  email: 'info@green-gard.de',
  website: 'www.green-gard.de',
  /** Telefonische Erreichbarkeit. */
  hours: 'Mo–Fr · 7:30 – 17:00',
  foundedYear: 2006,
} as const;

/**
 * Öffnungs-, Liefer- und Zahlungsregeln — Stand green-gard.de (03.08.2026).
 * Der Lagerverkauf hat andere Zeiten als die Telefonzentrale; das stand vorher
 * nirgends auf der neuen Seite und ist für Abholer die wichtigste Information.
 */
export const OEFFNUNG = {
  telefon: 'Mo – Fr · 7:30 – 17:00 Uhr',
  lager: 'Mo – Fr · 8:00 – 16:30 Uhr',
  samstag: 'Sa · 8:00 – 12:00 Uhr (Hauptsaison Mai – September)',
  anfahrt: 'Parkplätze direkt vor dem Gebäude.',
} as const;

export const LIEFERUNG = {
  lagerware: '1 – 3 Werktage',
  wege: 'Paketdienst oder Direktfahrt im Umkreis von Wiesbaden — auch auf die Baustelle.',
  abholung: 'Abholung im Lagerverkauf, Mo – Fr 8:00 – 16:30 Uhr.',
  /**
   * Zahlungsregel laut Learning Center: erste Bestellung per Vorkasse bzw. bar
   * oder Karte bei Abholung, danach ist Kauf auf Rechnung möglich.
   */
  zahlung: 'Erste Bestellung per Vorkasse, bei Abholung bar oder Karte. Danach ist Kauf auf Rechnung möglich.',
} as const;

/**
 * Green Gard ist ein reines Vertriebs- und Handelshaus und hat keine eigenen
 * Monteure — steht so im Learning Center. Die Seite darf deshalb nirgends
 * versprechen, dass wir selbst einbauen; wir vermitteln Fachbetriebe.
 */
export const AUSFUEHRUNG = {
  hinweis: 'Green Gard ist Vertriebs- und Handelshaus — wir bauen nicht selbst ein.',
  vermittlung: 'Auf Wunsch vermitteln wir einen Fachbetrieb aus unserem Netzwerk.',
} as const;

export const ADDRESS_LINES = [
  CONTACT.company,
  CONTACT.street,
  `${CONTACT.zip} ${CONTACT.city}`,
] as const;
