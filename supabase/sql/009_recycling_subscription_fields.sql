-- Migration 009 : champs recyclage sur subscriptions + historique des collectes

-- Colonnes recyclage sur subscriptions (client_id = user_id)
alter table public.subscriptions
  add column if not exists passes_per_month smallint not null default 1 check (passes_per_month between 1 and 4),
  add column if not exists bins_count smallint not null default 6 check (bins_count >= 1 and bins_count <= 20),
  add column if not exists large_bins_count smallint not null default 0 check (large_bins_count >= 0),
  add column if not exists price_cents integer;

comment on column public.subscriptions.passes_per_month is 'Nombre de passages par mois (1 à 4)';
comment on column public.subscriptions.bins_count is 'Nombre de p''tits bacs (37L)';
comment on column public.subscriptions.large_bins_count is 'Nombre de grands bacs (60L), option +2 CHF';
comment on column public.subscriptions.price_cents is 'Prix mensuel en centimes CHF';

-- Historique des collectes (pour afficher "12 mars — collecte effectuée")
create table if not exists public.subscription_pickups (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references public.subscriptions(id) on delete cascade,
  pickup_date date not null,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (subscription_id, pickup_date)
);

create index if not exists idx_subscription_pickups_subscription_id on public.subscription_pickups(subscription_id);
create index if not exists idx_subscription_pickups_pickup_date on public.subscription_pickups(pickup_date);

alter table public.subscription_pickups enable row level security;

drop policy if exists subscription_pickups_select_owner_or_admin on public.subscription_pickups;
create policy subscription_pickups_select_owner_or_admin
on public.subscription_pickups for select
using (
  exists (
    select 1 from public.subscriptions s
    where s.id = subscription_pickups.subscription_id
    and (s.client_id = auth.uid() or public.is_admin())
  )
);

drop policy if exists subscription_pickups_insert_update_admin on public.subscription_pickups;
create policy subscription_pickups_insert_update_admin
on public.subscription_pickups for all
using (public.is_admin())
with check (public.is_admin());
