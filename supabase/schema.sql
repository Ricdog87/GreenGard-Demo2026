-- Green-Gard — Supabase-Schema (Vorbereitung, noch nicht deployed)
--
-- TODO: Supabase-Projekt anlegen, dieses Script im SQL-Editor ausführen,
-- danach RLS-Policies prüfen und die env vars aus .env.example setzen.
--
-- Rollenmodell:
--   anon          → darf ausschließlich Leads und Schulungsbuchungen INSERTen
--   authenticated → darf das eigene Profil lesen
--   service_role  → Backoffice (liest Leads, schaltet Profi-Accounts frei)

-- ---------------------------------------------------------------------------
-- leads: Konditionskatalog-Anfragen aus /profi
-- ---------------------------------------------------------------------------
create type gewerbe_art as enum ('galabau', 'installateur', 'fachhandel', 'sonstiges');

create table if not exists public.leads (
  id           uuid primary key default gen_random_uuid(),
  firma        text        not null,
  name         text        not null,
  email        text        not null,
  telefon      text        not null,
  gewerbe_art  gewerbe_art not null default 'sonstiges',
  bearbeitet   boolean     not null default false,
  created_at   timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);

alter table public.leads enable row level security;

-- Formular-Submits kommen anonym vom Client.
create policy "leads_insert_anon" on public.leads
  for insert to anon, authenticated with check (true);

-- Lesen nur fürs Backoffice (service_role umgeht RLS ohnehin) — kein anon-select.

-- ---------------------------------------------------------------------------
-- profiles: Kundentyp und Freischaltung für Profi-Konditionen
-- ---------------------------------------------------------------------------
create type kunden_typ as enum ('privat', 'profi');

create table if not exists public.profiles (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid        not null references auth.users (id) on delete cascade,
  typ             kunden_typ  not null default 'privat',
  firma           text,
  -- Netto-Konditionen erst nach manueller Prüfung durch Green-Gard.
  freigeschaltet  boolean     not null default false,
  created_at      timestamptz not null default now(),
  unique (user_id)
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select to authenticated using (auth.uid() = user_id);

create policy "profiles_update_own" on public.profiles
  for update to authenticated using (auth.uid() = user_id)
  -- Die Freischaltung darf sich niemand selbst setzen.
  with check (auth.uid() = user_id and freigeschaltet = false);

-- ---------------------------------------------------------------------------
-- schulung_buchungen: Platzbuchungen aus /beratung
-- ---------------------------------------------------------------------------
create table if not exists public.schulung_buchungen (
  id           uuid primary key default gen_random_uuid(),
  schulung     text        not null,
  termin       text        not null,
  name         text        not null,
  firma        text,
  email        text        not null,
  teilnehmer   integer     not null default 1 check (teilnehmer between 1 and 20),
  bezahlt      boolean     not null default false,
  -- TODO: Stripe Payment Link / Session-ID hier ablegen.
  stripe_ref   text,
  created_at   timestamptz not null default now()
);

create index if not exists schulung_buchungen_termin_idx on public.schulung_buchungen (termin);

alter table public.schulung_buchungen enable row level security;

create policy "schulung_buchungen_insert_anon" on public.schulung_buchungen
  for insert to anon, authenticated with check (true);
