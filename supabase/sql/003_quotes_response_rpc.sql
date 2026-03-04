-- Client quote response workflow.
-- Allows authenticated clients to accept/refuse their own quotes safely.

create or replace function public.respond_to_quote(p_quote_id uuid, p_decision text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_request_id uuid;
  v_client_id uuid;
begin
  if p_decision not in ('accepted', 'refused') then
    raise exception 'Invalid decision value';
  end if;

  select q.request_id, r.client_id
  into v_request_id, v_client_id
  from public.quotes q
  join public.requests r on r.id = q.request_id
  where q.id = p_quote_id
  for update;

  if v_request_id is null then
    raise exception 'Quote not found';
  end if;

  if v_client_id <> auth.uid() then
    raise exception 'Not allowed';
  end if;

  update public.quotes
  set status = p_decision
  where id = p_quote_id;

  update public.requests
  set status = case when p_decision = 'accepted' then 'accepted'::public.request_status else 'canceled'::public.request_status end
  where id = v_request_id;
end;
$$;

revoke all on function public.respond_to_quote(uuid, text) from public;
grant execute on function public.respond_to_quote(uuid, text) to authenticated;
