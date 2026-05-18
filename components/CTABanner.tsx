import Link from 'next/link';
import { Eyebrow } from '@/components/Eyebrow';
import { Button } from '@/components/ui/button';

export function CTABanner() {
  return (
    <section className="bg-linen border-y border-mist py-24 md:py-32">
      <div className="container grid lg:grid-cols-12 gap-10 items-end">
        <div className="lg:col-span-7">
          <Eyebrow number="VIII">Handwerk</Eyebrow>
          <h2 className="h-display text-4xl md:text-6xl mt-6 text-balance">
            Bist du <em className="italic">GaLaBauer</em>, Installateur, Planer?
          </h2>
          <p className="text-ink/70 max-w-xl mt-6">
            Wir führen GaLaBau-Betriebe als gleichberechtigte Partner — mit
            Netto-Konditionen, Mengenrabatt, Rechnungskauf und Werkstattgesprächen.
          </p>
        </div>
        <div className="lg:col-span-5 flex flex-wrap gap-4 justify-start lg:justify-end">
          <Button asChild variant="primary" size="lg">
            <Link href="/handwerk">Werkstattgespräch beantragen →</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/handwerk#mengenrabatt">Konditionen</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
