"use client"

import { useEffect, useState, useActionState } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import { updateAddressAction, type ProfileFormState } from "@/app/(app)/app/profile/actions"

type AddressFormProps = {
  initial: {
    street: string | null
    postal_code: string | null
    city: string | null
  } | null
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

export function AddressForm({ initial }: AddressFormProps) {
  const router = useRouter()
  const [state, formAction] = useActionState<ProfileFormState, FormData>(
    updateAddressAction,
    {}
  )
  const [showSaved, setShowSaved] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (state?.saved) {
      setShowSaved(true)
      setIsEditing(false)
      router.refresh()
      const t = setTimeout(() => setShowSaved(false), 4000)
      return () => clearTimeout(t)
    }
  }, [state?.saved, router])

  const addr = initial ?? { street: null, postal_code: null, city: null }
  const hasAnyFilled = isFilled(addr.street) || isFilled(addr.postal_code) || isFilled(addr.city)
  const canEditStreet = !isFilled(addr.street) || isEditing
  const canEditPostal = !isFilled(addr.postal_code) || isEditing
  const canEditCity = !isFilled(addr.city) || isEditing
  const showEditButton = !isEditing && hasAnyFilled
  const showSubmitWhenEmpty = !hasAnyFilled && !isEditing

  return (
    <section className="rounded-lg border border-dr-tri-border bg-white p-6" aria-labelledby="address-heading">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        <h2 id="address-heading" className="text-base font-semibold text-dr-tri-dark">
          Adresse
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
          Adresse enregistrée.
        </p>
      )}
      {state?.error && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50/80 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <form action={formAction} className="grid gap-5">
        <label className="grid gap-1.5 text-sm text-dr-tri-muted">
          Adresse (rue, n°)
          {canEditStreet ? (
            <input
              type="text"
              name="street"
              defaultValue={addr.street ?? ""}
              placeholder="Ex. Avenue de la Gare 10"
              className={inputClass}
            />
          ) : (
            <span className={inputReadOnlyClass}>{addr.street}</span>
          )}
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm text-dr-tri-muted">
            Code postal
            {canEditPostal ? (
              <input
                type="text"
                name="postal_code"
                defaultValue={addr.postal_code ?? ""}
                placeholder="Ex. 1003"
                maxLength={5}
                className={inputClass}
              />
            ) : (
              <span className={inputReadOnlyClass}>{addr.postal_code ?? "—"}</span>
            )}
          </label>
          <label className="grid gap-1.5 text-sm text-dr-tri-muted">
            Ville
            {canEditCity ? (
              <input
                type="text"
                name="city"
                defaultValue={addr.city ?? ""}
                placeholder="Ex. Lausanne"
                className={inputClass}
              />
            ) : (
              <span className={inputReadOnlyClass}>{addr.city ?? "—"}</span>
            )}
          </label>
        </div>
        {(isEditing || showSubmitWhenEmpty) && (
          <div className="flex flex-wrap gap-2 pt-2">
            <AddressFormSubmitButton />
            {isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn border border-dr-tri-border bg-white text-dr-tri-dark hover:bg-dr-tri-background"
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

function AddressFormSubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-white bg-dr-tri-primary hover:bg-dr-tri-primary-hover transition-colors disabled:opacity-70" disabled={pending}>
      {pending ? "Enregistrement…" : "Enregistrer"}
    </button>
  )
}
