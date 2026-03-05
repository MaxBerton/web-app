"use client"

import { useCallback, useEffect, useRef, useState } from "react"

const MAPBOX_GEOCODE_URL = "https://api.mapbox.com/geocoding/v5/mapbox.places"
const DEBOUNCE_MS = 300
const COUNTRY = "CH"

export type MapboxAddressValue = {
  street: string
  postal_code: string
  city: string
  lat: number | null
  lng: number | null
}

type MapboxFeature = {
  id: string
  place_name: string
  text?: string
  address?: string
  context?: Array<{ id: string; text: string }>
  geometry: { coordinates: [number, number] }
}

type MapboxGeocodeResponse = {
  features: MapboxFeature[]
}

function parseFeature(f: MapboxFeature): MapboxAddressValue {
  const [lng, lat] = f.geometry?.coordinates ?? [0, 0]
  const ctx = f.context ?? []
  const postcode = ctx.find((c) => c.id.startsWith("postcode."))?.text ?? ""
  const place = ctx.find((c) => c.id.startsWith("place."))?.text ?? ""
  const street =
    [f.address, f.text].filter(Boolean).join(" ").trim() ||
    f.place_name.split(",")[0]?.trim() ||
    ""
  return {
    street: street || f.place_name,
    postal_code: postcode,
    city: place,
    lat: lat ?? null,
    lng: lng ?? null,
  }
}

type MapboxAddressInputProps = {
  value?: MapboxAddressValue | null
  onSelect?: (value: MapboxAddressValue) => void
  name?: string
  placeholder?: string
  id?: string
  disabled?: boolean
  className?: string
  /** Noms des champs cachés pour soumission formulaire (street, postal_code, city, latitude, longitude). Si fournis, des inputs hidden sont rendus. */
  hiddenInputNames?: {
    street?: string
    postal_code?: string
    city?: string
    latitude?: string
    longitude?: string
  }
}

export function MapboxAddressInput({
  value,
  onSelect,
  name,
  placeholder = "Rechercher une adresse…",
  id,
  disabled = false,
  className = "",
  hiddenInputNames,
}: MapboxAddressInputProps) {
  const token =
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
      : undefined
  const [query, setQuery] = useState(() =>
    value ? [value.street, value.postal_code, value.city].filter(Boolean).join(", ") : ""
  )
  const [suggestions, setSuggestions] = useState<MapboxAddressValue[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const fetchSuggestions = useCallback(
    async (q: string) => {
      if (!token || !q.trim()) {
        setSuggestions([])
        return
      }
      setLoading(true)
      try {
        const params = new URLSearchParams({
          access_token: token,
          country: COUNTRY,
          types: "address,place",
          limit: "5",
        })
        const res = await fetch(
          `${MAPBOX_GEOCODE_URL}/${encodeURIComponent(q.trim())}.json?${params}`
        )
        if (!res.ok) {
          setSuggestions([])
          return
        }
        const data = (await res.json()) as MapboxGeocodeResponse
        const list = (data.features ?? []).map(parseFeature)
        setSuggestions(list)
        setOpen(true)
      } catch {
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    },
    [token]
  )

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!query.trim()) {
      setSuggestions([])
      setOpen(false)
      return
    }
    debounceRef.current = setTimeout(() => fetchSuggestions(query), DEBOUNCE_MS)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, fetchSuggestions])

  useEffect(() => {
    if (value) {
      setQuery(
        [value.street, value.postal_code, value.city].filter(Boolean).join(", ")
      )
    }
  }, [value?.street, value?.postal_code, value?.city])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  const handleSelect = (v: MapboxAddressValue) => {
    setQuery([v.street, v.postal_code, v.city].filter(Boolean).join(", "))
    setSuggestions([])
    setOpen(false)
    onSelect?.(v)
  }

  const names = hiddenInputNames ?? {
    street: name ? `${name}_street` : undefined,
    postal_code: name ? `${name}_postal_code` : undefined,
    city: name ? `${name}_city` : undefined,
    latitude: name ? `${name}_latitude` : undefined,
    longitude: name ? `${name}_longitude` : undefined,
  }
  const current = value ?? { street: "", postal_code: "", city: "", lat: null, lng: null }
  const showHiddenInputs = (hiddenInputNames ?? name) && (names.street ?? names.postal_code ?? names.city)

  return (
    <div ref={containerRef} className="relative">
      <input
        type="search"
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        placeholder={placeholder}
        id={id}
        name={name}
        disabled={disabled}
        className={className}
      />
      {open && suggestions.length > 0 && (
        <ul
          className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-md border border-dr-tri-border bg-white py-1 shadow-lg"
          role="listbox"
        >
          {suggestions.map((s, i) => (
            <li
              key={`${s.street}-${s.postal_code}-${s.city}-${i}`}
              role="option"
              className="cursor-pointer px-3 py-2 text-sm text-dr-tri-dark hover:bg-dr-tri-background"
              onClick={() => handleSelect(s)}
            >
              {[s.street, s.postal_code, s.city].filter(Boolean).join(", ")}
            </li>
          ))}
        </ul>
      )}
      {loading && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-dr-tri-muted">
          …
        </span>
      )}
      {showHiddenInputs && (
        <>
          {names.street != null && (
            <input type="hidden" name={names.street} value={current.street} />
          )}
          {names.postal_code != null && (
            <input type="hidden" name={names.postal_code} value={current.postal_code} />
          )}
          {names.city != null && (
            <input type="hidden" name={names.city} value={current.city} />
          )}
          {names.latitude != null && current.lat != null && (
            <input type="hidden" name={names.latitude} value={String(current.lat)} />
          )}
          {names.longitude != null && current.lng != null && (
            <input type="hidden" name={names.longitude} value={String(current.lng)} />
          )}
        </>
      )}
    </div>
  )
}
