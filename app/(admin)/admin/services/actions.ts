"use server"

import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/auth"
import { getFormString } from "@/lib/form-data"
import { createClient } from "@/lib/supabase/server"

export async function savePricingConfigAction(formData: FormData) {
  await requireAdmin()
  const depotAddress = getFormString(formData, "depot_address")
  const employeeRate = getFormString(formData, "employee_hourly_rate")
  const kilometerRate = getFormString(formData, "kilometer_rate")
  const supabase = await createClient()

  const entries = [
    { key: "depot_address", value: depotAddress || "Lausanne, Suisse" },
    { key: "employee_hourly_rate", value: employeeRate || "60" },
    { key: "kilometer_rate", value: kilometerRate || "2.2" },
  ]

  const { error } = await supabase.from("app_settings").upsert(entries, { onConflict: "key" })
  if (error) {
    console.error("[services.savePricingConfigAction]", error.message)
  }

  revalidatePath("/admin/services")
}
