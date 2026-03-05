# Dr.Tri Web App - Next.js Skeleton

## Stack

- Next.js (App Router)
- Supabase (Auth, DB, Storage)
- Stripe (integration to add in next phase)

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

```bash
cp .env.example .env.local
```

3. Run development server:

```bash
npm run dev
```

## Implemented skeleton (V1 start)

- Route groups:
  - `app/(public)` public website
  - `app/(app)` client area (`/app/*`)
  - `app/(admin)` admin area (`/admin/*`)
- Guards:
  - middleware protection on `/app/*` and `/admin/*`
  - admin role check through `profiles.role`
- Core pages:
  - client dashboard and request flow
  - admin request pipeline and detail page
- Quality baseline:
  - loading states
  - empty states
  - error boundary

## Notes

- **Mapbox (adresses)** : les formulaires d’adresse utilisent l’autocomplete Mapbox. Définir `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` dans `.env.local` (clé publique Mapbox, utilisée côté client pour le géocodage). Créer un token sur [Mapbox](https://account.mapbox.com/access-tokens/) avec les scopes nécessaires pour l’API Geocoding.
- Bucket expected for attachments: `request-attachments`
- Private files are accessed via signed URLs

### Confirmation email

Pour que le lien « Confirmer mon email » ouvre la page dédiée après confirmation :

1. **Supabase** → Authentication → URL Configuration : ajouter dans **Redirect URLs** l’URL `https://votre-domaine/auth/confirm` (et en dev `http://localhost:3000/auth/confirm`).
2. **Supabase** → Authentication → Email Templates → **Confirm signup** : remplacer le lien par  
   `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email`  
   (par ex. dans le template :  
   `<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">Confirmer mon email</a>`).
