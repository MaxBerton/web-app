# Cadrage SaaS — Plateforme Dr.Tri

## Objectif

Créer une plateforme SaaS interne permettant de gérer l’activité opérationnelle de **Dr.Tri** :

- prise de demande client  
- gestion des devis  
- planification des interventions  
- gestion des abonnements de collecte  
- optimisation des tournées  
- facturation et paiements  

La plateforme doit servir à la fois :

- d’outil **opérationnel interne**
- de **portail client**

---

# 1. Vision produit

Dr.Tri propose un service simple basé sur une promesse claire :

> **On transporte, on installe, on débarrasse.**

La plateforme doit permettre d’orchestrer ces services de manière efficace.

Le SaaS centralise :

- les demandes clients
- les opérations terrain
- les abonnements récurrents
- la facturation

---

# 2. Typologie des utilisateurs

## Client

Accès à un espace personnel permettant de :

- créer une demande de service
- suivre l’état d’une intervention
- gérer son abonnement de collecte
- consulter et payer ses factures

---

## Administrateur

Interface de gestion complète :

- réception des demandes
- création et envoi de devis
- planification des interventions
- gestion des tournées
- gestion des abonnements
- gestion de la facturation

---

## Technicien (option)

Interface terrain simplifiée :

- consulter les interventions du jour
- valider une intervention
- ajouter photos et notes
- signaler un problème

---

# 3. Parcours métier principal

Flux opérationnel principal :
Demande client
↓
Analyse
↓
Devis
↓
Acceptation
↓
Intervention
↓
Facturation


Ce workflow constitue **le cœur du système**.

---

# 4. Modules SaaS

## 4.1 Gestion des clients

Objet principal :
Client


### Champs


id
nom
prenom
email
telephone
adresse
latitude
longitude
date_creation


### Fonctions

- création client
- modification client
- historique des demandes
- historique des interventions
- historique des factures

---

# 4.2 Gestion des demandes

Objet :


Request


### Types de demandes


demenagement
installation
debarras
demolition
collecte


### Champs


id
client_id
type
description
photos
adresse_depart
adresse_arrivee
date_souhaitee
status
created_at


### Statuts


nouvelle
analyse
devis_envoye
devis_accepte
planifie
en_cours
termine
facture


---

# 4.3 Gestion des devis

Objet :


Quote


### Champs


id
request_id
prix
details
date_envoi
date_acceptation
status


### Statuts


brouillon
envoye
accepte
refuse
expire


---

# 4.4 Gestion des interventions

Objet :


Intervention


### Champs


id
request_id
technicien_id
date
heure
adresse
statut
notes
photos


### Statuts


planifie
en_cours
termine
annule


---

# 4.5 Gestion des abonnements

Objet :


Subscription


### Champs


id
client_id
frequence
prix
stripe_subscription_id
date_debut
statut


### Fréquences


weekly
biweekly
monthly


### Statuts


actif
pause
annule
impaye


---

# 4.6 Gestion des tournées

Module logistique essentiel.

## Objet


Route


### Champs


id
date
zone
technicien_id


---

## Objet


RouteStop


### Champs


id
route_id
client_id
ordre
type_service


### Objectif

Optimiser les déplacements pour :

- les collectes de déchets
- les interventions proches

---

# 4.7 Facturation

Objet :


Invoice


### Champs


id
client_id
montant
statut
date
stripe_payment_id


### Statuts


en_attente
paye
annule
rembourse


---

# 5. Notifications

### Types


email
sms


### Événements


nouvelle demande
devis envoyé
devis accepté
intervention planifiée
rappel intervention
facture disponible
paiement confirmé


---

# 6. Dashboard Administrateur

Interface principale de pilotage.

## Indicateurs clés (KPI)


demandes du mois
interventions prévues
abonnements actifs
chiffre d'affaires


---

## Planning

Calendrier global affichant :


interventions
collectes
tournées


---

## Pipeline opérationnel

Vue Kanban :


nouvelle demande
analyse
devis envoyé
planifié
terminé


---

# 7. Espace client

Interface dédiée aux clients.

## Dashboard


mes demandes
mes interventions
mes factures
mon abonnement


### Actions possibles


créer une demande
modifier abonnement
payer une facture
reprogrammer une intervention


---

# 8. Paiements

Solution :

**Stripe**

### Paiements ponctuels


devis
factures


### Paiements récurrents


abonnements
mensuels
automatiques


---

# 9. Stack technique

## Frontend


Next.js
React
TailwindCSS


## Backend


Supabase
PostgreSQL


## Authentification


Supabase Auth


## Paiement


Stripe


## Notifications


Resend (email)
Twilio (sms)


---

# 10. Architecture des pages

## Site public


/
Accueil

/services
Déménagement
Installation
Débarras
Abonnement recyclage

/contact


---

## Application SaaS


/login
/dashboard
/requests
/subscriptions
/interventions
/invoices
/routes
/clients
/settings


---

# 11. Version MVP

## Phase 1

Fonctionnalités essentielles :


gestion des demandes
gestion des devis
gestion des interventions
facturation


---

## Phase 2

Fonctionnalités récurrentes :


gestion abonnements
paiements Stripe


---

## Phase 3

Optimisation opérationnelle :


gestion tournées
optimisation logistique


---

# 12. Roadmap produit

## V1


gestion demandes
gestion devis


---

## V2


abonnements
paiements Stripe


---

## V3


gestion tournées
optimisation logistique


---

## V4


application mobile technicien