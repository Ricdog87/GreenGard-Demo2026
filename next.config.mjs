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
      { source: '/systeme', destination: '/planung', permanent: true },
      { source: '/atelier', destination: '/beratung', permanent: true },
      { source: '/manifest', destination: '/warum-green-gard', permanent: true },
      { source: '/handwerk', destination: '/profi', permanent: true },
      // Meeting 12.08.2026: Produktdetails leben im Shop — alte Detail-Links
      // landen auf der Sortiment-Übersicht.
      { source: '/produkte/:slug', destination: '/produkte', permanent: true },
      // Routen aus der allerersten Fassung (vor dem Editorial-Refactor)
      { source: '/shop', destination: '/produkte', permanent: true },
      { source: '/shop/:slug', destination: '/produkte', permanent: true },
      { source: '/pakete', destination: '/planung', permanent: true },
      // Starter Kits komplett entfernt (Kundenwunsch 18.08.2026) — alte
      // Links landen in der Planung.
      { source: '/starter-kits', destination: '/planung', permanent: true },
      // Login/Konto entfernt (18.08.2026) — Profis stellen die
      // Konditions-Anfrage auf /profi.
      { source: '/login', destination: '/profi', permanent: true },
      { source: '/konto', destination: '/profi', permanent: true },
      { source: '/konfigurator', destination: '/planung', permanent: true },
      { source: '/b2b', destination: '/profi', permanent: true },
    ];
  },
};

export default nextConfig;
