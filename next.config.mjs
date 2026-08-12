/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    // Wir liefern die Disziplinen-/Produkt-Illustrationen als lokale SVGs aus.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async redirects() {
    // V2-Umbenennung: alte Routen dauerhaft auf die neuen Begriffe umleiten.
    return [
      { source: '/kollektion', destination: '/produkte', permanent: true },
      { source: '/kollektion/:slug', destination: '/produkte', permanent: true },
      { source: '/systeme', destination: '/starter-kits', permanent: true },
      { source: '/atelier', destination: '/beratung', permanent: true },
      { source: '/manifest', destination: '/warum-green-gard', permanent: true },
      { source: '/handwerk', destination: '/profi', permanent: true },
      // Meeting 12.08.2026: Produktdetails leben im Shop — alte Detail-Links
      // landen auf der Sortiment-Übersicht.
      { source: '/produkte/:slug', destination: '/produkte', permanent: true },
      // Routen aus der allerersten Fassung (vor dem Editorial-Refactor)
      { source: '/shop', destination: '/produkte', permanent: true },
      { source: '/shop/:slug', destination: '/produkte', permanent: true },
      { source: '/pakete', destination: '/starter-kits', permanent: true },
      { source: '/konfigurator', destination: '/planung', permanent: true },
      { source: '/b2b', destination: '/profi', permanent: true },
    ];
  },
};

export default nextConfig;
