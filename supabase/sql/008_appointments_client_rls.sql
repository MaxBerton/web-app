-- Migration 008 : permettre aux clients de lire leurs propres rendez-vous
-- (via request_id → requests.client_id = auth.uid())

drop policy if exists appointments_select_admin_or_technician on public.appointments;
create policy appointments_select_related
on public.appointments for select
using (
  public.is_admin()
  or technician_id = auth.uid()
  or exists (
    select 1
    from public.requests r
    where r.id = appointments.request_id
    and r.client_id = auth.uid()
  )
);
