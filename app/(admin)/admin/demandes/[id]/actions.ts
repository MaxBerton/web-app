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
  const amountChf = getFormString(formData, "amount_chf")
  const details = getFormString(formData, "details")
  const employees = Number.parseInt(getFormString(formData, "employees_count", "0"), 10)
  const estimatedHours = Number.parseFloat(getFormString(formData, "estimated_hours", "0"))
  const employeeRate = Number.parseFloat(getFormString(formData, "employee_hourly_rate", "0"))
  const distanceKm = Number.parseFloat(getFormString(formData, "distance_km", "0"))
  const kilometerRate = Number.parseFloat(getFormString(formData, "kilometer_rate", "0"))
  const interventionAddress = getFormString(formData, "intervention_address")
  const depotAddress = getFormString(formData, "depot_address")

  const amount = Number.parseFloat(amountChf)
  if (!requestId || Number.isNaN(amount) || amount <= 0) {
    return
  }

  const amountCents = Math.round(amount * 100)
  const supabase = await createClient()

  const detailLines = [
    details.trim(),
    "",
    "Configuration du devis:",
    Number.isFinite(employees) && employees > 0 ? `- Employes: ${employees}` : null,
    Number.isFinite(estimatedHours) && estimatedHours > 0 ? `- Heures estimees: ${estimatedHours}` : null,
    Number.isFinite(employeeRate) && employeeRate >= 0 ? `- Tarif employe/h: ${employeeRate} CHF` : null,
    Number.isFinite(distanceKm) && distanceKm >= 0 ? `- Distance calculee: ${distanceKm} km` : null,
    Number.isFinite(kilometerRate) && kilometerRate >= 0 ? `- Tarif km: ${kilometerRate} CHF/km` : null,
    interventionAddress ? `- Adresse intervention: ${interventionAddress}` : null,
    depotAddress ? `- Adresse depot: ${depotAddress}` : null,
  ]
    .filter(Boolean)
    .join("\n")

  const { error: quoteError } = await supabase.from("quotes").insert({
    request_id: requestId,
    amount_cents: amountCents,
    currency: "chf",
    status: "sent",
    details: detailLines,
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
