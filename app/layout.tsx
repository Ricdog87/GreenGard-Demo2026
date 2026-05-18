import type { Metadata } from 'next';
import { Fraunces, Inter_Tight, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { Toaster } from '@/components/ui/toast';
import { SmoothScroll } from '@/components/SmoothScroll';
import { Grain } from '@/components/Grain';
import { Cursor } from '@/components/Cursor';
import { Loader } from '@/components/Loader';

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
  title: 'Green-Gard · Smart Garden Atelier · Wiesbaden',
  description:
    'Smart Irrigation, Engineered Lighting, Autonomous Mowing. Premium Gartentechnik aus Wiesbaden — geplant, geliefert, installiert.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${fraunces.variable} ${interTight.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-paper text-ink antialiased">
        <SmoothScroll />
        <Grain />
        <Cursor />
        <Loader />
        <Header />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
        <Toaster />
      </body>
    </html>
  );
}
