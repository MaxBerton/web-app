"use server"

import { redirect } from "next/navigation"
import { getFormString } from "@/lib/form-data"

export async function contactFormAction(formData: FormData) {
  const first_name = getFormString(formData, "first_name")
  const last_name = getFormString(formData, "last_name")
  const email = getFormString(formData, "email")
  const message = getFormString(formData, "message")

  if (!email?.trim() || !message?.trim()) {
    redirect("/app/contact?error=1")
  }

  // TODO: envoyer par e-mail (ex. Resend) ou enregistrer en base
  redirect("/app/contact?success=1")
}
