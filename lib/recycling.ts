import { createClient } from "@/lib/supabase/server"
import type { RecyclingPricingConfig } from "./recycling-pricing"
import { DEFAULT_RECYCLING_PRICING } from "./recycling-pricing"

/** Jour de passage : 1 = lundi (getDay()). */
const PASSAGE_DAY_OF_WEEK = 1

/**
 * Retourne les N premières dates du mois qui tombent le jour de passage (lundi).
 * month : 0 = janvier.
 */
function getPassageDatesInMonth(
  year: number,
  month: number,
  count: number
): string[] {
  const out: string[] = []
  let first = -1
  for (let d = 1; d <= 7; d++) {
    if (new Date(year, month, d).getDay() === PASSAGE_DAY_OF_WEEK) {
      first = d
      break
    }
  }
  if (first < 0) return out
  for (let i = 0; i < count; i++) {
    const day = first + i * 7
    if (day > new Date(year, month + 1, 0).getDate()) break
    const date = new Date(year, month, day)
    out.push(date.toISOString().slice(0, 10))
  }
  return out
}

/**
 * Calcule la date du prochain passage à partir d'une date donnée,
 * en fonction du nombre de passages par mois (lundis).
 */
export function getNextPickupDateFrom(
  fromDate: Date,
  passesPerMonth: number
): string {
  const n = Math.min(4, Math.max(1, passesPerMonth))
  const from = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate())
  const fromStr = from.toISOString().slice(0, 10)

  let year = from.getFullYear()
  let month = from.getMonth()

  const inMonth = getPassageDatesInMonth(year, month, n)
  const nextInMonth = inMonth.find((d) => d >= fromStr)
  if (nextInMonth) return nextInMonth

  if (month === 11) {
    year++
    month = 0
  } else {
    month++
  }
  const nextMonthDates = getPassageDatesInMonth(year, month, n)
  return nextMonthDates[0] ?? getNextPickupDateFrom(new Date(year, month, 1), n)
}

export type RecyclingSubscription = {
  id: string
  client_id: string
  status: string
  frequency: string
  next_pickup_date: string | null
  paused_from: string | null
  paused_until: string | null
  passes_per_month: number
  bins_count: number
  large_bins_count: number
  price_cents: number | null
  created_at: string
}

export type SubscriptionPickup = {
  id: string
  pickup_date: string
  completed_at: string | null
}

export { getPassesOptions, computePriceCents, getPassesOptionsFromConfig, computePriceCentsFromConfig } from "./recycling-pricing"
export type { RecyclingPricingConfig, PassOption } from "./recycling-pricing"

function toNum(value: string | null, fallback: number): number {
  const n = Number.parseFloat(value ?? "")
  return Number.isFinite(n) ? n : fallback
}

export async function getRecyclingPricingConfig(): Promise<RecyclingPricingConfig> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("app_settings")
    .select("key, value")
    .in("key", [
      "recycling_pass_1",
      "recycling_pass_2",
      "recycling_pass_3",
      "recycling_pass_4",
      "recycling_extra_bins_per_2_chf",
      "recycling_large_bin_chf",
    ])
  const map = new Map((data ?? []).map((r) => [r.key, r.value]))
  return {
    pass1Chf: toNum(map.get("recycling_pass_1") ?? null, DEFAULT_RECYCLING_PRICING.pass1Chf),
    pass2Chf: toNum(map.get("recycling_pass_2") ?? null, DEFAULT_RECYCLING_PRICING.pass2Chf),
    pass3Chf: toNum(map.get("recycling_pass_3") ?? null, DEFAULT_RECYCLING_PRICING.pass3Chf),
    pass4Chf: toNum(map.get("recycling_pass_4") ?? null, DEFAULT_RECYCLING_PRICING.pass4Chf),
    extraBinsPer2Chf: toNum(map.get("recycling_extra_bins_per_2_chf") ?? null, DEFAULT_RECYCLING_PRICING.extraBinsPer2Chf),
    largeBinChf: toNum(map.get("recycling_large_bin_chf") ?? null, DEFAULT_RECYCLING_PRICING.largeBinChf),
  }
}

