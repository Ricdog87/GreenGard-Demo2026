'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getSupabaseClient } from '@/lib/supabase';
import { useCart } from '@/store/cart';
import { cn } from '@/lib/utils';

const schema = z.object({
  email: z.string().email('Bitte gültige E-Mail angeben'),
  password: z.string().min(8, 'Mindestens 8 Zeichen'),
});
type FormValues = z.infer<typeof schema>;

/**
 * Anmeldung — wird sowohl im Entry-Fenster (compact) als auch auf /login
 * verwendet, damit es nur eine Implementierung gibt.
 *
 * TODO: Nach echtem Login das Profil laden (profiles.typ/freigeschaltet) und
 * Zielgruppe + Preisansicht daraus setzen, statt sie im Gate zu erfragen.
 */
export function LoginForm({
  compact = false,
  onSuccess,
  className,
}: {
  compact?: boolean;
  onSuccess?: () => void;
  className?: string;
}) {
    const anmelden = useCart((s) => s.anmelden);
  const [hint, setHint] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    const supabase = getSupabaseClient();
    if (!supabase) {
            // Demo-Pfad: ohne Supabase-Keys gibt es keine echte Prüfung. Wir schalten
      // den Profi-Zugang frei und gehen ins Konto — der Ablauf bleibt zeigbar.
      anmelden();
      onSuccess?.();
      window.location.href = '/konto';
      return;
    }
    const { error } = await supabase.auth.signInWithPassword(values);
    if (error) {
      setHint(error.message);
      return;
    }
        // TODO: Profil laden (profiles.typ/freigeschaltet) und erst dann freischalten.
    anmelden();
    onSuccess?.();
    window.location.href = '/konto';
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn('space-y-4', className)}>
      <div className={cn(compact ? 'grid gap-4 sm:grid-cols-2' : 'space-y-4')}>
        <div>
          <label className="eyebrow mb-2 block" htmlFor={compact ? 'g-email' : 'l-email'}>
            E-Mail
          </label>
          <Input
            id={compact ? 'g-email' : 'l-email'}
            type="email"
            autoComplete="email"
            {...register('email')}
          />
          {errors.email && <p className="mt-1 text-xs text-red-700">{errors.email.message}</p>}
        </div>
        <div>
          <label className="eyebrow mb-2 block" htmlFor={compact ? 'g-password' : 'l-password'}>
            Passwort
          </label>
          <Input
            id={compact ? 'g-password' : 'l-password'}
            type="password"
            autoComplete="current-password"
            {...register('password')}
          />
          {errors.password && <p className="mt-1 text-xs text-red-700">{errors.password.message}</p>}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" variant="primary" size={compact ? 'md' : 'lg'} disabled={isSubmitting}>
          Anmelden
        </Button>
        <a
          href="/profi"
          data-cursor="hover"
          className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/60 hover:text-bronze"
        >
          Profi-Zugang beantragen →
        </a>
      </div>

      {hint && (
        <p className="flex gap-3 border-l-2 border-copper/50 bg-linen/60 py-3 pl-4 text-sm text-ink/75">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-bronze" />
          {hint}
        </p>
      )}
    </form>
  );
}
