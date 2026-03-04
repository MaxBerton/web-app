import { createClient } from "@/lib/supabase/server"
import {
  STATUS_EN_ATTENTE,
  STATUS_EN_COURS,
  STATUS_TERMINEE,
} from "@/lib/dashboard"

export type RequestRow = {
  id: string
  type: string
  status: string
  description: string | null
  created_at: string
}

export type RequestAddress = {
  street: string | null
  postal_code: string | null
  city: string | null
} | null

export type RequestWithAddress = RequestRow & {
  addresses: RequestAddress
}

export type ClientRequestsFilterParams = {
  page?: number
  pageSize?: number
  statusFilter?: string
  typeFilter?: string
  search?: string
}

export type ClientRequestsFilterResult = {
  data: RequestWithAddress[]
  total: number
}

const STATUS_FILTER_TO_VALUES: Record<string, readonly string[]> = {
  en_attente: STATUS_EN_ATTENTE,
  planifiee: ["scheduled"],
  en_cours: [...STATUS_EN_COURS],
  terminee: [...STATUS_TERMINEE],
  annulee: ["canceled"],
}

export async function getClientRequestsFiltered(
  params: ClientRequestsFilterParams = {}
): Promise<ClientRequestsFilterResult> {
  const {
    page = 1,
    pageSize = 20,
    statusFilter,
    typeFilter,
    search,
  } = params

  const supabase = await createClient()
  let query = supabase
    .from("requests")
    .select("id, type, status, description, created_at, addresses(street, postal_code, city)", {
      count: "exact",
    })
    .order("created_at", { ascending: false })

  if (statusFilter && STATUS_FILTER_TO_VALUES[statusFilter]) {
    query = query.in("status", [...STATUS_FILTER_TO_VALUES[statusFilter]])
  }
  if (typeFilter) {
    query = query.eq("type", typeFilter)
  }
  if (search?.trim()) {
    const q = search.trim()
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(q)
    if (isUuid) {
      query = query.eq("id", q)
    } else {
      query = query.ilike("description", `%${q}%`)
    }
  }

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  const { data, error, count } = await query.range(from, to)

  if (error) {
    console.error("[requests.getClientRequestsFiltered]", error.message)
    return { data: [], total: 0 }
  }

  const total = count ?? 0
  const rows = (data ?? []) as RequestWithAddress[]
  return { data: rows, total }
}

export async function getClientRequests() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("requests")
    .select("id, type, status, description, created_at")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[requests.getClientRequests]", error.message)
    return [] as RequestRow[]
  }

  return data ?? []
}

export async function getRequestById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("requests")
    .select("id, type, status, description, created_at")
    .eq("id", id)
    .maybeSingle()

  if (error) {
    console.error("[requests.getRequestById]", error.message)
    return null
  }

  return data
}
