// Zentrale Kontaktdaten — site-weit die einzige Quelle.
// Kundenwunsch: KEINE direkten Durchwahlen mehr, nur die zentrale Nummer mit
// Endung -30. Persönliche Team-E-Mails bleiben (siehe data/team.json).

// TODO: echte Rufnummer vom Kunden einsetzen (Platzhalter-Block XXX XX).
export const CONTACT = {
  company: 'Green-Gard GmbH',
  street: 'Mainzer Straße 142',
  zip: '65189',
  city: 'Wiesbaden',
  phoneDisplay: '+49 (0) 611 XXX XX-30',
  phoneHref: 'tel:+49611XXXXX30',
  email: 'info@green-gard.de',
  hours: 'Mo–Fr · 8:00 – 17:00',
  foundedYear: 2006,
} as const;

export const ADDRESS_LINES = [
  CONTACT.company,
  CONTACT.street,
  `${CONTACT.zip} ${CONTACT.city}`,
] as const;
