import { BeratungBooking } from './BeratungBooking';
import { Schulungen } from './Schulungen';

export const metadata = {
  title: 'Beratung & Schulungen · Green-Gard',
  description:
    'Kostenlose Systemplanung vereinbaren und Schulungen für GaLaBau, Installateure und Planungsbüros buchen.',
};

export default function BeratungPage() {
  return (
    <>
      <BeratungBooking />
      <Schulungen />
    </>
  );
}
