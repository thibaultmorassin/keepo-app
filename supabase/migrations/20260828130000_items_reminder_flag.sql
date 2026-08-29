-- Per-item opt-out for the warranty-expiry reminder. The cadence itself
-- (profiles.reminder_days_before) stays a per-user setting; this column is
-- just "does this item participate".
alter table public.items
  add column if not exists reminder_enabled boolean not null default true;
