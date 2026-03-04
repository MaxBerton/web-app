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
  // Débarras
  space_type: "Type de lieu",
  items_types: "Types d'objets",
  volume_level: "Volume estimé",
  disassembly_needed: "Démontage nécessaire",
  // Transport
  transport_type: "Type de prestation",
  object_type: "Type d'objet",
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
  frequency: "Fréquence (passages/mois)",
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
    livraison: "Livraison",
    retrait: "Retrait (magasin, entrepôt…)",
    transport: "Transport (A → B)",
  },
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

function labelForKey(key: string): string {
  return DETAIL_LABELS[key] ?? key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

export type DetailEntry = { label: string; value: string }

/**
 * Transforme le payload d'une demande en liste de { label, value } pour l'affichage.
 * Exclut les clés déjà affichées (dates, accès) et les valeurs vides.
 */
export function getPayloadDetailEntries(payload: Record<string, unknown>): DetailEntry[] {
  const entries: DetailEntry[] = []
  for (const [key, value] of Object.entries(payload)) {
    if (SKIP_KEYS.has(key)) continue
    if (value === undefined || value === null || value === "") continue
    if (typeof value === "boolean" && !value) continue
    if (Array.isArray(value) && value.length === 0) continue
    if (typeof value === "object" && !Array.isArray(value)) continue
    entries.push({
      label: labelForKey(key),
      value: formatDetailValue(key, value),
    })
  }
  return entries.sort((a, b) => a.label.localeCompare(b.label))
}
