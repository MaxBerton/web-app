# BRIEF PROJET - PLATEFORME DR.TRI

## 1) Contexte

Dr. Tri est une entreprise de services logistiques pour particuliers avec trois offres principales:

- Demenagement (transport de meubles et effets personnels)
- Installation (montage et installation de meubles)
- Debarras / evacuation (dechets, vidage de maison, demolition)

Promesse client:

> On transporte, on installe, on debarrasse.

La plateforme doit permettre aux clients de:

- creer des demandes de service,
- gerer un abonnement de collecte de dechets,
- suivre l'avancement de leurs demandes,
- communiquer avec l'entreprise,
- consulter devis et factures,
- gerer leurs paiements.

Le systeme inclut:

- un site public,
- un espace client,
- un tableau de bord administrateur personnalise.

Objectif technique global:

- application evolutive,
- architecture maintenable,
- securite forte.

---

## 2) Stack technique

### Frontend / Application

- Next.js (App Router)

### Backend / Donnees / Auth / Stockage

- Supabase (PostgreSQL + Auth + Storage)

### Paiements

- Stripe (abonnements avec paiement automatique)

### Emails transactionnels

- Resend ou Postmark

### Organisation du code

Un seul projet Next.js contient:

- site public,
- espace client,
- espace administrateur.

---

## 3) Structure des routes

## Site public

- `/` - Page d'accueil
- `/services` - Presentation generale des services
- `/services/demenagement` - Service de demenagement
- `/services/installation` - Montage et installation de meubles
- `/services/debarras` - Debarras, evacuation de dechets, vidage de maison
- `/tarifs` - Informations sur les prix et abonnements
- `/contact` - Formulaire de contact et demande de devis
- `/login` - Connexion
- `/register` - Creation de compte

## Espace client

- `/app` - Tableau de bord client
- `/app/demandes` - Liste des demandes du client
- `/app/demandes/nouvelle` - Creation d'une nouvelle demande (wizard)
- `/app/abonnement` - Gestion de l'abonnement de collecte
- `/app/planning` - Interventions a venir
- `/app/documents` - Devis et factures
- `/app/messages` - Messagerie avec l'entreprise
- `/app/profil` - Profil utilisateur et adresses

## Interface administrateur

- `/admin` - Tableau de bord administrateur
- `/admin/demandes` - Liste de toutes les demandes
- `/admin/demandes/[id]` - Detail d'une demande avec pieces jointes et conversation
- `/admin/planning` - Planification des interventions
- `/admin/clients` - Gestion des clients
- `/admin/abonnements` - Gestion des abonnements
- `/admin/facturation` - Gestion des devis et factures
- `/admin/services` - Catalogue des services et tarification
- `/admin/equipe` - Gestion des utilisateurs administrateurs

---

## 4) Fonctionnalites principales

## 4.1 Authentification

- Utiliser Supabase Auth.
- Deux roles:
  - `client`
  - `admin`
- Regles d'acces:
  - un client accede uniquement a ses propres donnees,
  - un admin accede a l'ensemble des donnees.

## 4.2 Demandes de service (wizard)

Etapes du parcours client:

1. Choisir le type de service:
   - Demenagement
   - Installation
   - Debarras
   - Demolition
2. Saisir l'adresse
3. Ajouter les informations:
   - inventaire,
   - volume estime,
   - notes
4. Ajouter des photos
5. Choisir une date souhaitee
6. Envoyer la demande

Statuts possibles d'une demande:

- `draft`
- `submitted`
- `need_info`
- `estimating`
- `quote_sent`
- `accepted`
- `scheduled`
- `in_progress`
- `done`
- `invoiced`
- `paid`
- `canceled`

## 4.3 Abonnement collecte de dechets

Frequences disponibles:

- chaque semaine
- toutes les deux semaines
- une fois par mois

Paiement automatique via Stripe.

Donnees minimales a stocker:

