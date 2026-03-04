import { createClient } from "@/lib/supabase/server"
import type { RequestRow } from "@/lib/requests"

const STATUS_LABELS: Record<string, string> = {
  draft: "Brouillon",
  submitted: "Envoyée",
  need_info: "Info requise",
  estimating: "Devis en attente",
  quote_sent: "Devis envoyé",
  accepted: "Acceptée",
  scheduled: "Planifiée",
  in_progress: "En cours",
  done: "Terminée",
  invoiced: "Facturée",
  paid: "Payée",
  canceled: "Annulée",
  // alias
  pending: "En attente",
  review: "En examen",
  quoted: "Devis envoyé",
  completed: "Terminé",
  cancelled: "Annulé",
}

const TYPE_LABELS: Record<string, string> = {
  moving: "Déménagement / Installation",
  clearance: "Débarras",
  recycling: "Recyclage",
  transport: "Transport",
  other: "Autre",
}

/** Valeurs de statut pour filtre "En attente" */
export const STATUS_EN_ATTENTE = ["draft", "submitted", "need_info", "estimating"] as const
/** Valeurs pour filtre "En cours" */
export const STATUS_EN_COURS = ["quote_sent", "accepted", "in_progress"] as const
/** Valeurs pour filtre "Terminée" */
export const STATUS_TERMINEE = ["done", "invoiced", "paid"] as const

export const STATUS_FILTER_OPTIONS = [
  { value: "", label: "Tous" },
  { value: "en_attente", label: "En attente" },
  { value: "planifiee", label: "Planifiée" },
  { value: "en_cours", label: "En cours" },
  { value: "terminee", label: "Terminée" },
  { value: "annulee", label: "Annulée" },
] as const

export const TYPE_FILTER_OPTIONS = [
  { value: "", label: "Tous les services" },
  { value: "clearance", label: "Débarras" },
  { value: "transport", label: "Transport" },
  { value: "moving", label: "Installation / Déménagement" },
  { value: "recycling", label: "Recyclage" },
  { value: "other", label: "Autre" },
] as const

export function getRequestTypeLabel(type: string): string {
  return TYPE_LABELS[type] ?? type
}

export function getRequestStatusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status
}

/** Message pour le client : prochaine étape selon le statut (page détail demande). */
export function getRequestNextStepHint(status: string): string | null {
  switch (status) {
    case "submitted":
      return "Nous allons préparer votre devis et vous recontacterons rapidement."
    case "estimating":
      return "Votre devis est en préparation."
    case "quote_sent":
      return "Consultez le devis ci‑dessous et acceptez ou refusez."
    case "accepted":
    case "scheduled":
      return "Une intervention sera planifiée avec vous."
    default:
      return null
  }
}

export type DashboardCounts = {
  enCours: number
  terminees: number
}

export function getDashboardCounts(requests: RequestRow[]): DashboardCounts {
  const terminees = requests.filter((r) =>
    ["done", "invoiced", "paid"].includes(r.status)
  ).length
  const enCours = requests.filter(
    (r) =>
      !["done", "invoiced", "paid", "canceled"].includes(r.status)
  ).length
  return { enCours, terminees }
}

export type ClientProfile = {
  first_name: string | null
}

export async function getClientProfile(userId: string): Promise<ClientProfile | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("profiles")
    .select("first_name")
    .eq("id", userId)
    .single()
  return data
}

/**
 * Prochain rendez-vous client.
 * Avec la RLS actuelle le client ne peut pas lire la table appointments ; retourne null.
 * Pour activer : ajouter une policy client sur appointments (via request_id → requests.client_id).
 */
export async function getClientNextAppointment(requestIds: string[]): Promise<{
  scheduled_at: string
  request_id: string
} | null> {
  if (requestIds.length === 0) return null
  const supabase = await createClient()
  const now = new Date().toISOString()
  const { data } = await supabase
    .from("appointments")
    .select("scheduled_at, request_id")
    .in("request_id", requestIds)
    .gte("scheduled_at", now)
    .in("status", ["scheduled", "in_progress"])
    .order("scheduled_at", { ascending: true })
    .limit(1)
    .maybeSingle()
  return data
}
