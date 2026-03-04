"use client"

type AddressFieldsProps = {
  street?: string
  postalCode?: string
  city?: string
  onChange?: (field: "street" | "postal_code" | "city", value: string) => void
}

const inputClass =
  "w-full rounded border border-dr-tri-border bg-white px-3 py-2 text-dr-tri-dark placeholder-dr-tri-muted focus:border-dr-tri-primary focus:outline-none"

export function AddressFields({
  street = "",
  postalCode = "",
  city = "",
  onChange,
}: AddressFieldsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <label className="grid gap-1.5 text-sm text-dr-tri-muted sm:col-span-3">
        Adresse (rue, n°)
        <input
          type="text"
          name="street"
          defaultValue={street}
          onChange={(e) => onChange?.("street", e.target.value)}
          placeholder="Ex. Avenue de la Gare 10"
          className={inputClass}
        />
      </label>
      <label className="grid gap-1.5 text-sm text-dr-tri-muted">
        Code postal
        <input
          type="text"
          name="postal_code"
          defaultValue={postalCode}
          onChange={(e) => onChange?.("postal_code", e.target.value)}
          placeholder="Ex. 1003"
          className={inputClass}
        />
      </label>
      <label className="grid gap-1.5 text-sm text-dr-tri-muted sm:col-span-2">
        Ville
        <input
          type="text"
          name="city"
          defaultValue={city}
          onChange={(e) => onChange?.("city", e.target.value)}
          placeholder="Ex. Lausanne"
          className={inputClass}
        />
      </label>
    </div>
  )
}
