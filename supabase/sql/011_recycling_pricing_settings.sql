-- Tarification recyclage configurable (tarifs des passages en CHF)

insert into public.app_settings(key, value)
values
  ('recycling_pass_1', '20'),
  ('recycling_pass_2', '35'),
  ('recycling_pass_3', '48'),
  ('recycling_pass_4', '60'),
  ('recycling_extra_bins_per_2_chf', '3'),
  ('recycling_large_bin_chf', '2')
on conflict (key) do nothing;
