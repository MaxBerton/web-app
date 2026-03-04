"use server"

import { revalidatePath } from "next/cache"
import { requireUser } from "@/lib/auth"
import { getFormString } from "@/lib/form-data"
import { createClient } from "@/lib/supabase/server"

export async function respondToQuoteAction(formData: FormData) {
  const user = await requireUser()
  const quoteId = getFormString(formData, "quote_id")
  const decision = getFormString(formData, "decision")
  const requestId = getFormString(formData, "request_id")

  if (!quoteId || !["accepted", "refused"].includes(decision)) {
    return
  }

  const supabase = await createClient()
  const { error } = await supabase.rpc("respond_to_quote", {
    p_quote_id: quoteId,
    p_decision: decision,
  })

  if (error) {
    console.error("[documents.respondToQuoteAction]", error.message, user.id)
    return
  }

  revalidatePath("/app/documents")
  revalidatePath("/app/demandes")
  if (requestId) {
    revalidatePath(`/app/demandes/${requestId}`)
  }
}
