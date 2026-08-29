-- Receipt storage: a private bucket plus the item_documents write path.
-- Objects live at {user_id}/{item_id}/{filename} so ownership is readable
-- straight off the object path.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'receipts',
  'receipts',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/heic', 'image/webp', 'application/pdf']
)
on conflict (id) do nothing;

drop policy if exists "receipts_select_own" on storage.objects;
create policy "receipts_select_own"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'receipts'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "receipts_insert_own" on storage.objects;
create policy "receipts_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'receipts'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "receipts_update_own" on storage.objects;
create policy "receipts_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'receipts'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'receipts'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "receipts_delete_own" on storage.objects;
create policy "receipts_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'receipts'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- item_documents was created directly on the remote project, so everything
-- below is written defensively.
create index if not exists item_documents_item_id_idx
  on public.item_documents (item_id);

alter table public.item_documents enable row level security;

drop policy if exists "item_documents_select_own" on public.item_documents;
create policy "item_documents_select_own"
  on public.item_documents for select
  to authenticated
  using (
    exists (
      select 1 from public.items i
      where i.id = item_id and i.user_id = (select auth.uid())
    )
  );

drop policy if exists "item_documents_insert_own" on public.item_documents;
create policy "item_documents_insert_own"
  on public.item_documents for insert
  to authenticated
  with check (
    exists (
      select 1 from public.items i
      where i.id = item_id and i.user_id = (select auth.uid())
    )
  );

drop policy if exists "item_documents_delete_own" on public.item_documents;
create policy "item_documents_delete_own"
  on public.item_documents for delete
  to authenticated
  using (
    exists (
      select 1 from public.items i
      where i.id = item_id and i.user_id = (select auth.uid())
    )
  );

grant select, insert, delete on public.item_documents to authenticated;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'item_documents'
  ) then
    alter publication supabase_realtime add table public.item_documents;
  end if;
end $$;
