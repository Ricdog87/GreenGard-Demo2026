import { Suspense } from 'react';
import { ProduktKatalog } from './ProduktKatalog';
import { Eyebrow } from '@/components/Eyebrow';

export const metadata = {
  title: 'Produkte · Green-Gard',
  description:
    'Bewässerung, Steuerung, Pumpentechnik, Beleuchtung, Robotik, Pool und Zubehör — tagesaktuelle Preise, Lieferung in 1–3 Werktagen.',
};

/** Skeleton statt Spinner, solange der Katalog (Client) lädt. */
function KatalogSkeleton() {
  return (
    <div className="container py-12 md:py-20">
      <Eyebrow number="A">Produkte</Eyebrow>
      <div className="mt-6 h-16 w-2/3 animate-pulse bg-linen" />
      <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-square animate-pulse bg-linen" />
            <div className="mt-4 h-4 w-1/3 animate-pulse bg-linen" />
            <div className="mt-2 h-5 w-2/3 animate-pulse bg-linen" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProduktePage() {
  // Der Katalog liest den ?cat=-Parameter, deshalb Suspense-Grenze.
  return (
    <Suspense fallback={<KatalogSkeleton />}>
      <ProduktKatalog />
    </Suspense>
  );
}
