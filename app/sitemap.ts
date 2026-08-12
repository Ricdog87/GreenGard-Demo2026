import type { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/site';

/**
 * Nur öffentliche Seiten. Bewusst NICHT enthalten:
 * /pflanzenkoelle (vertraulich, noindex), /konto und /login (persönlich),
 * /checkout (Prozessseite).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routen = [
    '',
    '/produkte',
    '/starter-kits',
    '/planung',
    '/beratung',
    '/learning-center',
    '/katalog',
    '/warum-green-gard',
    '/rainworks',
    '/profi',
  ];
  // Meeting 12.08.2026: keine Produkt-Detailseiten mehr — Artikel lebt im Shop.
  return routen.map((r) => ({
    url: `${BASE_URL}${r}`,
    changeFrequency: 'weekly' as const,
    priority: r === '' ? 1 : 0.7,
  }));
}
