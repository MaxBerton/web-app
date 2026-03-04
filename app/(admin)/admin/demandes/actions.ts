"use server"

import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/auth"
import { getFormString } from "@/lib/form-data"
import { createClient } from "@/lib/supabase/server"

export async function updateRequestStatusAction(formData: FormData) {
  await requireAdmin()
  const requestId = getFormString(formData, "request_id")
  const status = getFormString(formData, "status")

  if (!requestId || !status) {
    return
  }

  const supabase = await createClient()
  const { error } = await supabase.from("requests").update({ status }).eq("id", requestId)

  if (error) {
    console.error("[admin.updateRequestStatusAction]", error.message)
  }

  revalidatePath("/admin/demandes")
  revalidatePath(`/admin/demandes/${requestId}`)
}
