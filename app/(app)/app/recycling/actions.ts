"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { computePriceCentsFromConfig } from "@/lib/recycling-pricing"
import { getNextPickupDateFrom, getRecyclingPricingConfig } from "@/lib/recycling"

export async function createRecyclingSubscriptionAction(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const passesPerMonth = Number(formData.get("passes_per_month")) || 1
  const binsCount = Number(formData.get("bins_count")) || 6
  const largeBinsCount = Number(formData.get("large_bins_count")) || 0
  const pricingConfig = await getRecyclingPricingConfig()
  const priceCents = computePriceCentsFromConfig(pricingConfig, passesPerMonth, binsCount, largeBinsCount)

  const { error } = await supabase.from("subscriptions").insert({
    client_id: user.id,
    status: "active",
    frequency: "monthly",
    passes_per_month: Math.min(4, Math.max(1, passesPerMonth)),
    bins_count: Math.min(20, Math.max(1, binsCount)),
    large_bins_count: Math.max(0, largeBinsCount),
    price_cents: priceCents,
    next_pickup_date: getNextPickupDateFrom(new Date(), passesPerMonth),
  })

  if (error) {
    console.error("[createRecyclingSubscriptionAction]", error.message)
    return { error: error.message }
  }
  revalidatePath("/app/recycling")
  revalidatePath("/app")
  return { success: true }
}

export async function updateRecyclingSubscriptionAction(subscriptionId: string, formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Non connecté" }

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("id, client_id")
    .eq("id", subscriptionId)
    .eq("client_id", user.id)
    .single()
  if (!sub) return { error: "Abonnement introuvable" }

  const passesPerMonth = Number(formData.get("passes_per_month")) || 1
  const binsCount = Number(formData.get("bins_count")) || 6
  const largeBinsCount = Number(formData.get("large_bins_count")) || 0
  const pricingConfig = await getRecyclingPricingConfig()
  const priceCents = computePriceCentsFromConfig(pricingConfig, passesPerMonth, binsCount, largeBinsCount)

  const { error } = await supabase
    .from("subscriptions")
    .update({
      passes_per_month: Math.min(4, Math.max(1, passesPerMonth)),
      bins_count: Math.min(20, Math.max(1, binsCount)),
      large_bins_count: Math.max(0, largeBinsCount),
      price_cents: priceCents,
      next_pickup_date: getNextPickupDateFrom(new Date(), passesPerMonth),
    })
    .eq("id", subscriptionId)
    .eq("client_id", user.id)

  if (error) {
    console.error("[updateRecyclingSubscriptionAction]", error.message)
    return { error: error.message }
  }
  revalidatePath("/app/recycling")
  revalidatePath("/app/recycling/manage")
  revalidatePath("/app")
  return { success: true }
}

export async function addBinsRecyclingAction(subscriptionId: string, formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Non connecté" }

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("id, bins_count")
    .eq("id", subscriptionId)
    .eq("client_id", user.id)
    .single()
  if (!sub) return { error: "Abonnement introuvable" }

  const add = Number(formData.get("bins_to_add")) || 0
  const newCount = Math.min(20, Math.max(1, (sub.bins_count ?? 6) + add))
  if (newCount === (sub.bins_count ?? 6)) return { success: true }

  const { error } = await supabase
    .from("subscriptions")
    .update({ bins_count: newCount })
    .eq("id", subscriptionId)
    .eq("client_id", user.id)

  if (error) {
    console.error("[addBinsRecyclingAction]", error.message)
    return { error: error.message }
  }
  revalidatePath("/app/recycling")
  revalidatePath("/app/recycling/manage")
  revalidatePath("/app")
  return { success: true }
}

export async function suspendRecyclingSubscriptionAction(subscriptionId: string, formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Non connecté" }

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("id, client_id, passes_per_month")
    .eq("id", subscriptionId)
    .eq("client_id", user.id)
    .single()
  if (!sub) return { error: "Abonnement introuvable" }

  const pausedFrom = (formData.get("paused_from") as string)?.trim()
  if (!pausedFrom) return { error: "Indiquez la date à partir de laquelle suspendre le service" }

  const pausedUntilRaw = (formData.get("paused_until") as string)?.trim()
  const pausedUntil = pausedUntilRaw || null
  if (pausedUntil && pausedUntil < pausedFrom)
    return { error: "La date de reprise doit être après la date de suspension" }
  const passesPerMonth = sub.passes_per_month ?? 1
  const nextPickupDate = pausedUntil
    ? getNextPickupDateFrom(new Date(pausedUntil + "T12:00:00"), passesPerMonth)
    : null

  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: "paused",
      paused_from: pausedFrom,
      paused_until: pausedUntil,
      next_pickup_date: nextPickupDate,
    })
    .eq("id", subscriptionId)
    .eq("client_id", user.id)

  if (error) {
    console.error("[suspendRecyclingSubscriptionAction]", error.message)
    return { error: error.message }
  }
  revalidatePath("/app/recycling")
  revalidatePath("/app/recycling/manage")
  revalidatePath("/app")
  return { success: true }
}

export async function cancelRecyclingSuspensionAction(subscriptionId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Non connecté" }

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("id, client_id, passes_per_month")
    .eq("id", subscriptionId)
    .eq("client_id", user.id)
    .single()
  if (!sub) return { error: "Abonnement introuvable" }

  const passesPerMonth = sub.passes_per_month ?? 1
  const nextPickupDate = getNextPickupDateFrom(new Date(), passesPerMonth)

  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: "active",
      paused_from: null,
      paused_until: null,
      next_pickup_date: nextPickupDate,
    })
    .eq("id", subscriptionId)
    .eq("client_id", user.id)

  if (error) {
    console.error("[cancelRecyclingSuspensionAction]", error.message)
    return { error: error.message }
  }
  revalidatePath("/app/recycling")
  revalidatePath("/app/recycling/manage")
  revalidatePath("/app")
  return { success: true }
}
