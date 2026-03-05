/**
 * Libellés et formateurs pour l'affichage des champs détaillés d'une demande (payload).
 */

const DETAIL_LABELS: Record<string, string> = {
  // Lieu / commun
  floors: "Étage",
  has_elevator: "Ascenseur",
  parking_distance: "Distance parking",
  needs_helpers: "Nombre de personnes (manutention estimée)",
  access_constraints: "Contraintes d'accès",
  requested_dates: "Dates souhaitées",
  // Jardin & travaux
  category: "Type de prestation",
  subcategory: "Détail de la prestation",
  surface_or_hint: "Surface ou indication",
  frequency: "Fréquence",
  constraints: "Description / contraintes",
  // Débarras
  space_type: "Type de lieu",
  encombrement: "Niveau d'encombrement",
  items_types: "Types d'objets",
  objets_particuliers: "Objets particuliers ou informations",
  volume_level: "Volume estimé",
  disassembly_needed: "Démontage nécessaire",
  creneau: "Créneau",
  // Accès (nested)
  etage: "Étage",
  ascenseur: "Ascenseur",
  distance_parking: "Distance parking",
  acces_camion: "Accès camion",
  notes: "Notes d'accès",
  // Options (nested)
  demontage: "Démontage avant évacuation",
  destination: "Destination du contenu",
  // Transport
  transport_type: "Type de prestation",
  livraison_simple_step: "Étape livraison simple",
  object_type: "Type d'objet",
  dimensions_approx: "Dimensions (plus grande en cm)",
  poids_estime: "Poids estimé (kg)",
  fragile: "Fragile",
  nb_objets: "Nombre d'objets",
  adresse_recup: "Adresse de récupération",
  etage_recup: "Étage (récupération)",
  ascenseur_recup: "Ascenseur (récupération)",
  parking_recup: "Parking (récupération)",
  creneau_recup: "Créneau (récupération)",
  adresse_livraison: "Adresse de livraison",
  etage_livraison: "Étage (livraison)",
  ascenseur_livraison: "Ascenseur (livraison)",
  parking_livraison: "Parking (livraison)",
  option_aide_monter: "Assemblage",
  option_assemblage: "Assemblage",
  option_montage_meuble: "Montage meuble",
  option_reprise_ancien: "Reprise ancien / évacuation emballages",
  option_emballage: "Emballage",
  date_souhaitee: "Date souhaitée",
  creneau_livraison: "Créneau",
  objects_list: "Objets à transporter (approx.)",
  pickup_address: "Adresse de prise en charge",
  dropoff_address: "Adresse de livraison",
  items_count: "Nombre d'objets / colis",
  largest_item_dimensions: "Dimensions du plus gros objet",
  weight_category: "Catégorie de poids",
  stairs_pickup: "Escaliers (départ)",
  stairs_dropoff: "Escaliers (livraison)",
  has_elevator_pickup: "Ascenseur (départ)",
  has_elevator_dropoff: "Ascenseur (livraison)",
  time_window: "Créneau préféré",
  // Installation
  task_type: "Type de tâche",
  estimated_duration: "Durée estimée",
  requires_tools: "Outillage nécessaire",
  requires_wall_fixing: "Fixation murale",
  // Recyclage
  is_subscription: "Abonnement",
  bins_count: "Nombre de bacs",
  needs_bin_swap: "Échange de bacs",
  materials: "Matériaux",
  storage_location: "Emplacement des bacs",
  access_day_preference: "Jours préférés pour l'accès",
}

