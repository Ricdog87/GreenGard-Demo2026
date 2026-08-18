// Externe Ziele an einer Stelle.
//
// Ergebnis des Kundentermins vom 31.07.2026: Die Website verkauft keine Produkte
// mehr. Sie erklärt, plant und schult — verkauft wird im bestehenden Shop. Damit
// gibt es genau drei externe Systeme, die hier gebündelt werden.

/**
 * IRRISketch Design Studio — Kunden zeichnen ihren Garten selbst ein, Green-Gard
 * legt anschließend nur noch die Bewässerung darüber. Spart rund 30 % Planungs-
 * aufwand, Planung liegt in 24–48 Stunden vor.
 *
 * Der Link startet immer ein neues Projekt; eine API gibt es nicht, er wird
 * schlicht hinter dem Button verlinkt. Geht eine Zeichnung ein, benachrichtigt
 * IRRISketch Green-Gard automatisch per Mail.
 */
export const IRRISKETCH_URL =
  'https://irrisketch.com/workshop/design?link=YWEyNzQ3NGQyMDc3MWYyM2E0YTQwYmI3OGQ0MjMwODcwOWM3NTkxYjdjNzM5Yjk5YWVhMThiYzVjNTA2NiUmISokXzI0';

/**
 * Preiskatalog 2025-26 als Blätterkatalog (1000° E-Paper). Wird eingebettet statt
 * als PDF ausgeliefert: die Originaldatei wiegt rund 14 MB und würde die Seite bei
 * schwacher Verbindung ausbremsen.
 */
export const KATALOG_EPAPER_URL = 'https://dbma.1kcloud.com/ep161f99b00442a3/';

/**
 * Neuer Online-Shop — wird parallel zur Website gebaut und ist noch nicht live.
 *
 * Beschluss aus dem Meeting vom 18.08.2026: Bis zum Start gibt es KEINE
 * Shop-Links auf der Website. Alle Shop-Buttons stehen deaktiviert auf
 * „Bald verfügbar“ — das signalisiert aktive Entwicklung statt ins Leere zu
 * führen. Sobald der Shop live ist: echte Adresse hier eintragen und die
 * deaktivierten Buttons wieder verlinken (die Suche nach „bald verfügbar“
 * findet alle Stellen).
 */
export const SHOP_URL = 'https://www.green-gard.de';

/** YouTube-Kanal mit den Erklärvideos fürs Learning Center. */
export const YOUTUBE_URL = 'https://www.youtube.com/@green-gard';

/** Social Media — im Termin als sinnvoll bestätigt. */
// Echte Profile aus dem Footer von green-gard.de (12.08.2026) — die vorherigen
// Handles waren geraten und führten ins Leere.
export const SOCIAL = {
  instagram: 'https://www.instagram.com/green_gard.gmbh/',
  linkedin: 'https://www.linkedin.com/company/36716186/',
  facebook: 'https://www.facebook.com/profile.php?id=100090187459046',
  youtube: 'https://www.youtube.com/@green-gardgmbh7663',
} as const;
