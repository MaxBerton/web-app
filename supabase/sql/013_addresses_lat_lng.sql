-- Stocker les coordonnées (lat/lng) pour les adresses (géocodage Mapbox, tournées)
ALTER TABLE public.addresses
  ADD COLUMN IF NOT EXISTS latitude double precision,
  ADD COLUMN IF NOT EXISTS longitude double precision;
