'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Eyebrow } from '@/components/Eyebrow';
import { berechneEmpfehlung, type Bewässert, type Quelle, type Steuerung } from '@/lib/konfigurator';
import { useCart } from '@/store/cart';
import { formatEUR, cn } from '@/lib/utils';

const STEPS = ['Fläche', 'Wasserquelle', 'Bewässerung', 'Steuerung', 'Robotik', 'Licht', 'Ergebnis'] as const;

export default function PlanungPage() {
  const addItem = useCart((s) => s.addItem);
  const openDrawer = useCart((s) => s.openDrawer);

  const [step, setStep] = useState(0);
  const [flaeche, setFlaeche] = useState(450);
  const [quelle, setQuelle] = useState<Quelle>('leitung');
  const [bew, setBew] = useState<Bewässert[]>(['rasen', 'beete']);
  const [steuerung, setSteuerung] = useState<Steuerung>('smart');
  const [mr, setMr] = useState(false);
  const [bel, setBel] = useState(false);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const empf = useMemo(
    () =>
      berechneEmpfehlung({
        flaecheQm: flaeche,
        quelle,
        bewaessert: bew,
        steuerung,
        maehroboter: mr,
        beleuchtung: bel,
      }),
    [flaeche, quelle, bew, steuerung, mr, bel]
  );

  const paketName =
    empf.paketSlug === 'starter'
      ? 'System I · Sereno'
      : empf.paketSlug === 'pro'
        ? 'System II · Cortile'
        : 'System III · Sovereign';

  function next() { setStep((s) => Math.min(STEPS.length - 1, s + 1)); }
  function prev() { setStep((s) => Math.max(0, s - 1)); }

  return (
    <div className="bg-paper">
      <div className="border-b border-mist">
        <div className="container py-6 md:py-8 flex items-center justify-between gap-6">
          <Eyebrow>Planung · Schritt {step + 1} von {STEPS.length}</Eyebrow>
          <span className="hidden md:block font-mono text-[11px] uppercase tracking-[0.18em] text-ink/55">{STEPS[step]}</span>
        </div>
        <div className="h-px bg-mist">
          <div className="h-full bg-forest transition-all duration-500" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
      </div>

      <div className="container py-16 md:py-24 min-h-[60vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="max-w-3xl"
          >
            {step === 0 && (
              <>
                <h1 className="h-display text-5xl md:text-7xl">Wie groß ist <em className="italic">dein Garten</em>?</h1>
                <p className="text-ink/70 mt-6 max-w-xl">
                  Stell den Slider auf deine ungefähre Fläche. Wir berechnen daraus
                  die nötige Anzahl Regner, Pumpenleistung und Steuerungs-Zonen.
                </p>
                <div className="mt-16 max-w-xl">
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="eyebrow">Fläche</span>
                    <span className="num font-display text-4xl">{flaeche} m²</span>
                  </div>
                  <Slider value={[flaeche]} min={50} max={2000} step={50} onValueChange={(v) => setFlaeche(v[0])} />
                  <div className="num mt-3 flex justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50">
                    <span>50 m²</span><span>2.000 m²</span>
                  </div>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <h1 className="h-display text-5xl md:text-7xl"><em className="italic">Wasserquelle</em>?</h1>
                <p className="text-ink/70 mt-6 max-w-xl">
                  Zisterne und Brunnen brauchen eine Pumpe — die wir dann gleich mit auslegen.
                </p>
                <div className="mt-12 grid sm:grid-cols-3 gap-4 max-w-2xl">
                  {(['leitung', 'zisterne', 'brunnen'] as Quelle[]).map((q) => (
                    <button
                      key={q}
                      data-cursor="hover"
                      onClick={() => setQuelle(q)}
                      className={cn(
                        'border text-left p-6 transition-all',
                        quelle === q ? 'border-forest bg-forest text-linen' : 'border-mist hover:border-ink/40'
                      )}
                    >
                      <p className="font-display text-2xl tracking-tight capitalize">{q === 'leitung' ? 'Leitungswasser' : q}</p>
                      <p className={cn('text-sm mt-2', quelle === q ? 'text-linen/70' : 'text-ink/60')}>
                        {q === 'leitung' && 'Druck direkt aus dem Hausanschluss.'}
                        {q === 'zisterne' && 'Regenwasser, saug- oder tauchgepumpt.'}
                        {q === 'brunnen' && 'Grundwasser über Tiefbrunnen.'}
                      </p>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h1 className="h-display text-5xl md:text-7xl">Was soll <em className="italic">bewässert</em> werden?</h1>
                <p className="text-ink/70 mt-6 max-w-xl">Mehrfachauswahl. Wir wählen pro Bereich die richtige Düsen-Strategie.</p>
                <div className="mt-12 grid sm:grid-cols-2 gap-4 max-w-2xl">
                  {(['rasen', 'beete', 'hecken', 'hochbeet'] as Bewässert[]).map((b) => {
                    const active = bew.includes(b);
                    return (
                      <button
                        key={b}
                        data-cursor="hover"
                        onClick={() => setBew((cur) => (active ? cur.filter((x) => x !== b) : [...cur, b]))}
                        className={cn(
                          'border text-left p-6 transition-all flex items-center justify-between',
                          active ? 'border-bronze bg-bronze text-linen' : 'border-mist hover:border-ink/40'
                        )}
                      >
                        <span className="font-display text-2xl tracking-tight capitalize">{b}</span>
                        {active && <Check className="h-5 w-5" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h1 className="h-display text-5xl md:text-7xl"><em className="italic">Steuerung</em>?</h1>
                <p className="text-ink/70 mt-6 max-w-xl">Smart-Steuerungen sparen bis zu 50% Wasser durch Wetter-Anpassung.</p>
                <div className="mt-12 grid lg:grid-cols-3 gap-4">
                  {([
                    { v: 'manuell' as Steuerung, t: 'Manuell', d: 'Ohne WLAN — solide & günstig.' },
                    { v: 'smart' as Steuerung, t: 'Smart', d: 'Hydrawise WLAN mit App.' },
                    { v: 'premium' as Steuerung, t: 'Premium', d: 'Multi-Zonen, Multi-Geräte.' },
                  ]).map((opt) => (
                    <button
                      key={opt.v}
                      data-cursor="hover"
                      onClick={() => setSteuerung(opt.v)}
                      className={cn(
                        'border text-left p-6 transition-all',
                        steuerung === opt.v ? 'border-forest bg-forest text-linen' : 'border-mist hover:border-ink/40'
                      )}
                    >
                      <p className="font-display text-2xl tracking-tight">{opt.t}</p>
                      <p className={cn('text-sm mt-2', steuerung === opt.v ? 'text-linen/70' : 'text-ink/60')}>{opt.d}</p>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <h1 className="h-display text-5xl md:text-7xl">Mähroboter <em className="italic">dazu</em>?</h1>
                <p className="text-ink/70 mt-6 max-w-xl">Kress oder Husqvarna — abhängig von deiner Fläche.</p>
                <div className="mt-12 grid sm:grid-cols-2 gap-4 max-w-2xl">
                  {([true, false] as const).map((v) => (
                    <button
                      key={String(v)}
                      data-cursor="hover"
                      onClick={() => setMr(v)}
                      className={cn(
                        'border p-6 text-left transition-all',
                        mr === v ? 'border-forest bg-forest text-linen' : 'border-mist hover:border-ink/40'
                      )}
                    >
                      <p className="font-display text-2xl tracking-tight">{v ? 'Ja, bitte' : 'Nein, danke'}</p>
                      <p className={cn('text-sm mt-2', mr === v ? 'text-linen/70' : 'text-ink/60')}>
                        {v ? 'Wir wählen das passende Modell anhand der Fläche aus.' : 'Kann später jederzeit ergänzt werden.'}
                      </p>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 5 && (
              <>
                <h1 className="h-display text-5xl md:text-7xl">Beleuchtung <em className="italic">dazu</em>?</h1>
                <p className="text-ink/70 mt-6 max-w-xl">In-Lite 12V — sicher, sparsam, blendfrei. Mit Steckersystem.</p>
                <div className="mt-12 grid sm:grid-cols-2 gap-4 max-w-2xl">
                  {([true, false] as const).map((v) => (
                    <button
                      key={String(v)}
                      data-cursor="hover"
                      onClick={() => setBel(v)}
                      className={cn(
                        'border p-6 text-left transition-all',
                        bel === v ? 'border-forest bg-forest text-linen' : 'border-mist hover:border-ink/40'
                      )}
                    >
                      <p className="font-display text-2xl tracking-tight">{v ? 'Ja, bitte' : 'Nein, danke'}</p>
                      <p className={cn('text-sm mt-2', bel === v ? 'text-linen/70' : 'text-ink/60')}>
                        {v ? 'Pfade, Akzente und Fassade — passend zur Gartenfläche.' : 'Kann später jederzeit ergänzt werden.'}
                      </p>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 6 && (
              <div>
                <Eyebrow>Empfehlung</Eyebrow>
                <h1 className="h-display text-5xl md:text-7xl mt-4">{paketName}</h1>
                <p className="italic text-moss mt-3">
                  {flaeche} m² · {quelle === 'leitung' ? 'Leitungswasser' : quelle.charAt(0).toUpperCase() + quelle.slice(1)} · {bew.join(', ')}
                </p>

                <div className="mt-12 grid lg:grid-cols-12 gap-10">
                  <div className="lg:col-span-7 border-t border-mist pt-6">
                    <p className="eyebrow mb-4">Stückliste</p>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between border-b border-mist pb-3">
                        <span>{paketName} · Basis-System</span>
                        <span className="num font-display">{formatEUR(empf.basisPreis)}</span>
                      </div>
                      {empf.addOns.map((a) => (
                        <div key={a.label} className="flex justify-between border-b border-mist pb-3">
                          <span>{a.label}</span>
                          <span className="num font-display">{formatEUR(a.preis)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between pt-3 items-baseline">
                        <span className="eyebrow">Gesamt netto</span>
                        <span className="price text-3xl">{formatEUR(empf.gesamt)}</span>
                      </div>
                    </div>

                    {empf.hinweise.length > 0 && (
                      <div className="mt-6 p-4 bg-linen text-sm border-l-2 border-bronze">
                        {empf.hinweise.map((h) => <p key={h}>{h}</p>)}
                      </div>
                    )}
                  </div>

                  <div className="lg:col-span-5 bg-forest text-linen p-8">
                    <p className="eyebrow text-linen/60 [&>span:first-child]:bg-linen/30">Nächster Schritt</p>
                    <h3 className="font-display text-2xl tracking-tight mt-3">Wie möchtest du weitermachen?</h3>
                    <div className="mt-6 space-y-3">
                      <Button
                        onClick={() => {
                          addItem({
                            slug: `paket-${empf.paketSlug}`,
                            name: paketName,
                            brand: 'Green-Gard',
                            image: 'https://images.unsplash.com/photo-1530983929-9b69cdfdef00?auto=format&fit=crop&w=800&q=80',
                            netPrice: empf.gesamt,
                          });
                          openDrawer();
                        }}
                        variant="accent"
                        size="lg"
                        className="w-full justify-between"
                      >
                        Komplett in Mappe legen <ArrowRight className="h-4 w-4" />
                      </Button>
                      <Button asChild variant="ghost" size="lg" className="w-full justify-between text-linen hover:bg-linen/10">
                        <Link href="/atelier">Termin im Atelier <ArrowRight className="h-4 w-4" /></Link>
                      </Button>
                      <form
                        onSubmit={(e) => { e.preventDefault(); if (email) setSent(true); }}
                        className="border-t border-linen/15 pt-4 mt-2"
                      >
                        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-linen/60 mb-2">Plan per Mail</p>
                        {sent ? (
                          <p className="text-sm text-bronze">Gesendet an {email}.</p>
                        ) : (
                          <div className="flex gap-2">
                            <input
                              type="email"
                              required
                              placeholder="deine@email.de"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="flex-1 h-10 bg-transparent border-b border-linen/30 px-1 text-sm text-linen placeholder:text-linen/40 focus:outline-none focus:border-linen"
                            />
                            <button type="submit" className="px-4 h-10 bg-bronze hover:bg-[#9e6228] text-linen text-sm">Senden</button>
                          </div>
                        )}
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-16 flex items-center justify-between border-t border-mist pt-8">
          <Button variant="ghost" onClick={prev} disabled={step === 0}>
            <ArrowLeft className="h-4 w-4" /> Zurück
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={next} variant="primary" size="lg">
              Weiter <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={() => setStep(0)} variant="outline">
              Neu beginnen
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
