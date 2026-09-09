'use client';

import { useState } from 'react';
import { useForm, type DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, Paperclip, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CONTACT } from '@/lib/contact';
import { sendeAnfrage, dateiZuAnhang } from '@/lib/anfrage';
import { AnfrageFallback } from '@/components/AnfrageFallback';
import standorteJson from '@/data/pflanzenkoelle-standorte.json';

export interface Standort {
  kst: string;
  ort: string;
  adressNr: string;
  ansprechpartner: string;
}

const STANDORTE = standorteJson as Standort[];

const schema = z
  .object({
    kst: z.string().min(1, 'Bitte Standort auswählen'),
    ansprechpartner: z.string().min(2, 'Bitte Namen angeben'),
    email: z.string().email('Bitte gültige E-Mail angeben'),
    bauvorhaben: z.string().min(2, 'Bitte Bauvorhaben angeben'),
    wasserquelle: z.enum(['trinkwasser', 'brunnen', 'zisterne'], {
      required_error: 'Bitte Wasserquelle auswählen',
    }),
    wassermenge: z.string().min(1, 'Bitte Wassermenge angeben'),
    pumpe: z.enum(['ja', 'nein']),
    pumpenTyp: z.string().optional(),
    bereiche: z
      .array(z.enum(['rasen', 'beet', 'hecke', 'stauden']))
      .min(1, 'Bitte mindestens einen Bereich auswählen'),
    steuergeraet: z.enum(['hydrawise', 'rainbird', 'batterie9v', 'bluetooth', 'egal']),
    bemerkungen: z.string().optional(),
  })
  // Der Pumpentyp ist nur dann Pflicht, wenn es überhaupt eine Pumpe gibt —
  // genau diese Angabe fehlt sonst regelmäßig und kostet einen Rückruf.
  .superRefine((v, ctx) => {
    if (v.pumpe === 'ja' && (v.pumpenTyp ?? '').trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['pumpenTyp'],
        message: 'Bitte Pumpentyp angeben',
      });
    }
  });

type FormValues = z.infer<typeof schema>;
type Bereich = FormValues['bereiche'][number];

const QUELLEN: { value: FormValues['wasserquelle']; label: string; hint: string }[] = [
  { value: 'trinkwasser', label: 'Trinkwasser', hint: 'Druck direkt aus dem Hausanschluss' },
  { value: 'brunnen', label: 'Brunnen', hint: 'Grundwasser über Tiefbrunnen' },
  { value: 'zisterne', label: 'Zisterne', hint: 'Regenwasser, saug- oder tauchgepumpt' },
];

const BEREICHE: { value: Bereich; label: string; hint: string }[] = [
  { value: 'rasen', label: 'Rasen', hint: 'Versenkregner' },
  { value: 'beet', label: 'Beet', hint: 'Tropfschlauch' },
  { value: 'hecke', label: 'Hecke', hint: 'Tropfrohr längs' },
  { value: 'stauden', label: 'Stauden', hint: 'Tropfer punktuell' },
];

const STEUERGERAETE: { value: FormValues['steuergeraet']; label: string; hint: string }[] = [
  { value: 'hydrawise', label: 'Hunter Hydrawise', hint: 'WLAN, App und Wetterabgleich' },
  { value: 'rainbird', label: 'Rain Bird', hint: 'Bewährt, robust, erweiterbar' },
  { value: 'batterie9v', label: 'Batteriebetrieb 9 V', hint: 'Ohne Stromanschluss im Schacht' },
  { value: 'bluetooth', label: 'Bluetooth', hint: 'Steuerung am Gerät per Handy' },
  { value: 'egal', label: 'Noch offen', hint: 'Wir schlagen etwas Passendes vor' },
];

function labelOf<T extends string>(list: readonly { value: T; label: string }[], value: T) {
  return list.find((o) => o.value === value)?.label ?? value;
}

/** Auswahlkachel — gleiche Optik wie im Planungs-Assistenten. */
function Kachel({
  active,
  onClick,
  title,
  hint,
  accent,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <button
      type="button"
      data-cursor="hover"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'flex min-w-0 items-start justify-between gap-3 border p-4 text-left transition-all',
        active
          ? accent
            ? 'border-bronze bg-bronze text-linen'
            : 'border-forest bg-forest text-linen'
          : 'border-mist hover:border-ink/40'
      )}
    >
      <span className="min-w-0">
        <span className="font-display block text-lg leading-tight tracking-tight">{title}</span>
        {hint && (
          <span className={cn('mt-1 block text-xs', active ? 'text-linen/70' : 'text-ink/55')}>
            {hint}
          </span>
        )}
      </span>
      {active && <Check aria-hidden className="h-4 w-4 shrink-0" />}
    </button>
  );
}

