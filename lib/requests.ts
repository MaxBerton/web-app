import { createClient } from "@/lib/supabase/server"

export type RequestRow = {
  id: string
  type: string
  status: string
  description: string | null
  created_at: string
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
