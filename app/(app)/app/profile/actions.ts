"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getFormString } from "@/lib/form-data"
import { createClient } from "@/lib/supabase/server"

const PROFILE_PATH = "/app/profile"

const PHONE_REGEX = /^[\d\s+().-]{8,20}$/
const ZIP_REGEX = /^\d{4,5}$/

function validatePhone(value: string): string | null {
  if (!value.trim()) return null
  const v = value.trim()
  return PHONE_REGEX.test(v) ? null : "Format invalide (8 à 20 caractères, chiffres et + . - ( ))"
}

function validateZip(value: string): string | null {
  if (!value.trim()) return null
  return ZIP_REGEX.test(value.trim()) ? null : "Code postal invalide (4 ou 5 chiffres)"
}

export type ProfileFormState = {
  error?: string
  saved?: boolean
}

export async function updateProfileAction(
  _prev: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const firstName = getFormString(formData, "first_name").trim()
  const lastName = getFormString(formData, "last_name").trim()
  const phone = getFormString(formData, "phone").trim()

  const phoneErr = validatePhone(phone)
  if (phoneErr) return { error: phoneErr }

  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: firstName || null,
      last_name: lastName || null,
      phone: phone || null,
    })
    .eq("id", user.id)

  if (error) {
    console.error("[profile.updateProfile]", error.message)
    return { error: "Impossible d'enregistrer les modifications." }
  }
  revalidatePath(PROFILE_PATH)
  return { saved: true }
}

export async function updateAddressAction(
  _prev: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const street = getFormString(formData, "street").trim()
  const postalCode = getFormString(formData, "postal_code").trim()
  const city = getFormString(formData, "city").trim()
  const latRaw = getFormString(formData, "latitude")
  const lngRaw = getFormString(formData, "longitude")
  const latitude = latRaw ? parseFloat(latRaw) : null
  const longitude = lngRaw ? parseFloat(lngRaw) : null
  const hasCoords = latitude != null && !Number.isNaN(latitude) && longitude != null && !Number.isNaN(longitude)

  const zipErr = validateZip(postalCode)
  if (zipErr) return { error: zipErr }

  const { data: existing } = await supabase
    .from("addresses")
    .select("id")
    .eq("profile_id", user.id)
    .limit(1)
    .maybeSingle()

  if (existing) {
    if (!street.trim() || !city.trim()) {
      return { error: "Rue et ville sont requis." }
    }
    const { error } = await supabase
      .from("addresses")
      .update({
        street: street.trim(),
        postal_code: postalCode || null,
        city: city.trim(),
        ...(hasCoords ? { latitude, longitude } : {}),
      })
      .eq("id", existing.id)

    if (error) {
      console.error("[profile.updateAddress]", error.message)
      return { error: "Impossible d'enregistrer l'adresse." }
    }
  } else {
    if (!street || !city) return { error: "Rue et ville sont requis pour créer une adresse." }
    const { error } = await supabase.from("addresses").insert({
      profile_id: user.id,
      label: "Par défaut",
      street,
      postal_code: postalCode || null,
      city,
      country: "CH",
      ...(hasCoords ? { latitude, longitude } : {}),
    })
    if (error) {
      console.error("[profile.insertAddress]", error.message)
      return { error: "Impossible de créer l'adresse." }
    }
  }
  revalidatePath(PROFILE_PATH)
  return { saved: true }
}