- `stripe_customer_id`
- `stripe_subscription_id`
- `status`
- `frequency`
- `next_pickup_date`
- `paused_until`
- `address_id`

## 4.4 Messagerie

Chaque demande dispose d'une conversation client <-> admin.

Un message peut contenir:

- texte
- pieces jointes

## 4.5 Documents

Documents accessibles pour client et admin:

- devis
- factures

---

## 5) Modele de donnees (simplifie)

Tables principales:

- `profiles` - profil utilisateur et role
- `addresses` - adresses des clients
- `requests` - demandes de service
- `request_items` - details inventaire / objets
- `attachments` - fichiers envoyes
- `messages` - messages lies a une demande
- `quotes` - devis
- `invoices` - factures
- `subscriptions` - abonnements de collecte
- `appointments` - interventions planifiees

---

## 6) Integration Stripe

Stripe gere les abonnements et paiements recurrents.

Webhooks a gerer pour synchroniser la base:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`

Fonctionnalite obligatoire:

- acces au Stripe Customer Portal pour permettre au client de:
  - modifier son moyen de paiement,
  - telecharger ses factures,
  - gerer ses informations de facturation.

---

## 7) Securite

- Activer Supabase Row Level Security (RLS) sur les tables sensibles.
- Un client ne voit que ses donnees.
- Acces admin base sur le role.
- Fichiers en stockage prive avec acces via URL signees.

Principes complementaires recommandes:

- validation stricte des donnees en entree,
- controle des permissions cote serveur sur chaque action sensible,
- journalisation minimale des actions admin.

---

## 8) Objectif produit

Construire une plateforme simple et robuste pour gerer:

- demenagement,
- installation,
- debarras,
- collecte reguliere de dechets.

Priorites:

- experience client simple,
- gestion operationnelle efficace pour les administrateurs,
- architecture scalable pour les evolutions futures.

---

## 9) Roadmap d'implementation (MVP)

## Phase 1 - Fondations (Semaine 1)

- Initialiser Next.js App Router.
- Connecter Supabase (auth, DB, storage).
- Mettre en place la structure des routes publiques, client, admin.
- Definir le schema SQL initial + policies RLS.

Livrable:

- base technique fonctionnelle avec authentification et role `client/admin`.

## Phase 2 - Demandes de service (Semaines 2-3)

- Construire le wizard de creation de demande.
- Gerer upload des photos en stockage prive.
- Implementer le cycle de statuts de demande.
- Creer les ecrans client `/app/demandes` et detail.

Livrable:

- un client peut creer et suivre une demande.

## Phase 3 - Admin operations (Semaines 3-4)

- Tableau `/admin/demandes` + detail avec conversation.
- Gestion planning (`/admin/planning`) et clients.
- Mise en place du catalogue services/tarifs (`/admin/services`).

Livrable:

- l'equipe admin pilote les demandes de bout en bout.

## Phase 4 - Abonnements + Stripe (Semaine 5)

- Flux de souscription abonnement dechets.
- Checkout Stripe + webhooks + synchronisation DB.
- Integration Stripe Customer Portal.

Livrable:

- abonnement actif avec paiement automatique et gestion portail.

## Phase 5 - Documents + stabilisation (Semaine 6)

- Espace documents (`quotes`, `invoices`) pour client + admin.
- Durcissement securite + validations.
- Tests critiques end-to-end des flux principaux.

Livrable:

- MVP deployable, robuste, pret pour premiers clients.

---

## 10) Definition of Done (MVP)

- Authentification client/admin operationnelle.
- Toutes les routes protegees par role et policies RLS.
- Creation + suivi de demandes fonctionnels.
- Admin capable de traiter et planifier les demandes.
- Abonnement Stripe operationnel et synchronise.
- Documents client/admin consultables.
- Messagerie demande active avec pieces jointes.
- Logs d'erreurs et monitoring de base en place.

