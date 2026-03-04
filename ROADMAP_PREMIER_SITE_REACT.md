# Roadmap - Projet Dr.Tri (Next.js + Supabase + Stripe)

## Objectif

Construire une plateforme unique (mono-projet Next.js) qui couvre:

- le site public,
- l'espace client,
- l'interface administrateur,
- la gestion des demandes, des abonnements, des documents et des paiements.

Promesse metier:

> On transporte, on installe, on debarrasse.

---

## 1) Cadrage produit (Jours 1-2)

### Resultat attendu

Un MVP clair et borne, aligne sur les operations Dr.Tri.

### Taches

- Valider les services:
  - demenagement,
  - installation,
  - debarras,
  - demolition (dans le wizard).
- Verifier les roles et permissions:
  - `client`,
  - `admin`.
- Valider les routes cibles (public, `/app`, `/admin`).
- Valider les statuts de demande de `draft` a `paid`.
- Definir les KPIs MVP:
  - demande creee,
  - devis envoye,
  - demande planifiee,
  - abonnement actif.

### Livrables

- brief fonctionnel valide,
- backlog MVP priorise,
- maquettes ecrans critiques (login, wizard, admin demandes).

---

## 2) Architecture technique (Jour 3)

### Stack imposee du projet

- App: `Next.js` (App Router)
- Donnees/Auth/Storage: `Supabase`
- Paiements: `Stripe` (abonnements)
- Emails: `Resend` ou `Postmark`

### Principes d'architecture

- Un seul repository Next.js pour tout le produit.
- Separation logique par zones:
  - routes publiques,
  - routes client sous `/app`,
  - routes admin sous `/admin`.
- Controle d'acces cote serveur + RLS Supabase.
- Stockage prive pour les fichiers sensibles.

---

## 3) Fondations techniques (Semaine 1)

### Resultat attendu

Base applicative stable, auth operationnelle, schema initial en place.

### Taches

- Initialiser Next.js (TypeScript, App Router).
- Configurer clients Supabase (server/browser).
- Mettre en place pages:
  - `/login`,
  - `/register`,
  - `/app`,
  - `/admin`.
- Creer tables de base:
  - `profiles`,
  - `addresses`,
  - `requests`,
  - `subscriptions`,
  - `messages`,
  - `attachments`,
  - `quotes`,
  - `invoices`,
  - `appointments`.
- Ajouter contraintes, indexes et enums (`request_status`, `frequency`).

### Definition of done

- connexion et inscription fonctionnent,
- role utilisateur disponible via `profiles`,
- routes protegees selon authentification.

---

## 4) Securite et permissions (Semaine 1-2)

### Resultat attendu

Isolation des donnees garantie, acces admin controle.

### Taches

- Activer RLS sur toutes les tables sensibles.
- Policies `client`: acces uniquement a ses propres donnees.
- Policies `admin`: acces global.
- Verifier l'acces aux fichiers via URL signees uniquement.
- Proteger toutes les actions critiques cote serveur.

### Definition of done

- un client ne peut jamais lire/modifier les donnees d'un autre client,
- un admin a un acces complet conforme a son role,
- aucun fichier prive n'est expose publiquement.

---

## 5) Flux principal: demandes de service (Semaines 2-3)

### Resultat attendu

Un client peut creer et suivre une demande, un admin peut la traiter.

### Taches client

- Implementer `/app/demandes/nouvelle` (wizard 6 etapes):
  1. type de service
  2. adresse
  3. details (inventaire, volume, notes)
  4. photos
  5. date souhaitee
  6. confirmation/envoi
- Implementer `/app/demandes` (liste + statuts).
- Implementer `/app` (resume operationnel).

### Taches admin

- Implementer `/admin/demandes` (liste globale + filtres).
- Implementer `/admin/demandes/[id]` (detail complet + pieces jointes).
- Ajouter transitions de statut metier.

### Statuts a supporter

`draft`, `submitted`, `need_info`, `estimating`, `quote_sent`, `accepted`, `scheduled`, `in_progress`, `done`, `invoiced`, `paid`, `canceled`.

### Definition of done

- flux bout en bout fonctionnel du depot de demande au suivi admin.

---

## 6) Messagerie, planning et documents (Semaine 4)

### Resultat attendu

Communication et documentation centralisees par demande.

### Taches

- Messagerie liee a chaque demande (`/app/messages` + vue admin).
- Pieces jointes par message.
- Planning:
  - client `/app/planning`,
  - admin `/admin/planning`.
- Documents:
  - client `/app/documents`,
  - admin `/admin/facturation`.

### Definition of done

- client et admin peuvent echanger sur une demande,
- devis/factures visibles des deux cotes,
- interventions planifiees visibles selon role.

---

## 7) Abonnements collecte de dechets (Semaine 5)

### Resultat attendu

Souscription recurrente active et synchronisee dans Supabase.

### Taches

- Implementer `/app/abonnement`.
- Checkout Stripe pour frequence:
  - hebdomadaire,
  - bi-hebdomadaire,
  - mensuelle.
- Stocker:
  - `stripe_customer_id`,
  - `stripe_subscription_id`,
  - `status`,
  - `frequency`,
  - `next_pickup_date`,
  - `paused_until`,
  - `address_id`.
- Exposer acces au Stripe Customer Portal.

### Webhooks obligatoires

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`

### Definition of done

- etat abonnement synchronise entre Stripe et la DB,
- client peut gerer son moyen de paiement et ses infos de facturation.

---

## 8) Emails transactionnels + fiabilite (Semaine 5-6)

### Taches

- Integrer `Resend` ou `Postmark`.
- Templates minimum:
  - demande envoyee,
  - changement de statut,
  - devis disponible,
  - facture disponible,
  - paiement reussi / echoue.
- Ajouter logs d'erreurs et retries simples.

---

## 9) Stabilisation et go-live (Semaine 6)

### Qualite et securite

- Validation stricte des entrees.
- Tests des flux critiques:
  - auth client/admin,
  - creation et traitement de demande,
  - abonnements Stripe + webhooks.
- Revue permissions et RLS finale.

### Deploiement

- Deploy Next.js (ex: Vercel).
- Configurer variables d'environnement.
- Verifier logs production et alertes de base.

### Checklist pre-production

- [ ] Login/register OK
- [ ] Routes `/app` et `/admin` protegees
- [ ] RLS verifie sur toutes les tables metier
- [ ] Wizard demande complet et stable
- [ ] Admin peut traiter une demande de bout en bout
- [ ] Documents visibles selon droits
- [ ] Stripe checkout + webhooks + portal OK
- [ ] Emails transactionnels critiques OK

---

## Planning resume (S1 -> S6)

- S1: setup Next.js + Supabase + auth + schema initial
- S2: RLS + wizard demandes (v1)
- S3: backoffice demandes + transitions de statut
- S4: messagerie + planning + documents
- S5: abonnements Stripe + emails transactionnels
- S6: tests, securite finale, deploiement MVP

---

## Priorites MVP (ordre strict)

1. Auth + roles + protection des routes
2. RLS et isolation stricte des donnees
3. Wizard demandes + traitement admin
4. Messagerie et documents
5. Abonnements Stripe et synchronisation webhooks
6. Stabilisation, tests et deploiement

---

## Evolutions post-MVP

- dashboard KPI admin (conversion, CA, volume interventions),
- audit log des actions admin,
- notifications temps reel,
- optimisation planning / tournees,
- internationalisation.

