import type { Category } from '@/lib/data';

/**
 * Steckbrief einer Disziplin: Einleitung, Vorteile und Themenblöcke.
 *
 * Die Inhalte stammen von den Kategorieseiten auf green-gard.de und lagen bisher
 * nur dort. Sie erscheinen, sobald im Sortiment eine Disziplin gewählt ist —
 * dann steht der Fachtext über den Artikeln, statt in einer eigenen Unterseite
 * zu verschwinden.
 */
export function DisziplinSteckbrief({ kategorie }: { kategorie: Category }) {
  const { intro, vorteile = [], themen = [] } = kategorie;
  if (!intro && !vorteile.length && !themen.length) return null;

  return (
    <section
      aria-label={`Über ${kategorie.name}`}
      className="mb-14 border-y border-mist bg-linen/50 py-10"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-moss">
        {kategorie.roman} · {kategorie.name}
      </p>

      {intro && (
        <p className="h-display mt-4 max-w-3xl text-balance text-2xl leading-snug md:text-3xl">
          {intro}
        </p>
      )}

      <div className="mt-8 grid gap-10 md:grid-cols-12">
        {vorteile.length > 0 && (
          <div className="md:col-span-5">
            <p className="eyebrow mb-4">Ihre Vorteile</p>
            <ul className="space-y-2.5">
              {vorteile.map((v) => (
                <li key={v} className="flex gap-3 text-sm leading-relaxed text-ink/75">
                  <span aria-hidden className="mt-[0.6rem] h-px w-4 shrink-0 bg-moss/60" />
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {themen.length > 0 && (
          <div className="grid gap-8 md:col-span-7 md:grid-cols-2">
            {themen.map((t) => (
              <div key={t.title} className="min-w-0">
                <h3 className="font-display text-lg tracking-tight">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{t.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
