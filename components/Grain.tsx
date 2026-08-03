/**
 * Feine Filmkorn-Textur über der gesamten Seite.
 *
 * Bewusst OHNE mix-blend-mode: eine bildschirmfüllende Fläche mit Blendmodus
 * zwingt den Compositor, bei jedem Scroll-Frame den Hintergrund darunter neu
 * einzulesen. Gemessen hat das die Bildrate halbiert (33 ms statt 17 ms pro
 * Frame, 95 % Ruckler). Mit normaler Deckkraft ist die Fläche eine statische
 * eigene Ebene, die nie neu gezeichnet wird — optisch fast identisch, im
 * Scrollverhalten gratis.
 *
 * translateZ(0) und contain isolieren die Ebene zusätzlich.
 */
export function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] opacity-[0.045]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        transform: 'translateZ(0)',
        contain: 'strict',
      }}
    />
  );
}
