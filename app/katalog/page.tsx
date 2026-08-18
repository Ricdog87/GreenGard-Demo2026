import Link from 'next/link';
import { Eyebrow } from '@/components/Eyebrow';
import { Button } from '@/components/ui/button';
import { EPaperKatalog } from '@/components/katalog/EPaperKatalog';

/**
 * Katalog — nur noch Blättern und Herunterladen.
 *
 * Beschluss aus dem Meeting mit Jan Leifermann (12.08.2026): Der Katalogbereich
 * wird auf die reine Download-/Blätterfunktion reduziert. Artikeldaten und
 * Preise leben ausschließlich im Webshop — die frühere Doppelseiten-Ansicht
 * mit 31 Artikeln und Preisen ist deshalb raus.
 */

export const metadata = {
  title: 'Katalog · Green-Gard',
  description:
    'Der Green-Gard Katalog zum Durchblättern und Herunterladen. Der neue Shop für Preise und Bestellung folgt in Kürze.',
};

export default function KatalogPage() {
  return (
    <>
      <section className="border-b border-mist bg-paper">
        <div className="container py-24 md:py-36">
          <Eyebrow number="K">Katalog</Eyebrow>
          <h1 className="hero-h mt-8 max-w-[14ch]">
            Zum Blättern. <em className="italic">Zum Mitnehmen.</em>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink/70">
            Hier finden Sie den kompletten Katalog als Blätterausgabe. Tagesaktuelle Preise
            und Bestellung übernimmt künftig unser neuer Shop — er ist bald verfügbar.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            {/* Der neue Shop ist noch nicht live — Button bewusst ohne Link (18.08.2026). */}
            <Button variant="accent" size="lg" disabled title="Der neue Green-Gard Shop ist bald verfügbar">
              Shop — bald verfügbar
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/produkte">Sortiment im Überblick</Link>
            </Button>
          </div>
        </div>
      </section>

      <EPaperKatalog />
    </>
  );
}
