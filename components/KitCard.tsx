'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { oeffneAnfrage } from '@/lib/anfrage';
import { AnfrageFallback } from '@/components/AnfrageFallback';
import type { StarterKit } from '@/lib/data';

/**
 * Starter Kits sind Richtwerte, keine SKUs — deshalb bewusst KEIN
 * "In den Warenkorb". Der Weg führt in die Planung oder in eine Anfrage.
 */
export function KitCard({ kit, showIdeal = false }: { kit: StarterKit; showIdeal?: boolean }) {
  const [askOpen, setAskOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');
  const [mailtoUrl, setMailtoUrl] = useState('');

  const dark = Boolean(kit.highlight);

  return (
    <>
      <article
        id={kit.slug}
        className={cn(
          'flex flex-col p-8 lg:p-10',
          dark ? 'bg-forest text-linen' : 'border border-mist bg-paper text-ink'
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <span
            className={cn(
              'font-mono text-[11px] uppercase tracking-[0.18em]',
              dark ? 'text-linen/60' : 'text-moss'
            )}
          >
            Kit {kit.roman}
          </span>
          {dark && <Badge variant="bronze">Beliebt</Badge>}
        </div>

        <h3 className="font-display mt-4 text-3xl tracking-tight md:text-4xl">{kit.name}</h3>
        <p className={cn('mt-2 italic', dark ? 'text-linen/70' : 'text-moss')}>{kit.tagline}</p>

        <div className="relative mb-6 mt-8 aspect-[4/3] overflow-hidden">
          <Image
            src={kit.image}
            alt={kit.name}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover"
          />
        </div>

        {showIdeal && (
          <p className={cn('mb-6 text-sm', dark ? 'text-linen/70' : 'text-ink/70')}>
            Ideal für: {kit.ideal}
          </p>
        )}

        <ul className={cn('flex-1 space-y-3 text-sm', dark ? 'text-linen/85' : 'text-ink/80')}>
          {kit.components.map((c) => (
            <li key={c} className="flex gap-3">
              <Check className={cn('mt-0.5 h-4 w-4 shrink-0', dark ? 'text-bronze' : 'text-forest')} />
              <span>{c}</span>
            </li>
          ))}
        </ul>

        <div className={cn('mt-8 border-t pt-6', dark ? 'border-linen/15' : 'border-mist')}>
          {/* Kein ab-Preis mehr — Preise pflegt allein der Shop (Meeting 12.08.2026). */}
          <p
            className={cn(
              'font-mono text-[11px] uppercase tracking-[0.18em]',
              dark ? 'text-linen/70' : 'text-ink/60'
            )}
          >
            Preise bald im neuen Shop
          </p>
          <p className={cn('mt-3 text-xs leading-relaxed', dark ? 'text-linen/60' : 'text-ink/55')}>
            {kit.note}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant={dark ? 'accent' : 'primary'}>
              <Link href="/planung">
                Planung starten <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
                        <Button
              variant={dark ? 'ghost' : 'outline'}
              className={dark ? 'text-linen hover:bg-linen/10' : ''}
              onClick={() => setAskOpen(true)}
            >
              Kit anfragen
            </Button>
            {/* Gekauft wird künftig im neuen Shop — bis zum Start ohne Link (18.08.2026). */}
            <Button
              variant={dark ? 'ghost' : 'link'}
              className={dark ? 'text-linen/70' : 'text-ink/60'}
              disabled
              title="Der neue Green-Gard Shop ist bald verfügbar"
            >
              Shop — bald verfügbar
            </Button>
          </div>
        </div>
      </article>

      <Dialog
        open={askOpen}
        onOpenChange={(o) => {
          setAskOpen(o);
          if (!o) setSent(false);
        }}
      >
        <DialogContent>
          {sent ? (
            <>
              <span className="grid h-12 w-12 place-items-center rounded-full bg-forest text-linen">
                <Check className="h-5 w-5" />
              </span>
              <DialogTitle>Anfrage ist notiert.</DialogTitle>
              <DialogDescription>
                Wir melden uns innerhalb von zwei Werktagen zum {kit.name} und klären die
                offenen Punkte — Fläche, Wasserdruck, Zeitrahmen.
                <span className="font-mono mt-3 block text-[10px] uppercase tracking-[0.18em]">
                  Bitte die vorbereitete Mail im Mailprogramm absenden.
                </span>
              </DialogDescription>
              <AnfrageFallback mailtoUrl={mailtoUrl} className="mt-2" />
            </>
          ) : (
            <>
              <p className="eyebrow">Kit anfragen</p>
              <DialogTitle>{kit.name}</DialogTitle>
              <DialogDescription>
                Wir prüfen, ob das Kit zu Ihrem Garten passt, und senden Ihnen eine Einschätzung inklusive Preisrahmen — kostenfrei und ohne Termin.
              </DialogDescription>
              <form
                className="mt-2 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  // Go-Live ohne Backend: Anfrage als vorbefüllte Mail.
                  const url = oeffneAnfrage(`Kit-Anfrage: ${kit.name}`, [
                    `Anfrage zum Starter Kit "${kit.name}" über die Website`,
                    '',
                    `Rückmeldung an: ${email}`,
                  ]);
                  setMailtoUrl(url);
                  setSent(true);
                }}
              >
                <div>
                  <label className="eyebrow mb-2 block" htmlFor={`kit-mail-${kit.slug}`}>
                    E-Mail
                  </label>
                  <Input
                    id={`kit-mail-${kit.slug}`}
                    type="email"
                    required
                    placeholder="ihre@email.de"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button type="submit" variant="primary" className="w-full">
                  Anfrage senden →
                </Button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
