import type { Metadata } from 'next';
import { Fraunces, Inter_Tight, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { GiessBert } from '@/components/assistent/GiessBert';
import { Toaster } from '@/components/ui/toast';
import { SmoothScroll } from '@/components/SmoothScroll';
import { ScrollFx } from '@/components/ScrollFx';
import { Grain } from '@/components/Grain';
import { Cursor } from '@/components/Cursor';
import { EntryExperience } from '@/components/EntryExperience';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  axes: ['SOFT', 'WONK', 'opsz'],
});

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Green-Gard · Gartentechnik aus Wiesbaden',
  // Green Gard ist Handelshaus ohne eigene Monteure — die Seite darf nirgends
  // versprechen, dass wir selbst einbauen (Learning Center, siehe lib/contact.ts).
  description:
    'Das Upgrade für Ihren Garten: smarte Bewässerung, Gartenbeleuchtung, Mähroboter und Poolpflege. Geplant, geliefert und auf Wunsch durch einen Fachbetrieb aus unserem Netzwerk umgesetzt — seit 2006 aus Wiesbaden.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${fraunces.variable} ${interTight.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-paper text-ink antialiased">
        <SmoothScroll />
        <ScrollFx />
        <Grain />
        <Cursor />
        <EntryExperience />
        <Header />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
        <GiessBert />
        <Toaster />
      </body>
    </html>
  );
}
