"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getFormString } from "@/lib/form-data"
import { createClient } from "@/lib/supabase/server"
import { REQUEST_STATUSES } from "@/lib/types"

export async function createRequestAction(formData: FormData) {
  const serviceType = getFormString(formData, "service_type", "other")
  const description = getFormString(formData, "description")
  const requestedDate = getFormString(formData, "requested_date")
  const notes = getFormString(formData, "notes")

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
        notes,
      },
    })
    .select("id")
    .single()

  if (error || !request) {
    console.error("[demandes.createRequestAction]", error?.message)
    redirect("/app/demandes/nouvelle?error=create_failed")
  }

  const file = formData.get("attachment")
  if (file instanceof File && file.size > 0) {
    const filePath = `${user.id}/${request.id}/${Date.now()}-${file.name}`
    const uploadResult = await supabase.storage.from("request-attachments").upload(filePath, file)

    if (uploadResult.error) {
      console.error("[demandes.upload]", uploadResult.error.message)
    } else {
      await supabase.from("attachments").insert({
        request_id: request.id,
        file_path: filePath,
        uploaded_by: user.id,
      })
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
