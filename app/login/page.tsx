import Link from 'next/link';
import { Eyebrow } from '@/components/Eyebrow';
import { LoginForm } from '@/components/LoginForm';
import { isSupabaseConfigured } from '@/lib/supabase';
import { CONTACT } from '@/lib/contact';

export const metadata = {
  title: 'Anmelden · Green-Gard',
  description: 'Profi-Zugang für GaLaBau, Architekten und Fachhandel: Nettopreise, Bestellhistorie, offene Rechnungen.',
};

export default function LoginPage() {
  return (
    <div className="container max-w-md py-24 md:py-40">
      <Eyebrow number="L">Konto</Eyebrow>
      <h1 className="h-display mt-6 text-5xl md:text-6xl">
        <em className="italic">Anmelden</em>.
      </h1>
      <p className="mt-6 text-ink/70">
        Für Profi-Kunden mit freigeschaltetem Zugang: Nettopreise, Bestellhistorie und
        offene Rechnungen an einem Ort.
      </p>

      <LoginForm className="mt-12" />

      <div className="mt-10 space-y-3 border-t border-mist pt-6 text-sm">
        <p>
          <Link href="/profi" data-cursor="hover" className="border-b border-mist hover:border-ink">
            Profi-Zugang beantragen →
          </Link>
        </p>
        <p className="text-ink/60">
          Fragen zum Zugang? Rufen Sie an:{' '}
          <a href={CONTACT.phoneHref} className="num border-b border-mist hover:border-ink">
            {CONTACT.phoneDisplay}
          </a>
        </p>
      </div>

      {!isSupabaseConfigured && (
        <p className="font-mono mt-10 text-[10px] uppercase leading-relaxed tracking-[0.16em] text-ink/45">
          Hinweis für die Demo: Auth ist vorbereitet, aber noch nicht verbunden —
          siehe supabase/schema.sql und .env.example
        </p>
      )}
    </div>
  );
}
