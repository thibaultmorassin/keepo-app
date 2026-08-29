-- Account-level preferences surfaced on the Réglages (Settings) screen.
-- profiles itself predates the migration history (created out-of-band), so
-- this only ever adds columns defensively — never touches table creation.

alter table public.profiles
  add column if not exists claim_followup_reminders_enabled boolean not null default true,
  add column if not exists store_add_reminders_enabled boolean not null default false,
  add column if not exists app_news_enabled boolean not null default false;
