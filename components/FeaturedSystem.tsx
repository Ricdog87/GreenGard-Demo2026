import Image from 'next/image';
import Link from 'next/link';
import { Eyebrow } from '@/components/Eyebrow';
import { Button } from '@/components/ui/button';

export function FeaturedSystem() {
  return (
    <section className="bg-forest text-linen">
      <div className="container grid grid-cols-1 items-center gap-12 py-24 md:py-32 lg:grid-cols-12">
        <div className="relative lg:col-span-7">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/img/kits/maehroboter-kit.svg"
              alt="Kress KR136E Mähroboter auf gemähter Rasenfläche"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              data-parallax="6"
              className="object-cover"
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
            Der Kress KR136E arbeitet mit RTK-Satellitennavigation zentimetergenau — ganz ohne Begrenzungsdraht. Mit 53 dB ist er leiser als ein Gespräch. Sie merken nur eines: Der Rasen ist immer gemacht.
          </p>

          {/* Technische Zahlen bleiben Mono, Preise laufen in Fraunces. */}
          <pre className="font-mono mt-10 whitespace-pre-wrap text-[12px] uppercase leading-7 tracking-[0.08em] text-linen/85">
{`Kress · KR136E
─────────────────────
Autonomie    1.500 m²
Steigung     45 %
Geräusch     53 dB
Steuerung    RTK-GNSS`}
          </pre>
          <p className="mt-2">
            <span className="font-mono text-[12px] uppercase tracking-[0.08em] text-linen/85">
              Preis&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
            <span className="price text-lg">ab 1.290 €</span>
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild variant="accent" size="lg">
              <Link href="/produkte/kress-kr136e">Produkt ansehen →</Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="text-linen hover:bg-linen/10">
              <Link href="/starter-kits#maehroboter-kit">Mähroboter Kit</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
