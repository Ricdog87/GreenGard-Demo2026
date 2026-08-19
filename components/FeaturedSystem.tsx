import Image from 'next/image';
import Link from 'next/link';
import { Eyebrow } from '@/components/Eyebrow';
import { Button } from '@/components/ui/button';

/**
 * Featured-Mäher der Landing. Seit 18.08.2026 (Kundenfeedback) der Husqvarna
 * Automower 405VE NERA mit echtem Produktfoto — vorher stand hier der Kress
 * KR136E mit Illustration. Die Flächenleistung 900 / 600 m² ist Kundenvorgabe
 * und bleibt exakt so.
 *
 * TODO: Steigung/Geräusch mit Jan verifizieren (aus der offiziellen
 * Husqvarna-Produktseite übernommen).
 */
export function FeaturedSystem() {
  return (
    <section className="bg-forest text-linen">
      <div className="container grid grid-cols-1 items-center gap-12 py-24 md:py-32 lg:grid-cols-12">
        <div className="relative lg:col-span-7">
          {/* Echter Freisteller (transparente PNG-Basis): object-contain plus
              weicher Bodenschatten, damit das helle Gerät auf dem dunklen
              Grund sauber freisteht — nichts wird beschnitten. */}
          <div className="relative aspect-[4/3] p-4 md:p-10">
            {/* Bewusst OHNE Parallax: der drop-shadow-Filter würde sonst bei
                jedem Scroll-Frame neu gerastert — das kostet Bildrate. */}
            <Image
              src="/products/husqvarna-405ve-nera.webp"
              alt="Husqvarna Automower 405VE NERA Mähroboter"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain drop-shadow-[0_28px_36px_rgba(0,0,0,0.35)]"
              data-cursor="view"
            />
          </div>
        </div>
        <div data-reveal-group className="lg:col-span-5">
          <Eyebrow number="V" className="text-linen/70 [&>span:first-child]:bg-linen/30">
            Im Fokus
          </Eyebrow>
          <h2 className="h-display mt-6 text-5xl md:text-6xl">
            Ihr Rasen mäht sich <em className="italic">selbst</em>.
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-linen/70">
            Der Husqvarna Automower 405VE NERA mäht systematisch und nahezu lautlos — vorbereitet
            für virtuelle Grenzen ganz ohne Begrenzungsdraht. Sie merken nur eines: Der Rasen ist
            immer gemacht.
          </p>

          {/* Technische Zahlen bleiben Mono. 900/600 m² exakt so — Kundenvorgabe. */}
          <pre className="font-mono mt-10 whitespace-pre-wrap text-[12px] uppercase leading-7 tracking-[0.08em] text-linen/85">
{`Husqvarna · Automower 405VE NERA
─────────────────────
Flächenleistung   900 / 600 m²
Steigung          40 %
Geräusch          ca. 56 dB
Navigation        EPOS-fähig (virtuelle Grenzen)`}
          </pre>
          {/* Kein Preis — Preise pflegt allein der Shop (Meeting 12.08.2026). */}
          <p className="mt-2">
            <span className="font-mono text-[12px] uppercase tracking-[0.08em] text-linen/85">
              Preis&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
            <span className="font-mono text-[12px] uppercase tracking-[0.08em] text-linen/60">bald im Shop</span>
          </p>

          {/* „Mähroboter Kit“ entfernt — Starter Kits sind seit 18.08.2026 komplett raus. */}
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild variant="accent" size="lg">
              <Link href="/produkte#maehroboter">Zur Robotik →</Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="text-linen hover:bg-linen/10">
              <Link href="/beratung">Beraten lassen</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
