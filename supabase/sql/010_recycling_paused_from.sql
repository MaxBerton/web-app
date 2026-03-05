-- Migration 010 : date de suspension (paused_from) et reprise optionnelle (paused_until nullable)

alter table public.subscriptions
  add column if not exists paused_from date;

comment on column public.subscriptions.paused_from is 'Date à partir de laquelle le service recyclage est suspendu';
comment on column public.subscriptions.paused_until is 'Date à laquelle reprendre le service (optionnel)';
