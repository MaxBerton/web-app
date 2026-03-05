"use server"

import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/auth"
import { getFormString } from "@/lib/form-data"
import { createClient } from "@/lib/supabase/server"

export async function savePricingConfigAction(formData: FormData) {
  await requireAdmin()
  const depotAddress = getFormString(formData, "depot_address")
  const depotLat = getFormString(formData, "depot_lat")
  const depotLng = getFormString(formData, "depot_lng")
  const employeeRate = getFormString(formData, "employee_hourly_rate")
  const kilometerRate = getFormString(formData, "kilometer_rate")
  const supabase = await createClient()

  const entries = [
    { key: "depot_address", value: depotAddress || "Lausanne, Suisse" },
    { key: "employee_hourly_rate", value: employeeRate || "60" },
    { key: "kilometer_rate", value: kilometerRate || "2.2" },
  ]
  if (depotLat?.trim()) entries.push({ key: "depot_lat", value: depotLat.trim() })
  if (depotLng?.trim()) entries.push({ key: "depot_lng", value: depotLng.trim() })

  const { error } = await supabase.from("app_settings").upsert(entries, { onConflict: "key" })
  if (error) {
    console.error("[services.savePricingConfigAction]", error.message)
  }

  revalidatePath("/admin/services")
}

export async function saveRecyclingPricingAction(formData: FormData) {
  await requireAdmin()
  const supabase = await createClient()
  const entries = [
    { key: "recycling_pass_1", value: getFormString(formData, "recycling_pass_1") || "20" },
    { key: "recycling_pass_2", value: getFormString(formData, "recycling_pass_2") || "35" },
    { key: "recycling_pass_3", value: getFormString(formData, "recycling_pass_3") || "48" },
    { key: "recycling_pass_4", value: getFormString(formData, "recycling_pass_4") || "60" },
    { key: "recycling_extra_bins_per_2_chf", value: getFormString(formData, "recycling_extra_bins_per_2_chf") || "3" },
    { key: "recycling_large_bin_chf", value: getFormString(formData, "recycling_large_bin_chf") || "2" },
  ]
  const { error } = await supabase.from("app_settings").upsert(entries, { onConflict: "key" })
  if (error) console.error("[services.saveRecyclingPricingAction]", error.message)
  revalidatePath("/admin/services")
  revalidatePath("/app/recycling")
  revalidatePath("/app/recycling/manage")
}