// Wasserquelle bleibt bewusst ohne Vorbelegung — sie soll aktiv gewählt werden.
const DEFAULTS: DefaultValues<FormValues> = {
  kst: '',
  ansprechpartner: '',
  email: '',
  bauvorhaben: '',
  wassermenge: '',
  pumpe: 'nein',
  pumpenTyp: '',
  bereiche: [],
  steuergeraet: 'egal',
  bemerkungen: '',
};

export function ProjektFormular({ kundennummer }: { kundennummer: string }) {
  // Wir halten die echten Dateien, damit sie beim Server-Versand direkt an die
  // Mail angehängt werden können (kein erneutes Anhängen mehr).
  const [dateien, setDateien] = useState<File[]>([]);
  // Pflichtfeld seit dem Meeting 18.08.2026: Ohne Projektplan keine belastbare
  // Auslegung — deshalb blockt das Formular ohne Anhang.
  const [dateiFehler, setDateiFehler] = useState(false);
  const [serverOk, setServerOk] = useState(false);
  const [mailtoUrl, setMailtoUrl] = useState('');
  const [gesendet, setGesendet] = useState<{
    values: FormValues;
    standort: Standort;
    dateien: string[];
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULTS,
  });

  const kst = watch('kst');
  const wasserquelle = watch('wasserquelle');
  const pumpe = watch('pumpe');
  const bereiche = watch('bereiche');
  const steuergeraet = watch('steuergeraet');

  const standort = STANDORTE.find((s) => s.kst === kst);

  function toggleBereich(v: Bereich) {
    const cur = bereiche ?? [];
    const next = cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v];
    setValue('bereiche', next, { shouldValidate: true });
  }

  function addDateien(list: FileList | null) {
    if (!list) return;
    const neu = Array.from(list);
    setDateien((cur) => [...cur, ...neu.filter((f) => !cur.some((c) => c.name === f.name))]);
    setDateiFehler(false);
  }

  function neuesProjekt() {
    reset(DEFAULTS);
    setDateien([]);
    setDateiFehler(false);
    setServerOk(false);
    setGesendet(null);
  }

  // -------------------------------------------------------------- Erfolgsfall
  if (gesendet) {
    const { values: v, standort: st, dateien: anhaenge } = gesendet;
    const zusammenfassung: { label: string; value: string }[] = [
      { label: 'Standort', value: `${st.ort} · KST ${st.kst} · Adress-Nr. ${st.adressNr}` },
      { label: 'DL-Leitung', value: st.ansprechpartner },
      { label: 'Ansprechpartner', value: v.ansprechpartner },
      { label: 'E-Mail', value: v.email },
      { label: 'Bauvorhaben', value: v.bauvorhaben },
      { label: 'Wasserquelle', value: labelOf(QUELLEN, v.wasserquelle) },
      { label: 'Wassermenge bei 2,5 bar', value: v.wassermenge },
      {
        label: 'Pumpe',
        value: v.pumpe === 'ja' ? `Vorhanden · ${(v.pumpenTyp ?? '').trim()}` : 'Nicht vorhanden',
      },
      { label: 'Zu bewässern', value: v.bereiche.map((b) => labelOf(BEREICHE, b)).join(' · ') },
      { label: 'Steuergerät', value: labelOf(STEUERGERAETE, v.steuergeraet) },
      ...((v.bemerkungen ?? '').trim()
        ? [{ label: 'Bemerkungen', value: (v.bemerkungen ?? '').trim() }]
        : []),
      { label: 'Anhänge', value: anhaenge.length ? anhaenge.join(' · ') : 'keine' },
    ];

    return (
      <section className="border-t border-mist bg-linen py-24 md:py-32">
        <div className="container max-w-4xl">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-forest text-linen">
            <Check aria-hidden className="h-5 w-5" />
          </span>
          <h2 className="h-display mt-8 text-4xl md:text-6xl">
            Anfrage <em className="italic">vollständig</em>.
          </h2>
          <p className="mt-6 max-w-2xl text-ink/70">
            Ihr Projekt <span className="font-medium">{v.bauvorhaben}</span> für den Standort{' '}
            <span className="font-medium">{st.ort}</span> liegt uns mit allen Angaben vor. Wir
            melden uns innerhalb von zwei Werktagen mit Auslegung und Stückliste — ohne
            Rückfragen zu Wassermenge, Pumpe oder Steuergerät.
          </p>
          <p className="mt-4 max-w-2xl text-ink/70">
            Die Anfrage geht an{' '}
            <a href={`mailto:${CONTACT.email}`} className="underline decoration-mist underline-offset-4 hover:decoration-ink">
              {CONTACT.email}
            </a>{' '}
            und wird dort unter Kundennummer <span className="num">{kundennummer}</span> geführt.
          </p>
          {!serverOk && <AnfrageFallback mailtoUrl={mailtoUrl} className="mt-6 max-w-2xl" />}

          <div className="mt-12 border-t border-mist">
            <p className="eyebrow mt-6">Übermittelte Angaben</p>
            <dl className="mt-6">
              {zusammenfassung.map((z) => (
                <div
                  key={z.label}
                  className="grid gap-1 border-b border-mist py-4 sm:grid-cols-12 sm:gap-6"
                >
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/55 sm:col-span-4">
                    {z.label}
                  </dt>
                  <dd className="min-w-0 break-words text-ink/85 sm:col-span-8">{z.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button variant="primary" size="lg" onClick={neuesProjekt}>
              Weiteres Projekt anmelden →
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a>
            </Button>
          </div>
          <p className="font-mono mt-8 text-[10px] uppercase tracking-[0.16em] text-ink/50">
            {serverOk
              ? 'Anfrage und Anhänge wurden übermittelt'
              : 'Bitte die vorbereitete Mail im Mailprogramm absenden — Anhänge dort anfügen'}
          </p>
        </div>
      </section>
    );
  }

  // --------------------------------------------------------------- Formular
  return (
    <section className="border-t border-mist bg-paper py-24 md:py-32">
      <div className="container max-w-5xl">
        {/* Bewusst nicht dieselbe Zeile wie die H1 im Kopf der Seite — sonst steht
            dieselbe Headline zweimal untereinander. */}
        <h2 className="h-display max-w-2xl text-balance text-4xl md:text-6xl">
          Angaben zum <em className="italic">Projekt</em>.
        </h2>
        <p className="mt-6 max-w-xl text-ink/70">
          Vier Abschnitte, zwei Minuten. Je vollständiger die Angaben, desto schneller kommt
          die Auslegung zurück.
        </p>

        <form
          onSubmit={handleSubmit(async (values) => {
            // Standort aus den abgeschickten Werten auflösen statt aus dem watch-Wert:
            // so bleibt der Erfolgsfall auch dann typsicher, wenn die Liste einmal
            // eine Kostenstelle nicht mehr kennt.
            const gewaehlt = STANDORTE.find((s) => s.kst === values.kst);
            if (!gewaehlt) return;
            // Pflichtfeld (Meeting 18.08.2026): ohne Projektplan geht nichts raus.
            if (dateien.length === 0) {
              setDateiFehler(true);
              document.getElementById('pk-dateien-block')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              return;
            }
            // Versand über Office 365: Projektpläne werden direkt angehängt.
            // Fallback: das Mailprogramm öffnet sich, dann bitte anhängen.
            const anhaenge = await Promise.all(dateien.map(dateiZuAnhang));
            const { ok, mailtoUrl: url } = await sendeAnfrage(
              `Pflanzenkölle-Projekt: ${gewaehlt.ort} (KST ${gewaehlt.kst})`,
              [
                'Projektanfrage Pflanzenkölle über die geschützte Projektseite',
                '',
                `Standort: ${gewaehlt.ort} · KST ${gewaehlt.kst} · Adress-Nr. ${gewaehlt.adressNr}`,
                kundennummer ? `Kundennummer: ${kundennummer}` : false,
                '',
                ...Object.entries(values)
                  .filter(([k, v]) => v && k !== 'kst')
                  .map(([k, v]) => `${k}: ${v}`),
                '',
                dateien.length
                  ? `Dateien: ${dateien.map((f) => f.name).join(', ')} (dieser Mail beigefügt — falls sich ein Mailfenster öffnet, bitte anhängen).`
                  : false,
              ],
              { replyTo: values.email, anhaenge }
            );
            setMailtoUrl(url);
            setServerOk(ok);
            setGesendet({ values, standort: gewaehlt, dateien: dateien.map((f) => f.name) });
          })}
          className="mt-16 space-y-12"
        >
          {/* I · Standort ------------------------------------------------- */}
          <section data-reveal className="grid gap-8 border-t border-mist pt-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h3 className="eyebrow" id="pk-standort-label">
                I · Standort
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-ink/60">
                Filiale auswählen — Kostenstelle und Adress-Nr. übernehmen wir automatisch für
                die Abrechnung.
              </p>
            </div>
            <div className="min-w-0 lg:col-span-8">
              {/* Kein fieldset: die Beschriftung steht in der linken Spalte, deshalb
                  wird die Schaltflächen-Gruppe per aria-labelledby daran gehängt. */}
              <div
                role="group"
                aria-labelledby="pk-standort-label"
                className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3"
              >
                {STANDORTE.map((s) => {
                  const active = kst === s.kst;
                  return (
                    <button
                      key={s.kst}
                      type="button"
                      data-cursor="hover"
                      aria-pressed={active}
                      onClick={() => setValue('kst', s.kst, { shouldValidate: true })}
                      className={cn(
                        'flex min-w-0 items-center justify-between gap-3 border px-4 py-3 text-left transition-all',
                        active
                          ? 'border-forest bg-forest text-linen'
                          : 'border-mist hover:border-ink/40'
                      )}
                    >
                      <span className="min-w-0">
                        <span className="font-display block truncate text-lg tracking-tight">
                          {s.ort}
                        </span>
                        <span
                          className={cn(
                            'num font-mono mt-0.5 block text-[10px] uppercase tracking-[0.14em]',
                            active ? 'text-linen/65' : 'text-ink/55'
                          )}
                        >
                          KST {s.kst}
                        </span>
                      </span>
                      {active && <Check aria-hidden className="h-4 w-4 shrink-0" />}
                    </button>
                  );
                })}
              </div>
              {errors.kst && <p className="mt-1 text-xs text-red-700">{errors.kst.message}</p>}

              {standort && (
                <div className="mt-6 border-l-2 border-copper/50 bg-linen/60 p-5">
                  <p className="eyebrow">Übernommen für die Abrechnung</p>
                  <dl className="mt-4 grid gap-5 sm:grid-cols-3">
                    <div className="min-w-0">
                      <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/55">
                        Kostenstelle
                      </dt>
                      <dd className="num font-display mt-1 text-3xl tracking-tight">
                        {standort.kst}
                      </dd>
                    </div>
                    <div className="min-w-0">
                      <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/55">
                        Adress-Nr.
                      </dt>
                      <dd className="num font-display mt-1 text-3xl tracking-tight">
                        {standort.adressNr}
                      </dd>
                    </div>
                    <div className="min-w-0">
                      <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/55">
                        DL-Leitung
                      </dt>
                      <dd className="font-display mt-1 text-xl leading-tight tracking-tight">
                        {standort.ansprechpartner}
                      </dd>
                    </div>
                  </dl>
                </div>
              )}
            </div>
          </section>

          {/* II · Projekt ------------------------------------------------- */}
          <section data-reveal className="grid gap-8 border-t border-mist pt-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h3 className="eyebrow">II · Projekt</h3>
              <p className="mt-4 text-sm leading-relaxed text-ink/60">
                Wer meldet das Projekt, und wie heißt es bei Ihnen im Haus?
              </p>
            </div>
            {/* min-w-0: die Eingabefelder haben eine intrinsische Mindestbreite,
                die sonst die Grid-Spalte über den Viewport hinaus aufzieht. */}
            <div className="min-w-0 lg:col-span-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="min-w-0">
                  <label className="eyebrow mb-2 block" htmlFor="pk-name">
                    Ansprechpartner / Name <span aria-hidden className="text-red-700">*</span>
                  </label>
                  <Input
                    id="pk-name"
                    placeholder="Vor- und Nachname"
                    {...register('ansprechpartner')}
                  />
                  {errors.ansprechpartner && (
                    <p className="mt-1 text-xs text-red-700">{errors.ansprechpartner.message}</p>
                  )}
                </div>
                <div className="min-w-0">
                  <label className="eyebrow mb-2 block" htmlFor="pk-email">
                    E-Mail <span aria-hidden className="text-red-700">*</span>
                  </label>
                  <Input
                    id="pk-email"
                    type="email"
                    placeholder="name@pflanzenkoelle.de"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-700">{errors.email.message}</p>
                  )}
                </div>
                <div className="min-w-0 sm:col-span-2">
                  <label className="eyebrow mb-2 block" htmlFor="pk-bauvorhaben">
                    Bauvorhaben · Projektbezeichnung
                  </label>
                  <Input
                    id="pk-bauvorhaben"
                    placeholder="z. B. Außengelände Staudenbeet Nord"
                    {...register('bauvorhaben')}
                  />
                  {errors.bauvorhaben && (
                    <p className="mt-1 text-xs text-red-700">{errors.bauvorhaben.message}</p>
                  )}
                </div>
              </div>

              <fieldset className="mt-10">
                <legend className="eyebrow mb-4">Was soll bewässert werden?</legend>
                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                  {BEREICHE.map((b) => (
                    <Kachel
                      key={b.value}
                      accent
                      active={(bereiche ?? []).includes(b.value)}
                      onClick={() => toggleBereich(b.value)}
                      title={b.label}
                      hint={b.hint}
                    />
                  ))}
                </div>
                <p className="font-mono mt-3 text-[10px] uppercase tracking-[0.16em] text-ink/50">
                  Mehrfachauswahl möglich
                </p>
                {errors.bereiche && (
                  <p className="mt-1 text-xs text-red-700">{errors.bereiche.message}</p>
                )}
              </fieldset>
            </div>
          </section>

          {/* III · Technik ------------------------------------------------ */}
          <section data-reveal className="grid gap-8 border-t border-mist pt-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h3 className="eyebrow">III · Technik</h3>
              <p className="mt-4 text-sm leading-relaxed text-ink/60">
                Wasserquelle, verfügbare Menge und Pumpe bestimmen die Zonenaufteilung. Ohne
                diese drei Angaben können wir nicht auslegen.
              </p>
            </div>
            <div className="min-w-0 lg:col-span-8">
              <fieldset>
                <legend className="eyebrow mb-4">Wasserquelle</legend>
                <div className="grid gap-2 sm:grid-cols-3">
                  {QUELLEN.map((q) => (
                    <Kachel
                      key={q.value}
                      active={wasserquelle === q.value}
                      onClick={() => setValue('wasserquelle', q.value, { shouldValidate: true })}
                      title={q.label}
                      hint={q.hint}
                    />
                  ))}
                </div>
                {errors.wasserquelle && (
                  <p className="mt-1 text-xs text-red-700">{errors.wasserquelle.message}</p>
                )}
              </fieldset>

              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                <div className="min-w-0">
                  <label className="eyebrow mb-2 block" htmlFor="pk-wassermenge">
                    Wassermenge bei 2,5 bar · m³/h oder l/min
                  </label>
                  <Input
                    id="pk-wassermenge"
                    placeholder="z. B. 3,2 m³/h oder 53 l/min"
                    {...register('wassermenge')}
                  />
                  {errors.wassermenge && (
                    <p className="mt-1 text-xs text-red-700">{errors.wassermenge.message}</p>
                  )}
                  <p className="font-mono mt-2 text-[10px] uppercase leading-relaxed tracking-[0.16em] text-ink/50">
                    Eimer-Methode: 10-Liter-Eimer, Zeit stoppen
                  </p>
                </div>

                <fieldset className="min-w-0">
                  <legend className="eyebrow mb-2">Pumpe vorhanden?</legend>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(['ja', 'nein'] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        data-cursor="hover"
                        aria-pressed={pumpe === p}
                        onClick={() => setValue('pumpe', p, { shouldValidate: true })}
                        className={cn(
                          'border px-6 py-2 text-sm transition-all',
                          pumpe === p
                            ? 'border-forest bg-forest text-linen'
                            : 'border-mist hover:border-ink/40'
                        )}
                      >
                        {p === 'ja' ? 'Ja' : 'Nein'}
                      </button>
                    ))}
                  </div>
                  {/* Das Typ-Feld erscheint erst bei „Ja“ — sonst steht ein
                      leeres Pflichtfeld im Weg. */}
                  {pumpe === 'ja' && (
                    <div className="mt-5">
                      <label className="eyebrow mb-2 block" htmlFor="pk-pumpentyp">
                        Pumpentyp
                      </label>
                      <Input
                        id="pk-pumpentyp"
                        placeholder="z. B. Pedrollo JSWm 2AX"
                        {...register('pumpenTyp')}
                      />
                      {errors.pumpenTyp && (
                        <p className="mt-1 text-xs text-red-700">{errors.pumpenTyp.message}</p>
                      )}
                    </div>
                  )}
                </fieldset>
              </div>

              <fieldset className="mt-10">
                <legend className="eyebrow mb-4">Gewünschtes Steuergerät</legend>
                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  {STEUERGERAETE.map((s) => (
                    <Kachel
                      key={s.value}
                      active={steuergeraet === s.value}
                      onClick={() => setValue('steuergeraet', s.value, { shouldValidate: true })}
                      title={s.label}
                      hint={s.hint}
                    />
                  ))}
                </div>
              </fieldset>
            </div>
          </section>

          {/* IV · Anhänge ------------------------------------------------- */}
          <section data-reveal className="grid gap-8 border-t border-mist pt-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h3 className="eyebrow">IV · Anhänge</h3>
              <p className="mt-4 text-sm leading-relaxed text-ink/60">
                Ohne Projektplan können wir nicht belastbar auslegen — der Plan ist
                deshalb Pflicht. Fotos helfen zusätzlich.
              </p>
            </div>
            <div className="min-w-0 lg:col-span-8" id="pk-dateien-block">
              <label
                htmlFor="pk-dateien"
                data-cursor="hover"
                className={`flex cursor-pointer items-center gap-4 border border-dashed px-6 py-8 transition-colors hover:border-ink/40 ${
                  dateiFehler ? 'border-red-700' : 'border-mist'
                }`}
              >
                <Paperclip aria-hidden className="h-5 w-5 shrink-0 text-moss" />
                <span className="min-w-0">
                  <span className="font-display block text-lg tracking-tight">
                    Projektplan anhängen <span aria-hidden className="text-red-700">*</span>
                  </span>
                  <span className="mt-1 block text-xs text-ink/55">
                    PDF, JPG oder PNG · Pflichtfeld
                  </span>
                  <span className="mt-1 block text-xs font-medium text-moss">
                    Neu: Sie können mehrere Dokumente auf einmal auswählen und hochladen.
                  </span>
                </span>
              </label>
              {dateiFehler && (
                <p className="mt-2 text-xs text-red-700">
                  Bitte hängen Sie mindestens einen Projektplan an — ohne Plan können wir
                  die Anfrage nicht bearbeiten.
                </p>
              )}
              {/* Server-Versand über Office 365 hängt die Dateien direkt an.
                  Nur wenn das nicht klappt, öffnet sich als Fallback das
                  Mailprogramm — dann müssen die Dateien von Hand angehängt werden. */}
              <p className="mt-2 text-xs text-ink/55">
                Die Dateien werden direkt mit der Anfrage übermittelt. Sollte sich
                ausnahmsweise ein Mailfenster öffnen, hängen Sie sie dort bitte an.
              </p>
              {/* TODO: Demo-Modus — es wird nichts hochgeladen, wir zeigen nur die
                  Dateinamen. Später Supabase Storage (Bucket „projektanhaenge“). */}
              <input
                id="pk-dateien"
                type="file"
                multiple
                accept="image/*,.pdf"
                className="sr-only"
                onChange={(e) => {
                  addDateien(e.target.files);
                  e.target.value = '';
                }}
              />

              {dateien.length > 0 && (
                <ul className="mt-5 space-y-2">
                  {dateien.map((d) => (
                    <li
                      key={d.name}
                      className="flex items-center justify-between gap-4 border-b border-mist pb-2"
                    >
                      <span className="min-w-0 truncate text-sm text-ink/80">{d.name}</span>
                      <button
                        type="button"
                        data-cursor="hover"
                        aria-label={`${d.name} entfernen`}
                        onClick={() => setDateien((cur) => cur.filter((n) => n.name !== d.name))}
                        className="shrink-0 text-ink/45 transition-colors hover:text-red-700"
                      >
                        <X aria-hidden className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-10">
                <label className="eyebrow mb-2 block" htmlFor="pk-bemerkungen">
                  Bemerkungen
                </label>
                <Textarea
                  id="pk-bemerkungen"
                  rows={5}
                  placeholder="Besonderheiten, Termine, bestehende Anlage, Ansprechpartner vor Ort …"
                  {...register('bemerkungen')}
                />
              </div>
            </div>
          </section>

          {/* Absenden ----------------------------------------------------- */}
          <div className="border-t border-mist pt-10">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
                Projektanfrage senden →
              </Button>
              <p className="font-mono max-w-md text-[10px] uppercase leading-relaxed tracking-[0.16em] text-ink/50">
                Die Anfrage geht an {CONTACT.email} · Kundennummer{' '}
                <span className="num">{kundennummer}</span>
              </p>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
