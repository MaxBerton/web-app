import { createClient } from "@/lib/supabase/server"

export type Appointment = {
  id: string
  scheduled_at: string
  status: string
  notes: string | null
  request_id: string
  request_type: string
  request_description: string | null
}

export async function getClientAppointments(): Promise<Appointment[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("appointments")
    .select(`
      id,
      scheduled_at,
      status,
      notes,
      request_id,
      requests!inner(type, description, client_id)
    `)
    .order("scheduled_at", { ascending: false })

  if (error || !data) return []

  return data.map((a) => {
    const req = Array.isArray(a.requests) ? a.requests[0] : a.requests
    return {
      id: a.id,
      scheduled_at: a.scheduled_at,
      status: a.status,
      notes: a.notes,
      request_id: a.request_id,
      request_type: req?.type ?? "—",
      request_description: req?.description ?? null,
    }
  })
}
