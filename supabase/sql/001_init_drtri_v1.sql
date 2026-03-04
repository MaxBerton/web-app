-- Dr.Tri V1 bootstrap (Supabase SQL Editor)
-- Creates schema, RLS policies, and private storage bucket.

create extension if not exists pgcrypto;

-- Enums
do $$
begin
  create type public.user_role as enum ('client', 'admin', 'technician');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.request_status as enum (
    'draft',
    'submitted',
    'need_info',
    'estimating',
    'quote_sent',
    'accepted',
    'scheduled',
    'in_progress',
    'done',
    'invoiced',
    'paid',
    'canceled'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.subscription_frequency as enum ('weekly', 'biweekly', 'monthly');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.subscription_status as enum ('active', 'paused', 'canceled', 'past_due');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.appointment_status as enum ('scheduled', 'in_progress', 'completed', 'canceled');
exception
  when duplicate_object then null;
end $$;

-- Core tables
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  role public.user_role not null default 'client',
  first_name text,
  last_name text,
  phone text,
  created_at timestamptz not null default now()
);

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  label text,
  street text not null,
  postal_code text,
  city text not null,
  country text not null default 'FR',
  created_at timestamptz not null default now()
);

create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  address_id uuid references public.addresses(id) on delete set null,
  type text not null,
  status public.request_status not null default 'draft',
  description text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.attachments (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.requests(id) on delete cascade,
  file_path text not null,
  uploaded_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.requests(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  status public.subscription_status not null default 'active',
  frequency public.subscription_frequency not null default 'monthly',
  next_pickup_date date,
  paused_until date,
  address_id uuid references public.addresses(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.requests(id) on delete cascade,
  technician_id uuid references public.profiles(id) on delete set null,
  scheduled_at timestamptz not null,
  status public.appointment_status not null default 'scheduled',
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.requests(id) on delete cascade,
  amount_cents integer not null check (amount_cents >= 0),
  currency text not null default 'eur',
  status text not null default 'draft',
  details text,
  created_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.requests(id) on delete cascade,
  amount_cents integer not null check (amount_cents >= 0),
  currency text not null default 'eur',
  status text not null default 'pending',
  stripe_invoice_id text,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_addresses_profile_id on public.addresses(profile_id);
create index if not exists idx_requests_client_id on public.requests(client_id);
create index if not exists idx_messages_request_id on public.messages(request_id);
create index if not exists idx_attachments_request_id on public.attachments(request_id);
create index if not exists idx_subscriptions_client_id on public.subscriptions(client_id);
create index if not exists idx_appointments_request_id on public.appointments(request_id);
create index if not exists idx_appointments_technician_id on public.appointments(technician_id);

-- Auth helpers
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

create or replace function public.is_technician()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid() and p.role = 'technician'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'client')
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.requests enable row level security;
alter table public.attachments enable row level security;
alter table public.messages enable row level security;
alter table public.subscriptions enable row level security;
alter table public.appointments enable row level security;
alter table public.quotes enable row level security;
alter table public.invoices enable row level security;

-- Profiles
drop policy if exists profiles_select_own_or_admin on public.profiles;
create policy profiles_select_own_or_admin
on public.profiles for select
using (id = auth.uid() or public.is_admin());

drop policy if exists profiles_update_own_or_admin on public.profiles;
create policy profiles_update_own_or_admin
on public.profiles for update
using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

-- addresses
drop policy if exists addresses_all_owner_or_admin on public.addresses;
create policy addresses_all_owner_or_admin
on public.addresses for all
using (profile_id = auth.uid() or public.is_admin())
with check (profile_id = auth.uid() or public.is_admin());

-- requests
drop policy if exists requests_select_own_admin_tech on public.requests;
create policy requests_select_own_admin_tech
on public.requests for select
using (
  client_id = auth.uid()
  or public.is_admin()
  or (
    public.is_technician()
    and exists (
      select 1 from public.appointments a
      where a.request_id = requests.id and a.technician_id = auth.uid()
    )
  )
);

drop policy if exists requests_insert_own_or_admin on public.requests;
create policy requests_insert_own_or_admin
on public.requests for insert
with check (client_id = auth.uid() or public.is_admin());

drop policy if exists requests_update_own_or_admin on public.requests;
create policy requests_update_own_or_admin
on public.requests for update
using (client_id = auth.uid() or public.is_admin())
with check (client_id = auth.uid() or public.is_admin());

drop policy if exists requests_delete_admin on public.requests;
create policy requests_delete_admin
on public.requests for delete
using (public.is_admin());

-- attachments
drop policy if exists attachments_select_owner_or_admin on public.attachments;
create policy attachments_select_owner_or_admin
on public.attachments for select
using (
  public.is_admin()
  or exists (
    select 1
    from public.requests r
    where r.id = attachments.request_id and r.client_id = auth.uid()
  )
  or (
    public.is_technician()
    and exists (
      select 1
      from public.appointments a
      where a.request_id = attachments.request_id and a.technician_id = auth.uid()
    )
  )
);

drop policy if exists attachments_insert_owner_or_admin on public.attachments;
create policy attachments_insert_owner_or_admin
on public.attachments for insert
with check (
  uploaded_by = auth.uid()
  and (
    public.is_admin()
    or exists (
      select 1
      from public.requests r
      where r.id = attachments.request_id and r.client_id = auth.uid()
    )
  )
);

drop policy if exists attachments_delete_owner_or_admin on public.attachments;
create policy attachments_delete_owner_or_admin
on public.attachments for delete
using (public.is_admin() or uploaded_by = auth.uid());

-- messages
drop policy if exists messages_select_related_or_admin on public.messages;
create policy messages_select_related_or_admin
on public.messages for select
using (
  public.is_admin()
  or exists (
    select 1
    from public.requests r
    where r.id = messages.request_id and r.client_id = auth.uid()
  )
  or (
    public.is_technician()
    and exists (
      select 1
      from public.appointments a
      where a.request_id = messages.request_id and a.technician_id = auth.uid()
    )
  )
);

drop policy if exists messages_insert_related_or_admin on public.messages;
create policy messages_insert_related_or_admin
on public.messages for insert
with check (
  sender_id = auth.uid()
  and (
    public.is_admin()
    or exists (
      select 1
      from public.requests r
      where r.id = messages.request_id and r.client_id = auth.uid()
    )
    or (
      public.is_technician()
      and exists (
        select 1
        from public.appointments a
        where a.request_id = messages.request_id and a.technician_id = auth.uid()
      )
    )
  )
);

-- subscriptions
drop policy if exists subscriptions_all_owner_or_admin on public.subscriptions;
create policy subscriptions_all_owner_or_admin
on public.subscriptions for all
using (client_id = auth.uid() or public.is_admin())
with check (client_id = auth.uid() or public.is_admin());

-- appointments
drop policy if exists appointments_select_related on public.appointments;
create policy appointments_select_related
on public.appointments for select
using (
  public.is_admin()
  or technician_id = auth.uid()
  or exists (
    select 1
    from public.requests r
    where r.id = appointments.request_id and r.client_id = auth.uid()
  )
);

drop policy if exists appointments_insert_update_admin on public.appointments;
create policy appointments_insert_update_admin
on public.appointments for all
using (public.is_admin())
with check (public.is_admin());

-- quotes
drop policy if exists quotes_select_related_or_admin on public.quotes;
create policy quotes_select_related_or_admin
on public.quotes for select
using (
  public.is_admin()
  or exists (
    select 1
    from public.requests r
    where r.id = quotes.request_id and r.client_id = auth.uid()
  )
);

drop policy if exists quotes_write_admin on public.quotes;
create policy quotes_write_admin
on public.quotes for all
using (public.is_admin())
with check (public.is_admin());

-- invoices
drop policy if exists invoices_select_related_or_admin on public.invoices;
create policy invoices_select_related_or_admin
on public.invoices for select
using (
  public.is_admin()
  or exists (
    select 1
    from public.requests r
    where r.id = invoices.request_id and r.client_id = auth.uid()
  )
);

drop policy if exists invoices_write_admin on public.invoices;
create policy invoices_write_admin
on public.invoices for all
using (public.is_admin())
with check (public.is_admin());

-- Private storage bucket
insert into storage.buckets (id, name, public)
values ('request-attachments', 'request-attachments', false)
on conflict (id) do nothing;

-- Storage policies (bucket-scoped)
drop policy if exists storage_select_request_attachments on storage.objects;
create policy storage_select_request_attachments
on storage.objects for select
using (
  bucket_id = 'request-attachments'
  and (
    public.is_admin()
    or owner = auth.uid()
  )
);

drop policy if exists storage_insert_request_attachments on storage.objects;
create policy storage_insert_request_attachments
on storage.objects for insert
with check (
  bucket_id = 'request-attachments'
  and owner = auth.uid()
);

drop policy if exists storage_delete_request_attachments on storage.objects;
create policy storage_delete_request_attachments
on storage.objects for delete
using (
  bucket_id = 'request-attachments'
  and (public.is_admin() or owner = auth.uid())
);
