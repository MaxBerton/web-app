"use server"

import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/auth"
import { getFormString } from "@/lib/form-data"
import { createClient } from "@/lib/supabase/server"

export async function sendAdminMessageAction(formData: FormData) {
  const admin = await requireAdmin()
  const requestId = getFormString(formData, "request_id")
  const message = getFormString(formData, "message")

  if (!requestId || !message) {
    return
  }

  const supabase = await createClient()
  const { error } = await supabase.from("messages").insert({
    request_id: requestId,
    sender_id: admin.id,
    message,
  })

  if (error) {
    console.error("[admin.sendAdminMessageAction]", error.message)
  }

  revalidatePath(`/admin/demandes/${requestId}`)
  revalidatePath(`/app/demandes/${requestId}`)
}
