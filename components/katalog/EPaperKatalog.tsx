'use client';

import { useState } from 'react';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import { Eyebrow } from '@/components/Eyebrow';
import { Button } from '@/components/ui/button';
import { KATALOG_EPAPER_URL } from '@/lib/links';

/**
 * Der gedruckte Preiskatalog als Blätterkatalog.
 *
 * Bewusst NICHT als PDF: die Originaldatei wiegt rund 14 MB und würde die Seite
 * bei schwacher Verbindung ausbremsen — genau das Problem, das im Termin am
 * 31.07.2026 besprochen wurde. Das E-Paper liegt beim Anbieter und wird erst
 * geladen, wenn jemand es wirklich öffnet: bis zum Klick steht hier nur eine
 * leichte Vorschaufläche, kein iframe.
 */
export function EPaperKatalog() {
  const [geoeffnet, setGeoeffnet] = useState(false);

  return (
    <section className="border-t border-mist bg-linen py-24 md:py-32">
      <div className="container">
        <div data-reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow number="P">Preiskatalog</Eyebrow>
            <h2 className="h-display mt-6 max-w-2xl text-balance text-4xl md:text-5xl">
              Der komplette Katalog zum <em className="italic">Durchblättern</em>.
            </h2>
            <p className="mt-6 max-w-xl text-ink/70">
              Preiskatalog 2025/26 mit dem vollständigen Sortiment — Bewässerung,
              Pumpentechnik, Beleuchtung, Teichtechnik und Robotik. Seite für Seite wie
              im gedruckten Heft, nur immer aktuell.
            </p>
          </div>
          <Button asChild variant="outline">
            <a href={KATALOG_EPAPER_URL} target="_blank" rel="noopener noreferrer">
              In neuem Fenster öffnen <ArrowUpRight className="h-4 w-4" />
            </a>
          </Button>
        </div>

        <div className="mt-12 overflow-hidden border border-mist bg-paper">
          {geoeffnet ? (
            <iframe
              src={KATALOG_EPAPER_URL}
              title="Green-Gard Preiskatalog 2025/26 zum Durchblättern"
              loading="lazy"
              allowFullScreen
              className="h-[70vh] min-h-[480px] w-full border-0"
            />
          ) : (
            <button
              type="button"
              data-cursor="hover"
              onClick={() => setGeoeffnet(true)}
              className="group flex h-[52vh] min-h-[360px] w-full flex-col items-center justify-center gap-5 bg-paper transition-colors hover:bg-linen/60"
              aria-label="Blätterkatalog laden und öffnen"
            >
              <span className="grid h-16 w-16 place-items-center rounded-full bg-forest text-linen transition-transform group-hover:scale-105">
                <BookOpen className="h-6 w-6" />
              </span>
              <span className="text-center">
                <span className="font-display block text-2xl tracking-tight">
                  Katalog öffnen
                </span>
                <span className="font-mono mt-2 block text-[10px] uppercase tracking-[0.18em] text-ink/50">
                  Lädt erst auf Klick · schont mobile Datenverbindungen
                </span>
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
