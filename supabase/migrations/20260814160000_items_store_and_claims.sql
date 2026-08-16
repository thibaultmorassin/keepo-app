-- Add store and soft-delete columns to items
alter table public.items
  add column if not exists store text,
  add column if not exists deleted boolean not null default false;

-- Claims table
create table if not exists public.claims (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  item_id uuid not null references public.items (id) on delete cascade,
  issue_group text not null check (
    issue_group in ('Panne', 'Dommage accidentel', 'Livraison ou pièce')
  ),
  issue text not null,
  since text not null,
  description text not null,
  recipient text not null check (
    recipient in ('Le vendeur', 'Le fabricant')
  ),
  tone text not null check (
    tone in ('Chaleureux', 'Neutre', 'Ferme')
  ),
  message text not null,
  sent_at timestamptz,
  follow_up_at timestamptz,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted boolean not null default false
);

create index if not exists claims_user_id_idx on public.claims (user_id);
create index if not exists claims_item_id_idx on public.claims (item_id);
create index if not exists claims_open_idx on public.claims (user_id) where resolved_at is null;

-- Timestamp trigger function
create or replace function public.handle_times()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    new.created_at := coalesce(new.created_at, now());
    new.updated_at := coalesce(new.updated_at, now());
  elsif tg_op = 'UPDATE' then
    new.created_at := old.created_at;
    new.updated_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists handle_times on public.items;
create trigger handle_times
  before insert or update on public.items
  for each row
  execute function public.handle_times();

drop trigger if exists handle_times on public.claims;
create trigger handle_times
  before insert or update on public.claims
  for each row
  execute function public.handle_times();

-- RLS on claims
alter table public.claims enable row level security;

create policy "claims_select_own"
  on public.claims for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "claims_insert_own"
  on public.claims for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "claims_update_own"
  on public.claims for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "claims_delete_own"
  on public.claims for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- Data API access
grant select, insert, update, delete on public.claims to authenticated;

-- Realtime
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'items'
  ) then
    alter publication supabase_realtime add table public.items;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'claims'
  ) then
    alter publication supabase_realtime add table public.claims;
  end if;
end $$;
