# TODO - Plateforme Dr.Tri

Checklist operationnelle pour lancer et livrer le MVP.

---

## Phase 0 - Cadrage rapide

- [ ] Valider le scope MVP (pas de features hors MVP)
- [ ] Confirmer les roles: `client`, `admin`
- [ ] Confirmer les statuts de demande (du `draft` a `paid`)
- [ ] Valider la liste des pages publiques/client/admin
- [ ] Valider choix email transactionnel: `Resend` ou `Postmark`

---

## Phase 1 - Setup technique (Semaine 1)

### 1.1 Initialisation projet

- [ ] Initialiser le projet Next.js (App Router, TypeScript)
- [ ] Installer et configurer Supabase client/server
- [ ] Creer le fichier `.env.local` avec variables minimales
- [ ] Mettre en place un layout propre pour public, app client, admin

### 1.2 Authentification de base

- [ ] Implementer `/login` et `/register`
- [ ] Brancher Supabase Auth (sign up / sign in / sign out)
- [ ] Ajouter gestion de session (middleware ou protection serveur)
- [ ] Verifier redirections selon authentification

### 1.3 Roles et profils

- [ ] Creer table `profiles` (1:1 avec user auth)
- [ ] Ajouter champ `role` (`client` par defaut, `admin` manuel)
- [ ] Auto-creer le profil a l'inscription
- [ ] Afficher role dans une page de debug interne

---

## Phase 2 - Base de donnees + securite (Semaine 1-2)

### 2.1 Schema minimal

- [ ] Creer tables:
  - [ ] `profiles`
  - [ ] `addresses`
  - [ ] `requests`
  - [ ] `request_items`
  - [ ] `attachments`
  - [ ] `messages`
  - [ ] `quotes`
  - [ ] `invoices`
  - [ ] `subscriptions`
  - [ ] `appointments`
- [ ] Ajouter indexes utiles (`user_id`, `request_id`, `created_at`)
- [ ] Ajouter enums necessaires (`request_status`, `frequency`, etc.)

### 2.2 RLS et permissions

- [ ] Activer RLS sur toutes les tables sensibles
- [ ] Policy client: lecture/ecriture sur ses propres donnees
- [ ] Policy admin: acces complet
- [ ] Verifier que les jointures ne contournent pas les policies
- [ ] Tester les policies avec un compte client et un compte admin

### 2.3 Storage prive

- [ ] Creer bucket prive pour photos/documents
- [ ] Restreindre acces direct public
- [ ] Servir les fichiers via URL signees uniquement

---

## Phase 3 - Flux demandes de service (Semaine 2-3)

### 3.1 Wizard client `/app/demandes/nouvelle`

- [ ] Etape 1: type de service
- [ ] Etape 2: adresse
- [ ] Etape 3: details (inventaire, volume, notes)
- [ ] Etape 4: upload photos
- [ ] Etape 5: date souhaitee
- [ ] Etape 6: recap + envoi

### 3.2 Gestion statuts

- [ ] Ajouter workflow de statuts:
  - [ ] `draft`
  - [ ] `submitted`
  - [ ] `need_info`
  - [ ] `estimating`
  - [ ] `quote_sent`
  - [ ] `accepted`
  - [ ] `scheduled`
  - [ ] `in_progress`
  - [ ] `done`
  - [ ] `invoiced`
  - [ ] `paid`
  - [ ] `canceled`
- [ ] Journaliser les changements de statut

### 3.3 Ecrans client

- [ ] `/app/demandes` liste des demandes
- [ ] `/app` dashboard simple (resume des demandes)
- [ ] `/app/planning` interventions a venir

---

## Phase 4 - Interface administrateur (Semaine 3-4)

- [ ] `/admin` dashboard operationnel
- [ ] `/admin/demandes` liste + filtres par statut
- [ ] `/admin/demandes/[id]` detail complet + pieces jointes
- [ ] `/admin/planning` vue interventions
- [ ] `/admin/clients` fiche client + historique demandes
- [ ] `/admin/services` gestion catalogue/tarifs
- [ ] Verifier blocage d'acces admin si role != admin

---

## Phase 5 - Messagerie + documents (Semaine 4)

### 5.1 Messagerie

- [ ] Conversation par demande (client/admin)
- [ ] Envoi message texte
- [ ] Ajout de pieces jointes
- [ ] Affichage chronologique propre

### 5.2 Documents

- [ ] Table `quotes` + affichage client/admin
- [ ] Table `invoices` + affichage client/admin
- [ ] Ecran `/app/documents` cote client
- [ ] Ecran `/admin/facturation` cote admin

---

## Phase 6 - Abonnements Stripe (Semaine 5)

### 6.1 Souscription

- [ ] Ecran `/app/abonnement` avec choix frequence
- [ ] Checkout Stripe pour abonnement
- [ ] Stockage:
  - [ ] `stripe_customer_id`
  - [ ] `stripe_subscription_id`
  - [ ] `status`
  - [ ] `frequency`
  - [ ] `next_pickup_date`
  - [ ] `paused_until`
  - [ ] `address_id`

### 6.2 Webhooks

- [ ] Endpoint webhooks securise (signature Stripe)
- [ ] Gerer evenements:
  - [ ] `checkout.session.completed`
  - [ ] `customer.subscription.created`
  - [ ] `customer.subscription.updated`
  - [ ] `customer.subscription.deleted`
  - [ ] `invoice.paid`
  - [ ] `invoice.payment_failed`
- [ ] Synchroniser DB a chaque evenement

### 6.3 Customer Portal

- [ ] Bouton "Gerer mon abonnement"
- [ ] Lien vers Stripe Customer Portal
- [ ] Retour utilisateur apres session portal

---

## Phase 7 - Emails transactionnels (Semaine 5-6)

- [ ] Configurer provider (`Resend` ou `Postmark`)
- [ ] Templates minimum:
  - [ ] confirmation de demande envoyee
  - [ ] statut de demande mis a jour
  - [ ] devis disponible
  - [ ] facture disponible
  - [ ] paiement reussi / echoue
- [ ] Ajouter retries et logs en cas d'echec

---

## Phase 8 - Qualite, securite, stabilisation (Semaine 6)

- [ ] Validation stricte des entrees (schema)
- [ ] Gestion d'erreurs utilisateur claire
- [ ] Rate limiting sur routes sensibles
- [ ] Verification permissions sur toutes les actions critiques
- [ ] Tests des flux principaux:
  - [ ] auth client/admin
  - [ ] creation demande
  - [ ] traitement admin
  - [ ] abonnement Stripe
- [ ] Monitoring erreurs (logs backend + front)

---

## Definition of Done (MVP)

- [ ] Un client peut s'inscrire/se connecter et acceder a son espace
- [ ] Un client peut creer, suivre et discuter sur une demande
- [ ] Un admin peut traiter toutes les demandes et planifier
- [ ] Les devis/factures sont visibles cote client et admin
- [ ] Les abonnements Stripe sont actifs et synchronises
- [ ] Les policies RLS protegent toutes les donnees sensibles
- [ ] L'application est deployable avec configuration prod

---

## Backlog post-MVP (plus tard)

- [ ] Notifications en temps reel
- [ ] Tableau KPI admin (chiffre d'affaires, conversion devis)
- [ ] Historique complet des actions admin (audit log)
- [ ] Multi-langue FR/EN
- [ ] Automatisation avancee planning et optimisation trajets

