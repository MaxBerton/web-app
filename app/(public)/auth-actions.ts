"use server"

import { redirect } from "next/navigation"
import { getFormString } from "@/lib/form-data"
import { createClient } from "@/lib/supabase/server"

function sanitizeNextPath(pathname: string): string {
  return pathname.startsWith("/") ? pathname : "/app"
}

export async function signInAction(formData: FormData) {
  const email = getFormString(formData, "email")
  const password = getFormString(formData, "password")
  const nextPath = sanitizeNextPath(getFormString(formData, "next", "/app"))

  if (!email || !password) {
    redirect("/login?error=missing_fields")
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    const code = error.code === "email_not_confirmed" ? "email_not_confirmed" : "invalid_credentials"
    const detail = encodeURIComponent(error.message)
    redirect(`/login?error=${code}&detail=${detail}`)
  }

  redirect(nextPath)
}

export async function registerAction(formData: FormData) {
  const email = getFormString(formData, "email")
  const password = getFormString(formData, "password")

  if (!email || !password) {
    redirect("/register?error=missing_fields")
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) {
    const code = error.code ?? "cannot_register"
    const detail = encodeURIComponent(error.message)
    redirect(`/register?error=${code}&detail=${detail}`)
  }

  // If email confirmation is enabled, no session is created yet.
  if (!data.session) {
    redirect("/login?info=check_email")
  }

  redirect("/app")
}
