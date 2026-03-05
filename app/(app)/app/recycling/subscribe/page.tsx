import { redirect } from "next/navigation"
import { requireUser } from "@/lib/auth"
import { getRecyclingSubscription } from "@/lib/recycling"

export default async function RecyclingSubscribePage() {
  await requireUser()
  redirect("/app/recycling")
}