export async function getRecyclingSubscription(userId: string): Promise<RecyclingSubscription | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("subscriptions")
    .select("id, client_id, status, frequency, next_pickup_date, paused_from, paused_until, passes_per_month, bins_count, large_bins_count, price_cents, created_at")
    .eq("client_id", userId)
    .in("status", ["active", "paused"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error || !data) return null
  const passesPerMonth = data.passes_per_month ?? 1
  let next_pickup_date: string | null
  if (data.status === "paused" && !data.paused_until) {
    next_pickup_date = null
  } else if (data.status === "paused" && data.paused_until) {
    next_pickup_date = getNextPickupDateFrom(new Date(data.paused_until + "T12:00:00"), passesPerMonth)
  } else {
    next_pickup_date = getNextPickupDateFrom(new Date(), passesPerMonth)
  }
  return {
    ...data,
    next_pickup_date,
    passes_per_month: passesPerMonth,
    bins_count: data.bins_count ?? 6,
    large_bins_count: data.large_bins_count ?? 0,
  }
}

export async function getSubscriptionPickups(subscriptionId: string): Promise<SubscriptionPickup[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("subscription_pickups")
    .select("id, pickup_date, completed_at")
    .eq("subscription_id", subscriptionId)
    .order("pickup_date", { ascending: false })
    .limit(20)

  if (error || !data) return []
  return data
}

export type AdminRecyclingRow = {
  id: string
  status: string
  passes_per_month: number
  bins_count: number
  large_bins_count: number
  next_pickup_date: string | null
  client_id: string
  address_id: string | null
  client_name: string
  client_email: string | null
  address_display: string
}

/** Liste des abonnements recyclage pour l’admin (clients + adresses). */
export async function getAdminRecyclingSubscriptions(): Promise<AdminRecyclingRow[]> {
  const supabase = await createClient()
  const { data: subs, error: subsError } = await supabase
    .from("subscriptions")
    .select("id, status, passes_per_month, bins_count, large_bins_count, next_pickup_date, client_id, address_id")
    .in("status", ["active", "paused"])
    .order("next_pickup_date", { ascending: true, nullsFirst: false })

  if (subsError || !subs?.length) return []

  const clientIds = [...new Set(subs.map((s) => s.client_id))]
  const addressIds = [...new Set(subs.map((s) => s.address_id).filter(Boolean) as string[])]

  const [profilesRes, addressesByIdRes, addressesByProfileRes] = await Promise.all([
    supabase.from("profiles").select("id, first_name, last_name, email").in("id", clientIds),
    addressIds.length > 0
      ? supabase.from("addresses").select("id, street, postal_code, city").in("id", addressIds)
      : Promise.resolve({ data: [] as { id: string; street: string | null; postal_code: string | null; city: string }[] }),
    supabase.from("addresses").select("profile_id, street, postal_code, city").in("profile_id", clientIds).order("created_at", { ascending: true }),
  ])

  const profilesMap = new Map(
    (profilesRes.data ?? []).map((p) => [
      p.id,
      {
        name: [p.first_name, p.last_name].filter(Boolean).join(" ") || p.email || "—",
        email: p.email ?? null,
      },
    ])
  )
  const formatAddress = (a: { street: string | null; postal_code: string | null; city: string }) =>
    [a.street, [a.postal_code, a.city].filter(Boolean).join(" ")].filter(Boolean).join(", ") || "—"
  const addressesByIdMap = new Map(
    (addressesByIdRes.data ?? []).map((a) => [a.id, formatAddress(a)])
  )
  const firstAddressByProfileMap = new Map<string, string>()
  for (const a of addressesByProfileRes.data ?? []) {
    if (!firstAddressByProfileMap.has(a.profile_id)) firstAddressByProfileMap.set(a.profile_id, formatAddress(a))
  }

  return subs.map((s) => {
    const client = profilesMap.get(s.client_id)
    const addressDisplay = s.address_id
      ? addressesByIdMap.get(s.address_id) ?? firstAddressByProfileMap.get(s.client_id) ?? "—"
      : firstAddressByProfileMap.get(s.client_id) ?? "—"
    return {
      id: s.id,
      status: s.status,
      passes_per_month: s.passes_per_month ?? 1,
      bins_count: s.bins_count ?? 6,
      large_bins_count: s.large_bins_count ?? 0,
      next_pickup_date: s.next_pickup_date,
      client_id: s.client_id,
      address_id: s.address_id,
      client_name: client?.name ?? "—",
      client_email: client?.email ?? null,
      address_display: addressDisplay,
    }
  })
}
