import { requireUser } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { ProfileForm } from "@/components/profile/ProfileForm"
import { AddressForm } from "@/components/profile/AddressForm"
import { SecurityCard } from "@/components/profile/SecurityCard"
import { SessionCard } from "@/components/profile/SessionCard"

export default async function ProfilePage() {
  const user = await requireUser()
  const supabase = await createClient()

  const [
    { data: profile },
    { data: address },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("first_name, last_name, email, phone")
      .eq("id", user.id)
      .single(),
    supabase
      .from("addresses")
      .select("street, postal_code, city")
      .eq("profile_id", user.id)
      .limit(1)
      .maybeSingle(),
  ])

  const profileData = {
    first_name: profile?.first_name ?? null,
    last_name: profile?.last_name ?? null,
    email: profile?.email ?? user.email ?? null,
    phone: profile?.phone ?? null,
  }

  const addressData = address
    ? {
        street: (address as { street: string | null }).street ?? null,
        postal_code: (address as { postal_code: string | null }).postal_code ?? null,
        city: (address as { city: string | null }).city ?? null,
      }
    : null

  return (
    <main className="grid gap-8">
      <header>
        <h1 className="text-2xl font-semibold text-dr-tri-dark tracking-tight">Mon profil</h1>
        <p className="mt-1 text-sm text-dr-tri-muted">
          Informations personnelles et adresse.
        </p>
      </header>

      <div className="grid gap-6">
        <ProfileForm initial={profileData} />
        <AddressForm initial={addressData} />
        <SecurityCard />
        <SessionCard />
      </div>
    </main>
  )
}
