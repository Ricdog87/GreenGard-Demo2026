'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Eyebrow } from '@/components/Eyebrow';
import {
  berechneEmpfehlung,
  QUELLE_LABEL,
  type Flaechentyp,
  type Quelle,
  type Steuerung,
} from '@/lib/konfigurator';
import { useCart } from '@/store/cart';
import { priceFor, priceLabel } from '@/lib/pricing';
import { formatEURRound, cn } from '@/lib/utils';
import { oeffneAnfrage } from '@/lib/anfrage';

// V2: nur noch 3 Kernfragen + WLAN — Mähroboter- und Beleuchtungs-Add-ons sind
// bewusst raus, die laufen über die eigenen Kits.
const STEPS = ['Fläche', 'Wasserquelle', 'Bereiche', 'Steuerung', 'Ergebnis'] as const;

export function PlanungRechner() {
  const mode = useCart((s) => s.mode);

  const [step, setStep] = useState(0);
  const [flaeche, setFlaeche] = useState(450);
  const [quelle, setQuelle] = useState<Quelle>('leitung');
  const [bereiche, setBereiche] = useState<Flaechentyp[]>(['rasen']);
  const [rasenQm, setRasenQm] = useState(350);
  const [beetQm, setBeetQm] = useState(100);
  const [steuerung, setSteuerung] = useState<Steuerung>('smart');
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  // Cross-Sell wie auf green-gard.de/planungstool angeboten: „Wir fügen Ihnen
  // auf Wunsch einen Mähroboter oder ein Lichtkonzept dem Angebot hinzu.“
  // Bewusst NICHT als Rechner-Schritt (V2: einfach halten), sondern als
  // Ankreuzfelder am Ergebnis — sie wandern nur in die Anfrage.
  const [extras, setExtras] = useState<string[]>([]);
  // Meeting 12.08.2026: Kunden sollen Bauplaene direkt mitschicken koennen —
  // das spart die Rueckfrage nach der Skizze. Demo: Dateien werden erfasst und
  // angezeigt; der echte Upload folgt mit Supabase Storage (Bucket "plaene").
  const [plaene, setPlaene] = useState<File[]>([]);

  function toggleExtra(v: string) {
    setExtras((cur) => (cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]));
  }

  const empf = useMemo(
    () => berechneEmpfehlung({ flaecheQm: flaeche, quelle, bereiche, rasenQm, beetQm, steuerung }),
    [flaeche, quelle, bereiche, rasenQm, beetQm, steuerung]
  );

  function toggleBereich(v: Flaechentyp) {
    setBereiche((cur) => {
      if (cur.includes(v)) return cur.length === 1 ? cur : cur.filter((x) => x !== v);
      return [...cur, v];
    });
  }

  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div className="bg-paper">
      <div className="border-b border-mist">
        <div className="container flex items-center justify-between gap-6 py-6 md:py-8">
          <Eyebrow>
            Planung · Schritt {step + 1} von {STEPS.length}
          </Eyebrow>
          <span className="font-mono hidden text-[11px] uppercase tracking-[0.18em] text-ink/55 md:block">
            {STEPS[step]}
          </span>
        </div>
        <div className="h-px bg-mist">
          <div
            className="h-full bg-forest transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="container min-h-[60vh] py-16 md:py-24">
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
                <h1 className="h-display text-5xl md:text-7xl">
                  Wie groß ist <em className="italic">Ihr Garten</em>?
                </h1>
                <p className="mt-6 max-w-xl text-ink/70">
                  Die Gesamtfläche genügt als Startwert — wir leiten daraus Regnerzahl,
                  Zonen und Rohrlängen ab.
                </p>
                <div className="mt-16 max-w-xl">
                  <div className="mb-4 flex items-baseline justify-between">
                    <span className="eyebrow">Grundstücksfläche</span>
                    <span className="num font-display text-4xl">{flaeche} m²</span>
                  </div>
                  <Slider
                    value={[flaeche]}
                    min={50}
                    max={2000}
                    step={50}
                    onValueChange={(v) => {
                      const val = v[0];
                      setFlaeche(val);
                      // Vorbelegung der Teilflächen mitziehen, solange nichts
                      // manuell justiert wurde. Rasen als Differenz, damit
                      // beide Teilflächen zusammen exakt die Gartenfläche
                      // ergeben (getrennt gerundet wird aus 450 sonst 451).
                      const beet = Math.round(val * 0.25);
                      setRasenQm(val - beet);
                      setBeetQm(beet);
                    }}
                    aria-label="Grundstücksfläche"
                  />
                  <div className="num font-mono mt-3 flex justify-between text-[10px] uppercase tracking-[0.18em] text-ink/50">
                    <span>50 m²</span>
                    <span>2.000 m²</span>
                  </div>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <h1 className="h-display text-5xl md:text-7xl">
                  Woher kommt das <em className="italic">Wasser</em>?
                </h1>
                <p className="mt-6 max-w-xl text-ink/70">
                  Zisterne und Brunnen brauchen eine Pumpe — die legen wir passend zur
                  Saughöhe und zum Volumenstrom aus.
                </p>
                <div className="mt-12 grid max-w-2xl gap-4 sm:grid-cols-3">
                  {(['leitung', 'zisterne', 'brunnen'] as Quelle[]).map((q) => (
                    <button
                      key={q}
                      data-cursor="hover"
                      onClick={() => setQuelle(q)}
                      className={cn(
                        'border p-6 text-left transition-all',
                        quelle === q
                          ? 'border-forest bg-forest text-linen'
                          : 'border-mist hover:border-ink/40'
                      )}
                    >
                      <p className="font-display text-2xl tracking-tight">{QUELLE_LABEL[q]}</p>
                      <p className={cn('mt-2 text-sm', quelle === q ? 'text-linen/70' : 'text-ink/60')}>
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
                <h1 className="h-display text-5xl md:text-7xl">
                  Was soll <em className="italic">bewässert</em> werden?
                </h1>
                <p className="mt-6 max-w-xl text-ink/70">
                  Rasen braucht Regner, Beete brauchen Tropfschlauch. Beides zusammen
                  läuft über getrennte Zonen.
                </p>
                <div className="mt-12 grid max-w-2xl gap-4 sm:grid-cols-2">
                  {(
                    [
                      { v: 'rasen' as Flaechentyp, l: 'Rasenfläche' },
                      { v: 'beete' as Flaechentyp, l: 'Beetfläche' },
                    ]
                  ).map((b) => {
                    const active = bereiche.includes(b.v);
                    return (
                      <button
                        key={b.v}
                        data-cursor="hover"
                        onClick={() => toggleBereich(b.v)}
                        className={cn(
                          'flex items-center justify-between border p-6 text-left transition-all',
                          active ? 'border-bronze bg-bronze text-linen' : 'border-mist hover:border-ink/40'
                        )}
                      >
                        <span className="font-display text-2xl tracking-tight">{b.l}</span>
                        {active && <Check className="h-5 w-5" />}
                      </button>
                    );
                  })}
                </div>

                {/* Je gewähltem Bereich ein eigener m²-Slider */}
                <div className="mt-12 max-w-xl space-y-10">
                  {bereiche.includes('rasen') && (
                    <div>
                      <div className="mb-3 flex items-baseline justify-between">
                        <span className="eyebrow">Rasenfläche</span>
                        <span className="num font-display text-2xl">{rasenQm} m²</span>
                      </div>
                      <Slider
                        value={[rasenQm]}
                        min={0}
                        max={2000}
                        step={10}
                        onValueChange={(v) => setRasenQm(v[0])}
                        aria-label="Rasenfläche in Quadratmetern"
                      />
                    </div>
                  )}
                  {bereiche.includes('beete') && (
                    <div>
                      <div className="mb-3 flex items-baseline justify-between">
                        <span className="eyebrow">Beetfläche</span>
                        <span className="num font-display text-2xl">{beetQm} m²</span>
                      </div>
                      <Slider
                        value={[beetQm]}
                        min={0}
                        max={800}
                        step={10}
                        onValueChange={(v) => setBeetQm(v[0])}
                        aria-label="Beetfläche in Quadratmetern"
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h1 className="h-display text-5xl md:text-7xl">
                  Steuerung per <em className="italic">WLAN</em>?
                </h1>
                <p className="mt-6 max-w-xl text-ink/70">
                  Smarte Steuergeräte passen die Laufzeit automatisch ans Wetter an und
                  sparen bis zur Hälfte des Wassers. Manuell ist günstiger — und später
                  ohne Austausch aufrüstbar.
                </p>
                <div className="mt-12 grid max-w-2xl gap-4 sm:grid-cols-2">
                  {(
                    [
                      {
                        v: 'smart' as Steuerung,
                        t: 'Ja, smart per App',
                        d: 'Hunter Hydrawise mit Wetter-API und Regensensor.',
                      },
                      {
                        v: 'manuell' as Steuerung,
                        t: 'Nein, manuell',
                        d: 'Programmierung direkt am Steuergerät, WLAN-fähig.',
                      },
                    ]
                  ).map((o) => (
                    <button
                      key={o.v}
                      data-cursor="hover"
                      onClick={() => setSteuerung(o.v)}
                      className={cn(
                        'border p-6 text-left transition-all',
                        steuerung === o.v
                          ? 'border-forest bg-forest text-linen'
                          : 'border-mist hover:border-ink/40'
                      )}
                    >
                      <p className="font-display text-2xl tracking-tight">{o.t}</p>
                      <p
                        className={cn(
                          'mt-2 text-sm',
                          steuerung === o.v ? 'text-linen/70' : 'text-ink/60'
                        )}
                      >
                        {o.d}
                      </p>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 4 && (
              <div>
                <Eyebrow>Empfehlung</Eyebrow>
                <h1 className="h-display mt-4 text-5xl md:text-7xl">{empf.kitName}</h1>
                <p className="mt-3 italic text-moss">
                  {empf.bewaesserteFlaeche} m² bewässert von {flaeche} m² Grundstück ·{' '}
                  {QUELLE_LABEL[quelle]} ·{' '}
                  {bereiche.includes('rasen') && `Rasen ${rasenQm} m²`}
                  {bereiche.length === 2 && ' · '}
                  {bereiche.includes('beete') && `Beete ${beetQm} m²`}
                </p>

                {/* min-w-0: das E-Mail-Feld hat eine intrinsische Mindestbreite,
                    die sonst die Grid-Spalte über den Viewport hinaus aufzieht. */}
                <div className="mt-12 grid gap-10 lg:grid-cols-12">
                  <div className="min-w-0 border-t border-mist pt-6 lg:col-span-7">
                    {/* Stückliste entfernt (Meeting 12.08.2026) — Komponenten
                        gehören ins Angebot, nicht auf die Website. */}
                    {/* Kosten nach der Preisliste von Green-Gard */}
                    <div className="border-t-0 pt-0">
                      <p className="eyebrow mb-4">Materialkosten</p>
                      <div className="space-y-3 text-sm">
                        {empf.kosten.map((k) => (
                          <div
                            key={k.label}
                            className="flex justify-between gap-4 border-b border-mist pb-3"
                          >
                            <span>{k.label}</span>
                            <span className="price whitespace-nowrap text-base">
                              {formatEURRound(priceFor(k.netto, mode))}
                            </span>
                          </div>
                        ))}
                        <div className="flex items-baseline justify-between gap-4 pt-3">
                          <span className="eyebrow">Summe ca.</span>
                          <span className="price text-3xl">
                            {formatEURRound(priceFor(empf.gesamtNetto, mode))}
                          </span>
                        </div>
                        <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-ink/50">
                          {priceLabel(mode)} · {empf.zonen} Zonen
                        </p>
                        {/* Meeting 12.08.2026: klarer Disclaimer zur Unverbindlichkeit. */}
                        <p className="mt-3 border-l-2 border-copper/60 bg-linen/70 py-2.5 pl-3 text-xs leading-relaxed normal-case tracking-normal text-ink/70">
                          Unverbindlicher Richtwert für das Material — ohne Montage und
                          Erdarbeiten, kein Angebot. Den verbindlichen Preis erhalten Sie
                          mit der Planung.
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 space-y-2 border-l-2 border-copper/50 bg-linen/60 py-4 pl-4 text-sm text-ink/75">
                      {empf.hinweise.map((h) => (
                        <p key={h}>{h}</p>
                      ))}
                    </div>
                  </div>

                  {/* self-start: das Panel soll nicht auf die Höhe der Stückliste
                      mitwachsen und unten leer stehen. */}
                  <div className="min-w-0 self-start bg-forest p-8 text-linen lg:col-span-5">
                    <p className="eyebrow text-linen/60 [&>span:first-child]:bg-linen/30">
                      Nächster Schritt
                    </p>
                    <h3 className="font-display mt-3 text-2xl tracking-tight">
                      Wie möchten Sie fortfahren?
                    </h3>

                    {/* Cross-Sell: fließt in Terminanfrage und Plan-Mail ein. */}
                    <div className="mt-6 border-t border-linen/15 pt-5">
                      <p className="font-mono mb-3 text-[11px] uppercase tracking-[0.18em] text-linen/60">
                        Ins Angebot mit aufnehmen?
                      </p>
                      <div className="space-y-2">
                        {[
                          { id: 'beleuchtung', label: 'Gartenbeleuchtung', note: 'In-Lite 12V-Konzept' },
                          { id: 'maehroboter', label: 'Mähroboter', note: 'Kress oder Husqvarna' },
                          { id: 'pool', label: 'Poolpflege', note: 'Bayrol und Beatbot' },
                        ].map((x) => (
                          <label
                            key={x.id}
                            data-cursor="hover"
                            className={cn(
                              'flex cursor-pointer items-center justify-between gap-3 border px-3.5 py-2.5 text-sm transition-colors',
                              extras.includes(x.id)
                                ? 'border-bronze bg-linen/10'
                                : 'border-linen/20 hover:border-linen/45'
                            )}
                          >
                            <span className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={extras.includes(x.id)}
                                onChange={() => toggleExtra(x.id)}
                                className="h-4 w-4 accent-[#C77B3F]"
                              />
                              {x.label}
                            </span>
                            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-linen/50">
                              {x.note}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      <Button asChild variant="accent" size="lg" className="w-full justify-between">
                        <Link href={extras.length ? `/beratung?extras=${extras.join(',')}` : '/beratung'}>
                          Termin für Systemplanung <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="ghost"
                        size="lg"
                        className="w-full justify-between text-linen hover:bg-linen/10"
                      >
                        <Link href={`/starter-kits#${empf.kitSlug}`}>
                          Kit ansehen <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>

                      {/* Bauplan-Upload (Meeting 12.08.2026) */}
                      <div className="mt-2 border-t border-linen/15 pt-4">
                        <label
                          htmlFor="plan-upload"
                          data-cursor="hover"
                          className="font-mono block cursor-pointer border border-dashed border-linen/35 px-4 py-3 text-center text-[11px] uppercase tracking-[0.16em] text-linen/70 transition-colors hover:border-linen/70 hover:text-linen"
                        >
                          Bauplan oder Skizze anhängen (PDF, Foto)
                        </label>
                        <input
                          id="plan-upload"
                          type="file"
                          multiple
                          accept=".pdf,image/*,.dwg,.dxf"
                          className="sr-only"
                          onChange={(e) => setPlaene(Array.from(e.target.files ?? []))}
                        />
                        {plaene.length > 0 && (
                          <ul className="mt-2 space-y-1 text-xs text-linen/70">
                            {plaene.map((f) => (
                              <li key={f.name} className="truncate">
                                ✓ {f.name}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          // Go-Live ohne Backend: Planungsanfrage als vorbefüllte
                          // Mail. Anhänge kann mailto nicht mitnehmen — die Mail
                          // bittet darum, die gewählten Dateien anzuhängen.
                          // TODO: Resend/Supabase Storage (UEBERGABE.md).
                          oeffneAnfrage(`Planungsanfrage: ${flaeche} m², ${QUELLE_LABEL[quelle]}`, [
                            'Planungsanfrage aus dem Rechner',
                            '',
                            `Grundstück: ${flaeche} m² (${QUELLE_LABEL[quelle]})`,
                            `Bereiche: ${bereiche.join(', ')} · Steuerung: ${steuerung}`,
                            `Empfohlenes Kit: ${empf.kitName}`,
                            extras.length ? `Ins Angebot aufnehmen: ${extras.join(', ')}` : false,
                            `Rückmeldung an: ${email}`,
                            '',
                            plaene.length
                              ? `WICHTIG: Bitte die gewählten Pläne an diese Mail anhängen (${plaene.map((f) => f.name).join(', ')}).`
                              : 'Ein Bauplan oder eine Skizze als Anhang beschleunigt die Planung.',
                          ]);
                          setSent(true);
                        }}
                        className="mt-4 border-t border-linen/15 pt-4"
                      >
                        <p className="font-mono mb-2 text-[11px] uppercase tracking-[0.18em] text-linen/60">
                          Plan per Mail
                        </p>
                        {sent ? (
                          <p className="text-sm text-bronze">
                            Mail vorbereitet — bitte im Mailprogramm senden
                            {plaene.length > 0 ? ' und die gewählten Pläne anhängen' : ''}.
                          </p>
                        ) : (
                          <div className="flex gap-2">
                            <input
                              type="email"
                              required
                              placeholder="ihre@email.de"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              aria-label="E-Mail für den Plan"
                              className="h-10 min-w-0 flex-1 border-b border-linen/30 bg-transparent px-1 text-sm text-linen placeholder:text-linen/40 focus:border-linen focus:outline-none"
                            />
                            <button
                              type="submit"
                              className="h-10 bg-bronze px-4 text-sm text-linen transition-colors hover:bg-[#9e6228]"
                            >
                              Senden
                            </button>
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
