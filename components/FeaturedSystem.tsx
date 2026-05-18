import Image from 'next/image';
import Link from 'next/link';
import { Eyebrow } from '@/components/Eyebrow';
import { Button } from '@/components/ui/button';

export function FeaturedSystem() {
  return (
    <section className="bg-forest text-linen">
      <div className="container py-24 md:py-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 relative">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/img/lifestyle/kress-mower.svg"
              alt="Kress KR136E Mähroboter"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              data-cursor="view"
            />
          </div>
        </div>
        <div className="lg:col-span-5">
          <Eyebrow number="V" className="text-linen/70 [&>span:first-child]:bg-linen/30">Featured System</Eyebrow>
          <h2 className="h-display text-5xl md:text-6xl mt-6">
            Autonome <em className="italic">Hingabe</em>.
          </h2>
          <p className="text-linen/70 mt-6 max-w-md leading-relaxed">
            Der Kress KR136E mäht zentimetergenau und ohne Begrenzungsdraht. RTK-Satellitennavigation,
            53 dB Geräusch, mehr Komposition als Maschine.
          </p>

          <pre className="font-mono text-[12px] tracking-[0.08em] uppercase text-linen/85 mt-10 leading-7 whitespace-pre-wrap">
{`Kress · KR136E
─────────────────────
Autonomie    1.500 m²
Steigung     45 %
Geräusch     53 dB
Steuerung    RTK-GNSS
Preis        ab 2.890 €`}
          </pre>

          <div className="mt-10">
            <Button asChild variant="accent" size="lg">
              <Link href="/kollektion/kress-kr136e">In Mappe legen →</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
