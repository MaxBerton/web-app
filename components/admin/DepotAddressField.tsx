"use client"

import { useState } from "react"
import { MapboxAddressInput, type MapboxAddressValue } from "@/components/address/MapboxAddressInput"

type DepotAddressFieldProps = {
  defaultValue?: string
  defaultLat?: number | null
  defaultLng?: number | null
}

function parseDefault(defaultValue: string): MapboxAddressValue {
  const parts = defaultValue?.split(",").map((s) => s.trim()).filter(Boolean) ?? []
  const street = parts[0] ?? ""
  const city = parts[parts.length - 1] ?? ""
  const postal_code = parts.length > 2 ? parts[1] ?? "" : ""
  return { street, postal_code, city, lat: null, lng: null }
}

export function DepotAddressField({
  defaultValue = "",
  defaultLat = null,
  defaultLng = null,
}: DepotAddressFieldProps) {
  const [value, setValue] = useState<MapboxAddressValue>(() => ({
    ...parseDefault(defaultValue),
    lat: defaultLat ?? null,
    lng: defaultLng ?? null,
  }))

  const addressLine = [value.street, value.postal_code, value.city].filter(Boolean).join(", ")

  return (
    <>
      <MapboxAddressInput
        value={value}
        onSelect={setValue}
        placeholder="Rechercher une adresse (ex. Lausanne, Suisse)"
        className="admin-input"
      />
      <input type="hidden" name="depot_address" value={addressLine || defaultValue} />
      {value.lat != null && <input type="hidden" name="depot_lat" value={String(value.lat)} />}
      {value.lng != null && <input type="hidden" name="depot_lng" value={String(value.lng)} />}
    </>
  )
}
