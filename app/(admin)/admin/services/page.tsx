import { getPricingConfig } from "@/lib/pricing"
import { savePricingConfigAction } from "./actions"

export default async function AdminServicesPage() {
  const config = await getPricingConfig()

  return (
    <main className="grid">
      <section className="card grid">
        <h1>Configuration tarification</h1>
        <form className="grid" action={savePricingConfigAction}>
          <label className="grid" style={{ gap: "0.35rem" }}>
            Adresse depot (depart)
            <input name="depot_address" type="text" defaultValue={config.depotAddress} required />
          </label>
          <label className="grid" style={{ gap: "0.35rem" }}>
            Tarif employe / heure (CHF)
            <input
              name="employee_hourly_rate"
              type="number"
              min="1"
              step="0.01"
              defaultValue={config.employeeHourlyRate}
              required
            />
          </label>
          <label className="grid" style={{ gap: "0.35rem" }}>
            Tarif kilometre (CHF/km)
            <input
              name="kilometer_rate"
              type="number"
              min="0"
              step="0.01"
              defaultValue={config.kilometerRate}
              required
            />
          </label>
          <button className="btn" type="submit">
            Enregistrer la configuration
          </button>
        </form>
      </section>
    </main>
  )
}
