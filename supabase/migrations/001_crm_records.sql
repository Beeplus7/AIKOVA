-- Run in Supabase SQL editor for project vkegwslnabbgjucxxrmn when Management access is available.
-- CRM currently uses the VPS SQLite API; this schema is the cloud path.

create extension if not exists "pgcrypto";

create table if not exists public.crm_records (
  id uuid primary key default gen_random_uuid(),
  collection text not null,
  value jsonb not null default '{}'::jsonb,
  idempotency_key text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists crm_records_collection_idx on public.crm_records (collection);
create unique index if not exists crm_records_idempotency_idx
  on public.crm_records (collection, idempotency_key)
  where idempotency_key is not null;

alter table public.crm_records enable row level security;

create policy "authenticated read crm"
  on public.crm_records for select
  to authenticated
  using (true);

create policy "authenticated write crm"
  on public.crm_records for insert
  to authenticated
  with check (auth.uid() is not null);

create policy "authenticated update crm"
  on public.crm_records for update
  to authenticated
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

create policy "authenticated delete crm"
  on public.crm_records for delete
  to authenticated
  using (auth.uid() is not null);

-- Storage bucket `crm` already created via API for evidence uploads.
