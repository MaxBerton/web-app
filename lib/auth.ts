import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function requireUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return user
}

export async function requireAdmin() {
  const user = await requireUser()
  const supabase = await createClient()
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin") {
    redirect("/app")
  }

  return user
}
