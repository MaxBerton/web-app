"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getFormString } from "@/lib/form-data"
import { createClient } from "@/lib/supabase/server"
import { REQUEST_STATUSES } from "@/lib/types"

export async function createRequestAction(formData: FormData) {
  const serviceType = getFormString(formData, "service_type", "other")
  const description = getFormString(formData, "description")
  const interventionAddress = getFormString(formData, "intervention_address")
  const departureAddress = getFormString(formData, "departure_address")
  const destinationAddress = getFormString(formData, "destination_address")
  const housingType = getFormString(formData, "housing_type")
  const floorFrom = getFormString(formData, "floor_from")
  const floorTo = getFormString(formData, "floor_to")
  const elevatorFrom = getFormString(formData, "elevator_from")
  const elevatorTo = getFormString(formData, "elevator_to")
  const inventorySummary = getFormString(formData, "inventory_summary")
  const estimatedVolume = getFormString(formData, "estimated_volume_m3")
  const requestedWorkers = getFormString(formData, "requested_workers")
  const accessConstraints = getFormString(formData, "access_constraints")
  const requestedDate = getFormString(formData, "requested_date")
  const timeWindow = getFormString(formData, "time_window")
  const urgencyLevel = getFormString(formData, "urgency_level")
  const notes = getFormString(formData, "notes")

  if (!serviceType || !interventionAddress || !inventorySummary || !requestedDate) {
    redirect("/app/demandes/nouvelle?error=missing_required")
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: request, error } = await supabase
    .from("requests")
    .insert({
      client_id: user.id,
      type: serviceType,
      status: REQUEST_STATUSES[1],
      description,
      payload: {
        requested_date: requestedDate,
        time_window: timeWindow,
        urgency_level: urgencyLevel,
        notes,
        intervention_address: interventionAddress,
        departure_address: departureAddress,
        destination_address: destinationAddress,
        housing_type: housingType,
        floor_from: floorFrom,
        floor_to: floorTo,
        elevator_from: elevatorFrom,
        elevator_to: elevatorTo,
        inventory_summary: inventorySummary,
        estimated_volume_m3: estimatedVolume,
        requested_workers: requestedWorkers,
        access_constraints: accessConstraints,
      },
    })
    .select("id")
    .single()

  if (error || !request) {
    console.error("[demandes.createRequestAction]", error?.message)
    redirect("/app/demandes/nouvelle?error=create_failed")
  }

  const files = formData.getAll("attachments")
  for (const entry of files) {
    if (!(entry instanceof File) || entry.size === 0) {
      continue
    }
    const filePath = `${user.id}/${request.id}/${Date.now()}-${entry.name}`
    const uploadResult = await supabase.storage.from("request-attachments").upload(filePath, entry)

    if (uploadResult.error) {
      console.error("[demandes.upload]", uploadResult.error.message)
      continue
    }

    await supabase.from("attachments").insert({
      request_id: request.id,
      file_path: filePath,
      uploaded_by: user.id,
    })
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
