'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Info } from 'lucide-react';
import { Eyebrow } from '@/components/Eyebrow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';
import { CONTACT } from '@/lib/contact';

const schema = z.object({
  email: z.string().email('Bitte gültige E-Mail angeben'),
  password: z.string().min(8, 'Mindestens 8 Zeichen'),
});
type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const [status, setStatus] = useState<'idle' | 'mocked' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    const supabase = getSupabaseClient();
    if (!supabase) {
      // TODO: Supabase-Projekt anlegen, env vars setzen, RLS aktivieren.
      setStatus('mocked');
      setMessage(
        'Demo-Modus: Es ist noch kein Supabase-Projekt verbunden, deshalb findet keine echte Anmeldung statt.'
      );
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (error) {
      setStatus('error');
      setMessage(error.message);
      return;
    }
    // TODO: nach erfolgreichem Login Profil laden (profiles.typ) und die
    // Preisansicht automatisch auf "profi" stellen, sofern freigeschaltet.
    window.location.href = '/produkte';
  }

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

      <form onSubmit={handleSubmit(onSubmit)} className="mt-12 space-y-6">
        <div>
          <label className="eyebrow mb-2 block" htmlFor="l-email">
            E-Mail
          </label>
          <Input id="l-email" type="email" autoComplete="email" {...register('email')} />
          {errors.email && <p className="mt-1 text-xs text-red-700">{errors.email.message}</p>}
        </div>
        <div>
          <label className="eyebrow mb-2 block" htmlFor="l-password">
            Passwort
          </label>
          <Input
            id="l-password"
            type="password"
            autoComplete="current-password"
            {...register('password')}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-700">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isSubmitting}>
          Anmelden
        </Button>

        {status !== 'idle' && (
          <p className="flex gap-3 border-l-2 border-copper/50 bg-linen/60 py-3 pl-4 text-sm text-ink/75">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-bronze" />
            {message}
          </p>
        )}
      </form>

      <div className="mt-10 space-y-3 border-t border-mist pt-6 text-sm">
        <p>
          <Link
            href="/profi"
            data-cursor="hover"
            className="border-b border-mist hover:border-ink"
          >
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
