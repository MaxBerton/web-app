Modèle de données V1 — Plateforme Dr.Tri
Objectif

Mettre en place le schéma de base de données minimal viable pour la plateforme Dr.Tri.

Ce modèle doit permettre de gérer :

comptes utilisateurs

demandes clients

interventions

abonnements de collecte

communication client / admin

pièces jointes

planification

La base doit être compatible Supabase (PostgreSQL + Auth + RLS).

Principes d’architecture
Authentification

L’authentification est gérée par Supabase Auth.

La table auth.users est générée automatiquement.

Nous utilisons une table profiles pour stocker les données applicatives.

Relation :

auth.users.id → profiles.id

Chaque utilisateur possède un profil avec un rôle.

Rôles utilisateurs

Trois rôles sont utilisés :

client
admin
technician

Utilisation :

rôle	accès
client	ses demandes, ses abonnements
admin	toutes les données
technician	interventions assignées
Tables du modèle V1
profiles

Table principale des utilisateurs.

profiles

Champs :

id uuid PK → auth.users.id
role text
first_name text
last_name text
phone text
created_at timestamp

Valeurs possibles pour role :

client
admin
technician
addresses

Un client peut avoir plusieurs adresses.

Exemples :

domicile

lieu d’intervention

local professionnel

addresses

Champs :

id uuid PK
profile_id uuid FK → profiles.id
label text
street text
postal_code text
city text
country text
created_at timestamp

Relation :

profiles 1 → N addresses
requests

Représente une demande client.

Exemples :

déménagement

débarras

collecte déchets

transport

requests

Champs :

id uuid PK
client_id uuid FK → profiles.id
address_id uuid FK → addresses.id
type text
status text
description text
created_at timestamp

Types possibles :

moving
clearance
recycling
transport
other

Status :

pending
review
quoted
scheduled
completed
cancelled
attachments

Pièces jointes associées à une demande.

Exemples :

photos

documents

inventaire

attachments

Champs :

id uuid PK
request_id uuid FK → requests.id
file_url text
uploaded_by uuid FK → profiles.id
created_at timestamp

Les fichiers sont stockés dans Supabase Storage.

messages

Messagerie liée à une demande.

Permet communication :

client

admin

technicien

messages

Champs :

id uuid PK
request_id uuid FK → requests.id
sender_id uuid FK → profiles.id
message text
created_at timestamp

Relation :

requests 1 → N messages
subscriptions

Gestion des abonnements de collecte.

Exemple :

collecte déchets recyclables.

subscriptions

Champs :

id uuid PK
client_id uuid FK → profiles.id
plan text
frequency text
status text
created_at timestamp

Plans possibles :

basic
standard
premium

Fréquence :

weekly
biweekly
monthly

Status :

active
paused
cancelled

Stripe sera connecté plus tard.

appointments

Planification des interventions.

Exemples :

collecte

déménagement

débarras

appointments

Champs :

id uuid PK
request_id uuid FK → requests.id
technician_id uuid FK → profiles.id
scheduled_at timestamp
status text
notes text
created_at timestamp

Status :

scheduled
in_progress
completed
cancelled
Relations globales
auth.users
   │
   └── profiles
           │
           ├── addresses
           │
           ├── requests
           │       │
           │       ├── attachments
           │       ├── messages
           │       └── appointments
           │
           └── subscriptions
RLS (Row Level Security)

La sécurité doit être activée sur toutes les tables.

profiles

Client :

user_id = profile.id

Admin :

accès complet
requests

Client :

client_id = auth.uid()

Admin :

accès complet

Technician :

requests liés aux appointments assignés
messages

Client :

messages des requests dont il est propriétaire

Admin :

accès complet
subscriptions

Client :

client_id = auth.uid()

Admin :

accès complet
Index recommandés

Pour performance :

requests(client_id)
appointments(technician_id)
subscriptions(client_id)
messages(request_id)
attachments(request_id)
Objectif V1

Ce modèle permet de gérer :

✔ compte client
✔ demandes
✔ abonnements
✔ planning
✔ communication
✔ pièces jointes

Sans complexité inutile.

Évolutions futures (V2)

Tables possibles plus tard :

invoices
payments
routes
vehicles
teams
notifications
ratings

Mais elles ne sont pas nécessaires pour V1.

Résultat attendu pour Cursor

Cursor doit :

créer les tables

créer les relations FK

activer RLS

créer policies client/admin

préparer Supabase Storage pour attachments

Stack :

Next.js
Supabase
Stripe (plus tard)