import type { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/site';

/**
 * Bewusst OHNE Disallow für /pflanzenkoelle: ein Eintrag in der robots.txt
 * würde die vertrauliche URL gerade veröffentlichen. Die Seite trägt
 * noindex/nofollow im Meta — das ist der richtige Mechanismus. Gleiches gilt
 * für /konto (noindex) und /checkout.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
