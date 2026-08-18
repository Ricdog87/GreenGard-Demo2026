'use client';

import { useState } from 'react';
import { Check, MapPin, ShoppingBag, Users } from 'lucide-react';
import { Eyebrow } from '@/components/Eyebrow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useCart } from '@/store/cart';
import { priceFor, priceLabel } from '@/lib/pricing';
import { formatEURRound, cn } from '@/lib/utils';
import { oeffneAnfrage } from '@/lib/anfrage';
import { schulungen, type Schulung } from '@/lib/data';

export function Schulungen() {
  const mode = useCart((s) => s.mode);
  const addItem = useCart((s) => s.addItem);
  const openDrawer = useCart((s) => s.openDrawer);

  // Platz-Vormerkung (Meeting 18.08.2026): Die Termine für 2027 stehen noch
  // nicht fest — statt eines nackten Mail-Links sammelt ein kleines Formular
  // die Interessenten strukturiert ein.
  const [vormerkung, setVormerkung] = useState<Schulung | null>(null);
  const [gesendet, setGesendet] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [firma, setFirma] = useState('');
  const [personen, setPersonen] = useState('1');

  /**
   * Schulungen sind das Einzige, was über den Warenkorb läuft — Produkte werden
   * im Shop verkauft (Entscheidung 31.07.2026). Jeder Termin ist eine eigene
   * Position, damit zwei Termine derselben Schulung nebeneinander stehen können.
   */
  function inDenWarenkorb(s: Schulung, termin: string) {
    addItem({
      slug: `${s.slug}--${termin}`,
      name: s.title,
      brand: 'Schulung',
      image: '/img/cat/steuerung.svg',
      netPrice: s.abPreis,
      termin,
    });
    openDrawer();
  }

  return (
    <section id="schulungen" className="border-t border-mist bg-linen py-24 md:py-32">
      <div className="container">
        <Eyebrow number="S">Schulungen</Eyebrow>
        <h2 className="h-display mt-6 max-w-3xl text-balance text-4xl md:text-6xl">
          Wissen, das <em className="italic">auf der Baustelle</em> hält.
        </h2>
        <p className="mt-6 max-w-2xl text-ink/70">
          Praxisnahe Schulungen in Wiesbaden — für GaLaBau-Betriebe, Installateure und
          Planungsbüros. Kleine Gruppen, echte Anlagen, kein Folienvortrag.
        </p>

        <div data-reveal-group className="mt-14 grid gap-6 lg:grid-cols-3">
          {schulungen.map((s) => (
            <article key={s.slug} className="flex flex-col border border-mist bg-paper p-8">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-moss">
                {s.roman}
              </span>
              <h3 className="font-display mt-2 text-2xl tracking-tight md:text-3xl">{s.title}</h3>
              <p className="font-mono mt-2 text-[11px] uppercase tracking-[0.16em] text-ink/60">
                {s.duration}
              </p>
              <p className="mt-4 text-sm italic text-moss">Für {s.audience}</p>

              <ul className="mt-6 flex-1 space-y-2.5 text-sm text-ink/80">
                {s.content.map((c) => (
                  <li key={c} className="flex gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-mist pt-5">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50">
                    ab
                  </span>
                  <span className="price text-3xl">
                    {formatEURRound(priceFor(s.abPreis, mode))}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50">
                    {priceLabel(mode)} / Person
                  </span>
                </div>
                {s.plaetze > 0 && (
                  <p className="font-mono mt-2 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-ink/55">
                    <Users className="h-3.5 w-3.5" /> max. <span className="num">{s.plaetze}</span>{' '}
                    Plätze
                  </p>
                )}

                {s.orte && s.orte.length > 0 && (
                  <p className="font-mono mt-2 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-ink/55">
                    <MapPin className="h-3.5 w-3.5" /> {s.orte.join(' · ')}
                  </p>
                )}

                <p className="eyebrow mt-5 mb-2">Termine</p>
                {/* Solange die echten Termine fehlen, wird nichts erfunden — dann
                    führt die Karte in die Anfrage statt in den Warenkorb. */}
                {s.termine.length > 0 ? (
                  <>
                    <div className="flex flex-wrap gap-2">
                      {s.termine.map((t) => (
                        <button
                          key={t}
                          data-cursor="hover"
                          onClick={() => inDenWarenkorb(s, t)}
                          className={cn(
                            'num border border-mist px-3 py-1.5 text-xs transition-colors',
                            'hover:border-forest hover:bg-forest hover:text-linen'
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <Button
                      variant="primary"
                      className="mt-6 w-full"
                      onClick={() => inDenWarenkorb(s, s.termine[0])}
                    >
                      <ShoppingBag className="h-4 w-4" /> Platz buchen
                    </Button>
                  </>
                ) : (
                  <>
                    {/* Meeting 18.08.2026: Termine 2027 als „Bald verfügbar“
                        kennzeichnen, Interesse über das Vormerk-Formular einsammeln. */}
                    <p className="text-sm text-ink/70">
                      <span className="font-medium">Termine 2027 — bald verfügbar.</span>{' '}
                      Merken Sie sich unverbindlich einen Platz vor, wir informieren Sie
                      zuerst.
                    </p>
                    <Button
                      variant="primary"
                      className="mt-6 w-full"
                      onClick={() => setVormerkung(s)}
                    >
                      Platz vormerken
                    </Button>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>

        <p className="font-mono mt-10 text-[10px] uppercase leading-relaxed tracking-[0.16em] text-ink/50">
          Inhouse-Schulung im eigenen Betrieb auf Anfrage · Zahlung per Rechnung oder
          Zahlungslink
        </p>
      </div>

      <Dialog
        open={vormerkung !== null}
        onOpenChange={(o) => {
          if (!o) {
            setVormerkung(null);
            setGesendet(false);
          }
        }}
      >
        <DialogContent>
          {gesendet ? (
            <>
              <span className="grid h-12 w-12 place-items-center rounded-full bg-forest text-linen">
                <Check className="h-5 w-5" />
              </span>
              <DialogTitle>Platz ist vorgemerkt.</DialogTitle>
              <DialogDescription>
                Sobald die Termine für 2027 stehen, melden wir uns zuerst bei Ihnen —
                unverbindlich und ohne Zahlungspflicht.
                <span className="font-mono mt-3 block text-[10px] uppercase tracking-[0.18em]">
                  Bitte die vorbereitete Mail im Mailprogramm absenden.
                </span>
              </DialogDescription>
            </>
          ) : (
            vormerkung && (
              <>
                <p className="eyebrow">Platz vormerken</p>
                <DialogTitle>{vormerkung.title}</DialogTitle>
                <DialogDescription>
                  Die Termine für 2027 sind bald verfügbar. Wir merken Sie unverbindlich
                  vor und informieren Sie, sobald die Daten stehen.
                </DialogDescription>
                <form
                  className="mt-2 space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    // Go-Live ohne Backend: Vormerkung als vorbefüllte Mail.
                    oeffneAnfrage(`Platz-Vormerkung: ${vormerkung.title}`, [
                      `Vormerkung für die Schulung "${vormerkung.title}" über die Website`,
                      '',
                      `Name: ${name}`,
                      firma && `Firma: ${firma}`,
                      `Teilnehmer: ${personen}`,
                      `Rückmeldung an: ${email}`,
                    ]);
                    setGesendet(true);
                  }}
                >
                  <div>
                    <label className="eyebrow mb-2 block" htmlFor="vormerk-name">
                      Name
                    </label>
                    <Input
                      id="vormerk-name"
                      required
                      placeholder="Vor- und Nachname"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="eyebrow mb-2 block" htmlFor="vormerk-mail">
                      E-Mail
                    </label>
                    <Input
                      id="vormerk-mail"
                      type="email"
                      required
                      placeholder="ihre@email.de"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="eyebrow mb-2 block" htmlFor="vormerk-firma">
                        Firma (optional)
                      </label>
                      <Input
                        id="vormerk-firma"
                        placeholder="Firma"
                        value={firma}
                        onChange={(e) => setFirma(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="eyebrow mb-2 block" htmlFor="vormerk-personen">
                        Teilnehmer
                      </label>
                      <Input
                        id="vormerk-personen"
                        type="number"
                        min={1}
                        max={20}
                        value={personen}
                        onChange={(e) => setPersonen(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button type="submit" variant="primary" className="w-full">
                    Unverbindlich vormerken →
                  </Button>
                </form>
              </>
            )
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
