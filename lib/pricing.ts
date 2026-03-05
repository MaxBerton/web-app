import { createClient } from "@/lib/supabase/server"

export type PricingConfig = {
  depotAddress: string
  depotLat: number | null
  depotLng: number | null
  employeeHourlyRate: number
  kilometerRate: number
}

const DEFAULT_CONFIG: PricingConfig = {
  depotAddress: "Lausanne, Suisse",
  depotLat: null,
  depotLng: null,
  employeeHourlyRate: 60,
  kilometerRate: 2.2,
}

function toNumber(value: string | null, fallback: number): number {
  const parsed = Number.parseFloat(value ?? "")
  return Number.isFinite(parsed) ? parsed : fallback
}

async function fetchJsonWithTimeout(url: string, timeoutMs = 6000) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "drtri-webapp/1.0",
      },
      cache: "no-store",
    })
    if (!response.ok) {
      return null
    }
    return (await response.json()) as unknown
  } catch {
    return null
  } finally {
    clearTimeout(timeout)
  }
}

export async function getPricingConfig(): Promise<PricingConfig> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("app_settings")
    .select("key, value")
    .in("key", ["depot_address", "depot_lat", "depot_lng", "employee_hourly_rate", "kilometer_rate"])

  const map = new Map((data ?? []).map((entry) => [entry.key, entry.value]))
  const depotLatRaw = map.get("depot_lat")
  const depotLngRaw = map.get("depot_lng")
  const depotLat = depotLatRaw != null ? parseFloat(String(depotLatRaw)) : null
  const depotLng = depotLngRaw != null ? parseFloat(String(depotLngRaw)) : null

  return {
    depotAddress: map.get("depot_address") ?? DEFAULT_CONFIG.depotAddress,
    depotLat: Number.isFinite(depotLat) ? depotLat! : null,
    depotLng: Number.isFinite(depotLng) ? depotLng! : null,
    employeeHourlyRate: toNumber(map.get("employee_hourly_rate") ?? null, DEFAULT_CONFIG.employeeHourlyRate),
    kilometerRate: toNumber(map.get("kilometer_rate") ?? null, DEFAULT_CONFIG.kilometerRate),
  }
}

type GeocodePoint = { lat: number; lon: number }

async function geocodeAddress(address: string): Promise<GeocodePoint | null> {
  const query = encodeURIComponent(address)
  const payload = await fetchJsonWithTimeout(
    `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${query}`,
  )

  if (!Array.isArray(payload) || payload.length === 0) {
    return null
  }
  const first = payload[0] as { lat?: string; lon?: string }
  const lat = Number.parseFloat(first.lat ?? "")
  const lon = Number.parseFloat(first.lon ?? "")
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return null
  }
  return { lat, lon }
}

export async function computeDrivingDistanceKm(fromAddress: string, toAddress: string): Promise<number | null> {
  if (!fromAddress || !toAddress) {
    return null
  }

  const [from, to] = await Promise.all([geocodeAddress(fromAddress), geocodeAddress(toAddress)])
  if (!from || !to) {
    return null
  }

  const url = `https://router.project-osrm.org/route/v1/driving/${from.lon},${from.lat};${to.lon},${to.lat}?overview=false`
  const payload = (await fetchJsonWithTimeout(url)) as
    | { routes?: Array<{ distance?: number }> }
    | null

  const meters = payload?.routes?.[0]?.distance
  if (typeof meters !== "number" || !Number.isFinite(meters)) {
    return null
  }
  return Math.round((meters / 1000) * 10) / 10
}

export function estimateQuoteAmountCents(input: {
  employees: number
  hours: number
  employeeHourlyRate: number
  distanceKm: number
  kilometerRate: number
}) {
  const labor = input.employees * input.hours * input.employeeHourlyRate
  const travel = input.distanceKm * input.kilometerRate
  return Math.max(0, Math.round((labor + travel) * 100))
}
