"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getFormString } from "@/lib/form-data"
import { createClient } from "@/lib/supabase/server"
import { REQUEST_STATUSES } from "@/lib/types"

const MAX_ATTACHMENTS = 5
const VALID_TYPES = ["clearance", "transport", "moving", "recycling", "other"] as const

export async function createRequestAction(formData: FormData) {
  const type = getFormString(formData, "type") || getFormString(formData, "service_type") || "other"
  const description = getFormString(formData, "description")
  const street = getFormString(formData, "street")
  const postalCode = getFormString(formData, "postal_code")
  const city = getFormString(formData, "city")
  const latRaw = getFormString(formData, "latitude")
  const lngRaw = getFormString(formData, "longitude")
  const latitude = latRaw ? parseFloat(latRaw) : null
  const longitude = lngRaw ? parseFloat(lngRaw) : null
  const hasCoords = latitude != null && !Number.isNaN(latitude) && longitude != null && !Number.isNaN(longitude)
  const requestedDatesJson = getFormString(formData, "requested_dates")
  let requestedDates: string[] = []
  if (requestedDatesJson?.trim()) {
    try {
      const parsed = JSON.parse(requestedDatesJson)
      if (Array.isArray(parsed)) {
        requestedDates = parsed.filter((d): d is string => typeof d === "string" && d.trim() !== "")
      }
    } catch {
      // ignore
    }
  }
  const accessConstraints = getFormString(formData, "access_constraints")
  const detailsJson = getFormString(formData, "details_json")

  let details: Record<string, unknown> = {}
  if (detailsJson?.trim()) {
    try {
      const parsed = JSON.parse(detailsJson) as Record<string, unknown>
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        details = parsed
      }
    } catch {
      // ignore invalid JSON
    }
  }

  if (!description?.trim()) {
    redirect("/app/demandes/nouvelle?error=missing_required")
  }

  const serviceType = VALID_TYPES.includes(type as (typeof VALID_TYPES)[number]) ? type : "other"

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  let addressId: string | null = null
  if (street?.trim() && city?.trim()) {
    const { data: address, error: addrError } = await supabase
      .from("addresses")
      .insert({
        profile_id: user.id,
        street: street.trim(),
        postal_code: postalCode?.trim() || null,
        city: city.trim(),
        country: "CH",
        ...(hasCoords ? { latitude, longitude } : {}),
      })
      .select("id")
      .single()

    if (!addrError && address) {
      addressId = address.id
    }
  }

  const { data: request, error } = await supabase
    .from("requests")
    .insert({
      client_id: user.id,
      address_id: addressId,
      type: serviceType,
      status: REQUEST_STATUSES[1],
      description: description.trim(),
      payload: {
        requested_dates: requestedDates.length > 0 ? requestedDates : null,
        access_constraints: accessConstraints || null,
        ...details,
      },
    })
    .select("id")
    .single()

  if (error || !request) {
    console.error("[demandes.createRequestAction]", error?.message)
    redirect("/app/demandes/nouvelle?error=create_failed")
  }

  const files = formData.getAll("attachments").filter((e): e is File => e instanceof File && e.size > 0)
  for (let i = 0; i < Math.min(files.length, MAX_ATTACHMENTS); i++) {
    const entry = files[i]
    const filePath = `${user.id}/${request.id}/${Date.now()}-${i}-${entry.name}`
    const uploadResult = await supabase.storage
      .from("request-attachments")
      .upload(filePath, entry, { contentType: entry.type || "application/octet-stream" })

    if (uploadResult.error) {
      console.error("[demandes.upload]", uploadResult.error.message, filePath)
      continue
    }

    const { error: insertError } = await supabase.from("attachments").insert({
      request_id: request.id,
      file_path: filePath,
      uploaded_by: user.id,
    })
    if (insertError) {
      console.error("[demandes.attachments.insert]", insertError.message, filePath)
    }
  }

  revalidatePath("/app/demandes")
  redirect(`/app/demandes/${request.id}`)
}

export async function sendMessageAction(formData: FormData) {
  const requestId = getFormString(formData, "request_id")
  const message = getFormString(formData, "message")
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !requestId || !message) {
    return
  }

  const { error } = await supabase.from("messages").insert({
    request_id: requestId,
    sender_id: user.id,
    message,
  })

  if (error) {
    console.error("[demandes.sendMessageAction]", error.message)
  }

  revalidatePath(`/app/demandes/${requestId}`)
}
