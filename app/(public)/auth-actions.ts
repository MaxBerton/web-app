"use server"

import { redirect } from "next/navigation"
import { getFormString } from "@/lib/form-data"
import { createClient } from "@/lib/supabase/server"

export async function signInAction(formData: FormData) {
  const email = getFormString(formData, "email")
  const password = getFormString(formData, "password")

  if (!email || !password) {
    redirect("/login?error=missing_fields")
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    redirect("/login?error=invalid_credentials")
  }

  redirect("/app")
}

export async function registerAction(formData: FormData) {
  const email = getFormString(formData, "email")
  const password = getFormString(formData, "password")

  if (!email || !password) {
    redirect("/register?error=missing_fields")
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({ email, password })

  if (error) {
    redirect("/register?error=cannot_register")
  }

  redirect("/app")
}
