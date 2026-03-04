-- Store first_name and last_name from signup in profiles (from auth.users.raw_user_meta_data).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role, first_name, last_name)
  values (
    new.id,
    new.email,
    'client',
    nullif(trim(new.raw_user_meta_data->>'first_name'), ''),
    nullif(trim(new.raw_user_meta_data->>'last_name'), '')
  )
  on conflict (id) do update set
    email = excluded.email,
    first_name = coalesce(nullif(trim(excluded.first_name), ''), profiles.first_name),
    last_name = coalesce(nullif(trim(excluded.last_name), ''), profiles.last_name);
  return new;
end;
$$;
