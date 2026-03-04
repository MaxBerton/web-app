-- Switch pricing to CHF and remove quote presets module.

-- 1) Quote/Invoice currency defaults
alter table if exists public.quotes alter column currency set default 'chf';
alter table if exists public.invoices alter column currency set default 'chf';

update public.quotes set currency = 'chf' where currency is null or lower(currency) = 'eur';
update public.invoices set currency = 'chf' where currency is null or lower(currency) = 'eur';

-- 2) Pricing settings defaults for Switzerland
insert into public.app_settings(key, value)
values
  ('depot_address', 'Lausanne, Suisse'),
  ('employee_hourly_rate', '60'),
  ('kilometer_rate', '2.2')
on conflict (key) do update set value = excluded.value;

-- 3) Remove quote presets table and policies (feature dropped)
drop policy if exists quote_presets_select_authenticated on public.quote_presets;
drop policy if exists quote_presets_write_admin on public.quote_presets;
drop table if exists public.quote_presets;
