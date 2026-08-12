/**
 * Absolute Basis-URL der Seite — für robots.txt, sitemap.xml und
 * Open-Graph-Pfade. Vercel setzt VERCEL_PROJECT_PRODUCTION_URL automatisch;
 * für den Livegang auf der eigenen Domain genügt NEXT_PUBLIC_SITE_URL.
 */
export const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://green-gard-demo2026.vercel.app');
