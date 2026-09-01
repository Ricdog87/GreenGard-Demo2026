import Link from 'next/link';
import { Eyebrow } from '@/components/Eyebrow';
import { Button } from '@/components/ui/button';

/** Einstieg in den Profi-Bereich — /profi steht bewusst nicht in der Hauptnav. */
export function CTABanner() {
  return (
    <section className="border-y border-mist bg-linen py-24 md:py-32">
      <div data-reveal-group className="container grid items-end gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Eyebrow number="08">Profi</Eyebrow>
          <h2 className="h-display mt-6 text-balance text-4xl md:text-6xl">
            Sie sind <em className="italic">GaLaBauer</em>, Architekt oder Fachhändler?
          </h2>
          <p className="mt-6 max-w-xl text-ink/70">
                        Nettopreise, Rechnungskauf und Schulungen im eigenen Betrieb. Ihre
            Konditionen stimmen wir persönlich mit Ihnen ab — sprechen Sie uns an.
          </p>
        </div>
        <div className="flex flex-wrap justify-start gap-4 lg:col-span-5 lg:justify-end">
          <Button asChild variant="primary" size="lg">
            <Link href="/profi">Konditionen anfragen →</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/beratung#schulungen">Schulungen</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
