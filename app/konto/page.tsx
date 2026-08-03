import { KontoDashboard } from './KontoDashboard';

export const metadata = {
  title: 'Mein Konto · Green-Gard',
  description:
    'Profi-Bereich: Einkaufspreise, Bestellhistorie, Schnellbestellung über Bestellnummern, Projekte und hinterlegte Planungen.',
  // Persönlicher Bereich — gehört nicht in den Index.
  robots: { index: false, follow: false },
};

export default function KontoPage() {
  return <KontoDashboard />;
}
