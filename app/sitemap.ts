import type { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/site';
import { products } from '@/lib/data';

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
  return [
    ...routen.map((r) => ({
      url: `${BASE_URL}${r}`,
      changeFrequency: 'weekly' as const,
      priority: r === '' ? 1 : 0.7,
    })),
    ...products.map((p) => ({
      url: `${BASE_URL}/produkte/${p.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
  ];
}
