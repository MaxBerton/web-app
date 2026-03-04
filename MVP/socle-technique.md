1.1 Schéma minimal

Auth Supabase (email/password + magic link si tu veux)

Table public.profiles 1:1 avec auth.users

Colonne role (client / admin)

SQL (Supabase SQL editor) :

-- 1) Enum role
do $$ begin
  create type public.user_role as enum ('client', 'admin');
exception
  when duplicate_object then null;
end $$;

-- 2) Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  role public.user_role not null default 'client',
  created_at timestamptz not null default now()
);

-- 3) Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
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
2) Supabase — RLS partout (vraiment partout)
2.1 Activer RLS + policies sur profiles
alter table public.profiles enable row level security;

-- Le user peut lire son profil
create policy "profiles_select_own"
on public.profiles for select
using (id = auth.uid());

-- Le user peut update son profil (optionnel) - souvent tu limites à certains champs
create policy "profiles_update_own"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

-- Personne ne crée directement (création via trigger)
revoke insert on public.profiles from anon, authenticated;
2.2 Pattern RLS recommandé pour toutes tes tables “métier”

Règle d’or :

chaque enregistrement “client” doit avoir un client_id uuid (ou owner_id) = auth.uid()

policy select/update/delete : client_id = auth.uid()

admin bypass via une fonction “is_admin()” (simple, propre, réutilisable)

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

Exemple table requests :

create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'new',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.requests enable row level security;

create policy "requests_select_own_or_admin"
on public.requests for select
using (client_id = auth.uid() or public.is_admin());

create policy "requests_insert_own"
on public.requests for insert
with check (client_id = auth.uid());

create policy "requests_update_own_or_admin"
on public.requests for update
using (client_id = auth.uid() or public.is_admin())
with check (client_id = auth.uid() or public.is_admin());

create policy "requests_delete_admin_only"
on public.requests for delete
using (public.is_admin());
3) Next.js App Router — structure propre (app vs admin)

Structure conseillée :

app/(app)/... → zone client connectée

app/admin/... → zone admin

app/login/page.tsx → auth

middleware.ts → garde centralisée

Exemple :

app/
  (public)/
    page.tsx
    login/page.tsx
  (app)/
    layout.tsx
    dashboard/page.tsx
  admin/
    layout.tsx
    page.tsx
middleware.ts
4) Next.js + Supabase Auth (cookies SSR) + Middleware Guards
4.1 Dépendances

@supabase/supabase-js

@supabase/ssr

4.2 Middleware middleware.ts

Objectif :

/app/* (ou /(app)/*) → auth required

/admin/* → auth + role admin

Exemple (pattern standard SSR cookies) :

// middleware.ts
import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(req: NextRequest) {
  let res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) => res.cookies.set(name, value, options))
        }
      }
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const pathname = req.nextUrl.pathname

  const isClientArea = pathname.startsWith("/app") || pathname.startsWith("/dashboard") // adapte
  const isAdminArea = pathname.startsWith("/admin")

  // Guard: zone client
  if ((isClientArea || isAdminArea) && !user) {
    const url = req.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("next", pathname)
    return NextResponse.redirect(url)
  }

  // Guard: zone admin
  if (isAdminArea && user) {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (error || profile?.role !== "admin") {
      const url = req.nextUrl.clone()
      url.pathname = "/app" // ou "/"
      return NextResponse.redirect(url)
    }
  }

  return res
}

export const config = {
  matcher: ["/app/:path*", "/admin/:path*"]
}

Point critique : le check admin doit interroger profiles en DB (pas du “client state”), sinon contournable.

5) Guards côté Server Components / Server Actions (anti-bypass)

Le middleware protège la navigation, mais tu dois aussi protéger les actions (create/update) côté serveur.

Pattern :

dans chaque server action admin, re-check is_admin() via query profiles

et surtout : RLS fait foi (même si tu te plantes en code)

6) Checklist “tu es safe”

 profiles auto-créée à l’inscription

 role géré uniquement par admin (pas d’update libre côté client)

 RLS activé sur toutes les tables métier

 policies “own data” + “admin bypass” via is_admin()

 middleware matchers OK

 re-check côté server actions

 aucun secret Supabase côté client (anon key OK, service role ONLY côté serveur si besoin backoffice système)