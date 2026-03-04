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

- Bucket expected for attachments: `request-attachments`
- Private files are accessed via signed URLs
