-- Fix recursion between requests and appointments RLS policies.
-- Run this in Supabase SQL Editor on existing projects.

drop policy if exists requests_select_own_admin_tech on public.requests;
drop policy if exists requests_select_own_or_admin on public.requests;
create policy requests_select_own_or_admin
on public.requests for select
using (
  client_id = auth.uid()
  or public.is_admin()
);

drop policy if exists appointments_select_related on public.appointments;
drop policy if exists appointments_select_admin_or_technician on public.appointments;
create policy appointments_select_admin_or_technician
on public.appointments for select
using (
  public.is_admin()
  or technician_id = auth.uid()
);
