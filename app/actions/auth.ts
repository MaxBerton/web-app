"use server"

import { redirect } from "next/navigation"
import { getFormString } from "@/lib/form-data"
import { createClient } from "@/lib/supabase/server"

function sanitizeNextPath(pathname: string): string {
  return pathname.startsWith("/") ? pathname : "/app"
}

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/auth/login")
}

export async function signInAction(formData: FormData) {
  const email = getFormString(formData, "email")
  const password = getFormString(formData, "password")
  const nextPath = sanitizeNextPath(getFormString(formData, "next", "/app"))

  if (!email || !password) {
    redirect("/auth/login?error=missing_fields")
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    const code = error.code === "email_not_confirmed" ? "email_not_confirmed" : "invalid_credentials"
    const detail = encodeURIComponent(error.message)
    redirect(`/auth/login?error=${code}&detail=${detail}`)
  }

  redirect(nextPath)
}

export async function registerAction(formData: FormData) {
  const email = getFormString(formData, "email")
  const password = getFormString(formData, "password")
  const confirmPassword = getFormString(formData, "confirm_password")
  const firstName = getFormString(formData, "first_name")
  const lastName = getFormString(formData, "last_name")

  if (!email || !password) {
    redirect("/auth/register?error=missing_fields")
  }

  if (password !== confirmPassword) {
    redirect("/auth/register?error=password_mismatch")
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { first_name: firstName || undefined, last_name: lastName || undefined },
    },
  })

  if (error) {
    const code = error.code ?? "cannot_register"
    const detail = encodeURIComponent(error.message)
    redirect(`/auth/register?error=${code}&detail=${detail}`)
  }

  if (data.user && (firstName || lastName)) {
    await supabase
      .from("profiles")
      .update({
        first_name: firstName || null,
        last_name: lastName || null,
      })
      .eq("id", data.user.id)
  }

  if (!data.session) {
    redirect("/auth/login?info=check_email")
  }

  redirect("/app")
}

export async function forgotPasswordAction(formData: FormData) {
  const email = getFormString(formData, "email")
  if (!email) {
    redirect("/auth/forgot-password?error=missing_email")
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  const redirectTo = `${baseUrl}/auth/reset-password`

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })

  if (error) {
    redirect("/auth/forgot-password?error=send_failed")
  }
  redirect("/auth/forgot-password?success=1")
}
