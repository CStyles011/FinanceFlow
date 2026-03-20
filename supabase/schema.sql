create table if not exists public.finance_records (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.finance_records enable row level security;

create policy "Users can read own finance record"
on public.finance_records
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own finance record"
on public.finance_records
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own finance record"
on public.finance_records
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create or replace function public.handle_finance_records_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists finance_records_set_updated_at on public.finance_records;

create trigger finance_records_set_updated_at
before update on public.finance_records
for each row
execute function public.handle_finance_records_updated_at();
