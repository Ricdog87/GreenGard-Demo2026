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
  phoneDisplay: '+49 6122 95895-30',
  phoneHref: 'tel:+4961229589530',
  email: 'info@green-gard.de',
  website: 'www.green-gard.de',
  hours: 'Mo–Fr · 7:30 – 17:00',
  foundedYear: 2006,
} as const;

export const ADDRESS_LINES = [
  CONTACT.company,
  CONTACT.street,
  `${CONTACT.zip} ${CONTACT.city}`,
] as const;
