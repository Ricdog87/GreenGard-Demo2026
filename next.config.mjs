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
      // ── Alte Website (green-gard.de bis 09/2026) → neue Routen ──────────
      // Nach dem Domain-Umzug antwortet der alte Server nicht mehr, also
      // müssen die Google-Treffer hier landen. Quelle: alte sitemap.xml.
      { source: '/learningcenter', destination: '/learning-center', permanent: true },
      { source: '/bloguebersicht', destination: '/learning-center', permanent: true },
      { source: '/team', destination: '/warum-green-gard', permanent: true },
      { source: '/karriere', destination: '/warum-green-gard', permanent: true },
      { source: '/stellenmarkt', destination: '/warum-green-gard', permanent: true },
      { source: '/planungstool', destination: '/planung', permanent: true },
      { source: '/training', destination: '/beratung', permanent: true },
      { source: '/fachschulung-:rest*', destination: '/beratung', permanent: true },
      { source: '/service', destination: '/beratung', permanent: true },
      { source: '/kontakt', destination: '/beratung', permanent: true },
      { source: '/reklamation', destination: '/beratung', permanent: true },
      { source: '/galabauer-installateure', destination: '/profi', permanent: true },
      { source: '/privatkunden', destination: '/', permanent: true },
      { source: '/bewaesserung', destination: '/produkte#bewaesserung', permanent: true },
      { source: '/steuerung', destination: '/produkte#steuerung', permanent: true },
      { source: '/pumpentechnik', destination: '/produkte#pumpentechnik', permanent: true },
      { source: '/beleuchtung', destination: '/produkte#beleuchtung', permanent: true },
      { source: '/maehroboter', destination: '/produkte#maehroboter', permanent: true },
      { source: '/pool', destination: '/produkte#pool', permanent: true },
      { source: '/zubehoer', destination: '/produkte#zubehoer', permanent: true },
      { source: '/hunter', destination: '/produkte', permanent: true },
      { source: '/rainbird', destination: '/produkte', permanent: true },
      { source: '/inlite', destination: '/produkte', permanent: true },
      { source: '/kress', destination: '/produkte', permanent: true },
    ];
  },
};

export default nextConfig;
