"use client"

import { useEffect, useState, useActionState } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import { updateAddressAction, type ProfileFormState } from "@/app/(app)/app/profile/actions"
import { MapboxAddressInput, type MapboxAddressValue } from "@/components/address/MapboxAddressInput"

type AddressFormProps = {
  initial: {
    street: string | null
    postal_code: string | null
    city: string | null
  } | null
}

const inputReadOnlyClass =
  "block w-full rounded-md border border-dr-tri-border bg-dr-tri-background px-3 py-2 text-sm text-dr-tri-dark"
const btnLinkClass =
  "text-sm font-medium text-dr-tri-primary hover:underline underline-offset-2"
const btnSubtleClass =
  "inline-flex items-center rounded-md border border-dr-tri-border bg-white px-3 py-1.5 text-sm font-medium text-dr-tri-dark hover:bg-dr-tri-background transition-colors"
const inputClass =
  "w-full rounded-md border border-dr-tri-border bg-white px-3 py-2 text-sm text-dr-tri-dark placeholder-dr-tri-muted focus:border-dr-tri-primary focus:outline-none focus:ring-1 focus:ring-dr-tri-primary/20"

function isFilled(value: string | null): boolean {
  return value != null && String(value).trim() !== ""
}

function toAddressValue(initial: AddressFormProps["initial"]): MapboxAddressValue | null {
  if (!initial) return null
  const street = initial.street ?? ""
  const postal_code = initial.postal_code ?? ""
  const city = initial.city ?? ""
  if (!street && !postal_code && !city) return null
  return { street, postal_code, city, lat: null, lng: null }
}

export function AddressForm({ initial }: AddressFormProps) {
  const router = useRouter()
  const [state, formAction] = useActionState<ProfileFormState, FormData>(
    updateAddressAction,
    {}
  )
  const [showSaved, setShowSaved] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [addressValue, setAddressValue] = useState<MapboxAddressValue | null>(() =>
    toAddressValue(initial)
  )

  useEffect(() => {
    if (state?.saved) {
      setShowSaved(true)
      setIsEditing(false)
      router.refresh()
      const t = setTimeout(() => setShowSaved(false), 4000)
      return () => clearTimeout(t)
    }
  }, [state?.saved, router])

  useEffect(() => {
    const v = toAddressValue(initial)
    if (v) setAddressValue(v)
  }, [initial?.street, initial?.postal_code, initial?.city])

  const addr = initial ?? { street: null, postal_code: null, city: null }
  const hasAnyFilled = isFilled(addr.street) || isFilled(addr.postal_code) || isFilled(addr.city)
  const displayLine = [addr.street, addr.postal_code, addr.city].filter(Boolean).join(", ") || "—"
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
          Adresse
          {isEditing || !hasAnyFilled ? (
            <MapboxAddressInput
              value={addressValue}
              onSelect={setAddressValue}
              placeholder="Rechercher une adresse…"
              className={inputClass}
              hiddenInputNames={{
                street: "street",
                postal_code: "postal_code",
                city: "city",
                latitude: "latitude",
                longitude: "longitude",
              }}
            />
          ) : (
            <span className={inputReadOnlyClass}>{displayLine}</span>
          )}
        </label>
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
