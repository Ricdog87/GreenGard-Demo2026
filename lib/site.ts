/**
 * Absolute Basis-URL der Seite — für robots.txt, sitemap.xml und
 * Open-Graph-Pfade.
 *
 * Seit dem Go-Live am 03.09.2026 ist www.green-gard.de die feste Adresse —
 * bewusst als Standard im Code, damit Sitemap und robots.txt nicht von einer
 * Vercel-Variable abhängen. NEXT_PUBLIC_SITE_URL kann sie weiterhin
 * überschreiben (z. B. für eine Staging-Umgebung).
 */
export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.green-gard.de';
