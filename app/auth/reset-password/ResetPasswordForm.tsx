"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function ResetPasswordForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = e.currentTarget
    const formData = new FormData(form)
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirm_password") as string

    if (!password || password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.")
      return
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.")
      return
    }

    const supabase = createClient()
    const { error: err } = await supabase.auth.updateUser({ password })

    if (err) {
      setError(err.message)
      return
    }
    setSuccess(true)
    setTimeout(() => router.push("/auth/login?info=password_updated"), 2000)
  }

  if (success) {
    return (
      <p className="mt-6 rounded-dr-tri bg-dr-tri-light-green px-3 py-2 text-sm text-dr-tri-dark">
        Mot de passe mis à jour. Redirection vers la connexion…
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
      {error && (
        <p className="rounded-dr-tri border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}
      <label className="grid gap-1.5 text-dr-tri-dark">
        Nouveau mot de passe
        <input
          type="password"
          name="password"
          minLength={8}
          required
          className="rounded-dr-tri border border-dr-tri-border px-3 py-2 focus:border-dr-tri-primary focus:outline-none focus:ring-1 focus:ring-dr-tri-primary"
        />
      </label>
      <label className="grid gap-1.5 text-dr-tri-dark">
        Confirmer le mot de passe
        <input
          type="password"
          name="confirm_password"
          minLength={8}
          required
          className="rounded-dr-tri border border-dr-tri-border px-3 py-2 focus:border-dr-tri-primary focus:outline-none focus:ring-1 focus:ring-dr-tri-primary"
        />
      </label>
      <button type="submit" className="btn-primary mt-2">
        Enregistrer le mot de passe
      </button>
    </form>
  )
}
