import { BeratungBooking } from './BeratungBooking';
import { Schulungen } from './Schulungen';
import { Serviceleistungen } from '@/components/Serviceleistungen';

export const metadata = {
  title: 'Beratung & Schulungen · Green-Gard',
  description:
    'Beratungstermin vereinbaren, Serviceleistungen im Überblick und Fachschulungen für GaLaBau, Installateure und Planungsbüros.',
};

export default function BeratungPage() {
  return (
    <>
      <BeratungBooking />
      <Serviceleistungen />
      <Schulungen />
    </>
  );
}
