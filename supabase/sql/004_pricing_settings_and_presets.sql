-- Pricing configuration (CHF) for admin.

create table if not exists public.app_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

insert into public.app_settings(key, value)
values
  ('depot_address', 'Lausanne, Suisse'),
  ('employee_hourly_rate', '60'),
  ('kilometer_rate', '2.2')
on conflict (key) do nothing;

alter table public.app_settings enable row level security;

drop policy if exists app_settings_select_authenticated on public.app_settings;
create policy app_settings_select_authenticated
on public.app_settings for select
using (auth.role() = 'authenticated');

drop policy if exists app_settings_write_admin on public.app_settings;
create policy app_settings_write_admin
on public.app_settings for all
using (public.is_admin())
with check (public.is_admin());
