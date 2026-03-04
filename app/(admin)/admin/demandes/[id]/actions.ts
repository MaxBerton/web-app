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

export async function createQuoteAction(formData: FormData) {
  await requireAdmin()
  const requestId = getFormString(formData, "request_id")
  const amountEuros = getFormString(formData, "amount_euros")
  const details = getFormString(formData, "details")

  const amount = Number.parseFloat(amountEuros)
  if (!requestId || Number.isNaN(amount) || amount <= 0) {
    return
  }

  const amountCents = Math.round(amount * 100)
  const supabase = await createClient()

  const { error: quoteError } = await supabase.from("quotes").insert({
    request_id: requestId,
    amount_cents: amountCents,
    status: "sent",
    details,
  })

  if (quoteError) {
    console.error("[admin.createQuoteAction]", quoteError.message)
    return
  }

  const { error: requestError } = await supabase
    .from("requests")
    .update({ status: "quote_sent" })
    .eq("id", requestId)

  if (requestError) {
    console.error("[admin.createQuoteAction.request]", requestError.message)
  }

  revalidatePath(`/admin/demandes/${requestId}`)
  revalidatePath(`/app/demandes/${requestId}`)
  revalidatePath("/app/documents")
}
