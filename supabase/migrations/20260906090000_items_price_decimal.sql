-- `items.price` was created directly on the remote project (like
-- `item_documents`, see 20260828120000_receipts_storage.sql), and it turned
-- out to be an integer column — a 99.99€ purchase got silently rounded to
-- 100 on write. Widen it to store cents accurately; harmless if it's already
-- numeric.
alter table public.items
  alter column price type numeric(10, 2) using price::numeric(10, 2);
