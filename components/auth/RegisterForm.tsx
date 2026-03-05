"use client"

import { useState } from "react"
import { registerAction } from "@/app/actions/auth"
import { PasswordWithToggle } from "@/components/auth/PasswordWithToggle"

const PASSWORD_MISMATCH_MESSAGE = "Les mots de passe ne correspondent pas."

type RegisterFormProps = {
  inputClass: string
  serverErrorMessage: string | null
}

export function RegisterForm({ inputClass, serverErrorMessage }: RegisterFormProps) {
  const [clientError, setClientError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setClientError(null)

    const form = e.currentTarget
    const fd = new FormData(form)
    const password = fd.get("password")
    const confirmPassword = fd.get("confirm_password")

    if (password !== confirmPassword) {
      setClientError(PASSWORD_MISMATCH_MESSAGE)
      return
    }

    await registerAction(fd)
  }

  const errorMessage = clientError ?? serverErrorMessage

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      {errorMessage && (
        <p className="rounded-dr-tri border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {errorMessage}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid min-w-0 gap-1.5 text-dr-tri-dark">
          Prénom
          <input type="text" name="first_name" required placeholder="Votre prénom" className={inputClass} />
        </label>
        <label className="grid min-w-0 gap-1.5 text-dr-tri-dark">
          Nom
          <input type="text" name="last_name" required placeholder="Votre nom" className={inputClass} />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid min-w-0 gap-1.5 text-dr-tri-dark">
          E-mail
          <input type="email" name="email" required placeholder="votre@email.ch" className={inputClass} />
        </label>
        <label className="grid min-w-0 gap-1.5 text-dr-tri-dark">
          Téléphone
          <input
            type="tel"
            name="phone"
            placeholder="Ex. +41 79 123 45 67"
            className={inputClass}
          />
        </label>
      </div>
      <PasswordWithToggle
        name="password"
        label="Mot de passe"
        minLength={8}
        required
        className={inputClass}
        hint="Minimum 8 caractères"
      />
      <PasswordWithToggle
        name="confirm_password"
        label="Confirmer le mot de passe"
        minLength={8}
        required
        className={inputClass}
      />
      <label className="flex items-start gap-2 text-sm text-dr-tri-muted">
        <input type="checkbox" name="terms" required className="mt-1 h-4 w-4 rounded border-dr-tri-border" />
        <span>J&apos;accepte les conditions d&apos;utilisation</span>
      </label>
      <button type="submit" className="btn-primary mt-1 w-full justify-center">
        Créer mon compte
      </button>
    </form>
  )
}