const VALUE_LABELS: Record<string, Record<string, string>> = {
  has_elevator: { yes: "Oui", no: "Non" },
  has_elevator_pickup: { "true": "Oui", "false": "Non" },
  has_elevator_dropoff: { "true": "Oui", "false": "Non" },
  disassembly_needed: { "true": "Oui", "false": "Non" },
  requires_tools: { "true": "Oui", "false": "Non" },
  requires_wall_fixing: { "true": "Oui", "false": "Non" },
  needs_bin_swap: { "true": "Oui", "false": "Non" },
  is_subscription: { "true": "Oui", "false": "Non" },
  space_type: {
    cave: "Cave",
    grenier: "Grenier",
    garage: "Garage",
    appartement: "Appartement",
    maison: "Maison",
    local: "Local",
  },
  volume_level: { S: "S", M: "M", L: "L", XL: "XL" },
  parking_distance: {
    "<10m": "Moins de 10 m",
    "10-50m": "10 à 50 m",
    ">50m": "Plus de 50 m",
  },
  transport_type: {
    livraison_simple: "Livraison simple",
    transport_meubles: "Transport d'objets / meubles",
    demenagement: "Déménagement complet",
    livraison: "Livraison",
    retrait: "Retrait (magasin, entrepôt…)",
    transport: "Transport (A → B)",
  },
  category: {
    jardin: "Jardin / extérieur",
    bricolage: "Bricolage / petits travaux",
    entretien: "Entretien intérieur",
    autre: "Autre",
  },
  subcategory: {
    tonte: "Tonte pelouse",
    taille_haies: "Taille haies / arbustes",
    entretien_massifs: "Entretien massifs / jardin",
    terrassement: "Terrassement / aménagement",
    montage: "Montage meuble / équipement",
    peinture: "Peinture",
    reparations: "Petites réparations",
    installation: "Installation (étagères, tringles, etc.)",
    autre: "Autre",
  },
  frequency: {
    ponctuel: "Ponctuel — une fois",
    recurrent: "Récurrent — régulier",
  },
  fragile: { yes: "Oui", no: "Non" },
  ascenseur: { yes: "Oui", no: "Non" },
  ascenseur_recup: { yes: "Oui", no: "Non" },
  ascenseur_livraison: { yes: "Oui", no: "Non" },
  object_type: {
    meubles: "Meubles",
    electromenager: "Électroménager",
    colis: "Colis / cartons",
    palette: "Palette(s)",
    autre: "Autre",
  },
  weight_category: { leger: "Léger", moyen: "Moyen", lourd: "Lourd" },
  time_window: { matin: "Matin", "apres-midi": "Après-midi", soir: "Soir" },
  task_type: {
    mise_en_place: "Mise en place",
    montage_simple: "Montage simple",
    deplacement_lourd: "Déplacement lourd",
    autre: "Autre",
  },
  estimated_duration: {
    "30min": "30 min",
    "1h": "1 h",
    "2h": "2 h",
    "demi-journee": "Demi-journée",
  },
}

/** Champs déjà affichés ailleurs dans la carte (description, adresse, dates, accès). */
const SKIP_KEYS = new Set(["requested_dates", "access_constraints", "requested_date"])

/** Préfixes pour les objets imbriqués (ex. acces -> "Accès"). */
const NESTED_PREFIX: Record<string, string> = {
  acces: "Accès",
  options: "Options",
}

function formatDetailValue(key: string, value: unknown): string {
  if (value == null || value === "") return "—"
  const valueMap = VALUE_LABELS[key]
  if (valueMap && typeof value === "string") {
    return valueMap[value] ?? value
  }
  if (typeof value === "boolean") return value ? "Oui" : "Non"
  if (Array.isArray(value)) return value.map((v) => String(v)).join(", ")
  return String(value)
}

function labelForKey(key: string, prefix?: string): string {
  const base = DETAIL_LABELS[key] ?? key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  return prefix ? `${prefix} — ${base}` : base
}

export type DetailEntry = { label: string; value: string }

function collectEntries(
  obj: Record<string, unknown>,
  entries: DetailEntry[],
  keyPrefix = ""
): void {
  for (const [key, value] of Object.entries(obj)) {
    if (SKIP_KEYS.has(key)) continue
    if (value === undefined || value === null || value === "") continue
    if (typeof value === "boolean" && !value) continue
    if (Array.isArray(value) && value.length === 0) continue
    if (typeof value === "object" && !Array.isArray(value)) {
      const prefix = keyPrefix || NESTED_PREFIX[key]
      if (prefix) {
        collectEntries(value as Record<string, unknown>, entries, prefix)
      } else {
        collectEntries(value as Record<string, unknown>, entries, key)
      }
      continue
    }
    const label = keyPrefix ? labelForKey(key, keyPrefix) : labelForKey(key)
    entries.push({
      label,
      value: formatDetailValue(key, value),
    })
  }
}

/**
 * Transforme le payload d'une demande en liste de { label, value } pour l'affichage.
 * Exclut les clés déjà affichées (dates, accès) et les valeurs vides.
 * Gère les objets imbriqués (ex. acces.etage -> "Accès — Étage").
 */
export function getPayloadDetailEntries(payload: Record<string, unknown>): DetailEntry[] {
  const entries: DetailEntry[] = []
  collectEntries(payload, entries)
  return entries.sort((a, b) => a.label.localeCompare(b.label))
}
