"use client"

import { useEffect, useState, useActionState } from "react"
import { useFormStatus } from "react-dom"
import { updateProfileAction, type ProfileFormState } from "@/app/(app)/app/profile/actions"

type ProfileFormProps = {
  initial: {
    first_name: string | null
    last_name: string | null
    email: string | null
    phone: string | null
  }
}

const inputClass =
  "w-full rounded-md border border-dr-tri-border bg-white px-3 py-2 text-sm text-dr-tri-dark placeholder-dr-tri-muted focus:border-dr-tri-primary focus:outline-none focus:ring-1 focus:ring-dr-tri-primary/20"
const inputReadOnlyClass =
  "block w-full rounded-md border border-dr-tri-border bg-dr-tri-background px-3 py-2 text-sm text-dr-tri-dark"
const btnLinkClass =
  "text-sm font-medium text-dr-tri-primary hover:underline underline-offset-2"
const btnSubtleClass =
  "inline-flex items-center rounded-md border border-dr-tri-border bg-white px-3 py-1.5 text-sm font-medium text-dr-tri-dark hover:bg-dr-tri-background transition-colors"
const btnPrimarySubtleClass =
  "inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-white bg-dr-tri-primary hover:bg-dr-tri-primary-hover transition-colors"

function isFilled(value: string | null): boolean {
  return value != null && String(value).trim() !== ""
}

export function ProfileForm({ initial }: ProfileFormProps) {
  const [state, formAction] = useActionState<ProfileFormState, FormData>(
    updateProfileAction,
    {}
  )
  const [showSaved, setShowSaved] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (state?.saved) {
      setShowSaved(true)
      setIsEditing(false)
      const t = setTimeout(() => setShowSaved(false), 4000)
      return () => clearTimeout(t)
    }
  }, [state?.saved])

  const canEditFirst = !isFilled(initial.first_name) || isEditing
  const canEditLast = !isFilled(initial.last_name) || isEditing
  const canEditPhone = !isFilled(initial.phone) || isEditing
  const hasAnyFilled = isFilled(initial.first_name) || isFilled(initial.last_name) || isFilled(initial.phone)
  const showEditButton = !isEditing && hasAnyFilled
  const showSubmitWhenEmpty = !hasAnyFilled && !isEditing

  return (
    <section className="rounded-lg border border-dr-tri-border bg-white p-6" aria-labelledby="profile-heading">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        <h2 id="profile-heading" className="text-base font-semibold text-dr-tri-dark">
          Infos compte
        </h2>
        {showEditButton && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className={btnLinkClass}
          >
            Modifier
          </button>
        )}
      </div>
      {showSaved && (
        <p className="mb-4 rounded-md bg-dr-tri-light-green/30 px-3 py-2 text-sm text-dr-tri-primary">
          Modifications enregistrées.
        </p>
      )}
      {state?.error && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50/80 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <form action={formAction} className="grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm text-dr-tri-muted">
            Prénom
            {canEditFirst ? (
              <input
                type="text"
                name="first_name"
                defaultValue={initial.first_name ?? ""}
                placeholder="Votre prénom"
                className={inputClass}
              />
            ) : (
              <span className={inputReadOnlyClass}>{initial.first_name}</span>
            )}
          </label>
          <label className="grid gap-1.5 text-sm text-dr-tri-muted">
            Nom
            {canEditLast ? (
              <input
                type="text"
                name="last_name"
                defaultValue={initial.last_name ?? ""}
                placeholder="Votre nom"
                className={inputClass}
              />
            ) : (
              <span className={inputReadOnlyClass}>{initial.last_name}</span>
            )}
          </label>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm text-dr-tri-muted">
            Email
            <input
              type="email"
              value={initial.email ?? ""}
              readOnly
              aria-readonly="true"
              className="w-full rounded-md border border-dr-tri-border bg-dr-tri-background px-3 py-2 text-sm text-dr-tri-muted"
            />
          </label>
          <label className="grid gap-1.5 text-sm text-dr-tri-muted">
            Téléphone
            {canEditPhone ? (
              <input
                type="tel"
                name="phone"
                defaultValue={initial.phone ?? ""}
                placeholder="Ex. +41 79 123 45 67"
                className={inputClass}
              />
            ) : (
              <span className={inputReadOnlyClass}>{initial.phone ?? "—"}</span>
            )}
          </label>
        </div>
        {(isEditing || showSubmitWhenEmpty) && (
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-dr-tri-border/60 pt-4 mt-1">
            <ProfileFormSubmitButton />
            {isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className={btnSubtleClass}
              >
                Annuler
              </button>
            )}
          </div>
        )}
      </form>
    </section>
  )
}

function ProfileFormSubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className={btnPrimarySubtleClass} disabled={pending}>
      {pending ? "Enregistrement…" : "Enregistrer"}
    </button>
  )
}
