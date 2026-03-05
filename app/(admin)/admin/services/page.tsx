import { getPricingConfig } from "@/lib/pricing"
import { getRecyclingPricingConfig } from "@/lib/recycling"
import { savePricingConfigAction, saveRecyclingPricingAction } from "./actions"

export default async function AdminServicesPage() {
  const [config, recyclingConfig] = await Promise.all([
    getPricingConfig(),
    getRecyclingPricingConfig(),
  ])

  return (
    <>
      <div className="admin-topbar">
        <div>
          <h1 className="admin-page-title">Configuration</h1>
          <p className="mt-0.5 text-sm text-[var(--admin-text-muted)]">
            Tarification et paramètres
          </p>
        </div>
      </div>

      <section className="admin-config-section max-w-2xl">
        <h2 className="admin-config-title">Configuration tarification</h2>
        <form className="grid gap-5" action={savePricingConfigAction}>
          <label className="grid gap-1.5">
            <span className="admin-field-label">Adresse dépôt (départ)</span>
            <span className="admin-field-hint">Point de départ pour le calcul des distances</span>
            <input
              name="depot_address"
              type="text"
              className="admin-input"
              defaultValue={config.depotAddress}
              required
              placeholder="Ex. Lausanne, Suisse"
            />
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="admin-field-label">Tarif employé / heure (CHF)</span>
              <span className="admin-field-hint">Coût horaire par employé</span>
              <input
                name="employee_hourly_rate"
                type="number"
                min="1"
                step="0.01"
                className="admin-input"
                defaultValue={config.employeeHourlyRate}
                required
              />
            </label>
            <label className="grid gap-1.5">
              <span className="admin-field-label">Tarif kilomètre (CHF/km)</span>
              <span className="admin-field-hint">Coût au kilomètre</span>
              <input
                name="kilometer_rate"
                type="number"
                min="0"
                step="0.01"
                className="admin-input"
                defaultValue={config.kilometerRate}
                required
              />
            </label>
          </div>
          <div className="admin-form-actions">
            <button className="btn w-full sm:w-auto sm:min-w-[12rem]" type="submit">
              Enregistrer la configuration
            </button>
          </div>
        </form>
      </section>

      <section className="admin-config-section max-w-2xl mt-8">
        <h2 className="admin-config-title">Tarification recyclage (passages / mois)</h2>
        <form className="grid gap-5" action={saveRecyclingPricingAction}>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="admin-field-label">1 passage / mois (CHF)</span>
              <input
                name="recycling_pass_1"
                type="number"
                min="0"
                step="0.01"
                className="admin-input"
                defaultValue={recyclingConfig.pass1Chf}
              />
            </label>
            <label className="grid gap-1.5">
              <span className="admin-field-label">2 passages / mois (CHF)</span>
              <input
                name="recycling_pass_2"
                type="number"
                min="0"
                step="0.01"
                className="admin-input"
                defaultValue={recyclingConfig.pass2Chf}
              />
            </label>
            <label className="grid gap-1.5">
              <span className="admin-field-label">3 passages / mois (CHF)</span>
              <input
                name="recycling_pass_3"
                type="number"
                min="0"
                step="0.01"
                className="admin-input"
                defaultValue={recyclingConfig.pass3Chf}
              />
            </label>
            <label className="grid gap-1.5">
              <span className="admin-field-label">4 passages / mois (CHF)</span>
              <input
                name="recycling_pass_4"
                type="number"
                min="0"
                step="0.01"
                className="admin-input"
                defaultValue={recyclingConfig.pass4Chf}
              />
            </label>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="admin-field-label">Supplément par 2 bacs au-delà de 6 (CHF)</span>
              <input
                name="recycling_extra_bins_per_2_chf"
                type="number"
                min="0"
                step="0.01"
                className="admin-input"
                defaultValue={recyclingConfig.extraBinsPer2Chf}
              />
            </label>
            <label className="grid gap-1.5">
              <span className="admin-field-label">Supplément grand bac (CHF / bac)</span>
              <input
                name="recycling_large_bin_chf"
                type="number"
                min="0"
                step="0.01"
                className="admin-input"
                defaultValue={recyclingConfig.largeBinChf}
              />
            </label>
          </div>
          <div className="admin-form-actions">
            <button className="btn w-full sm:w-auto sm:min-w-[12rem]" type="submit">
              Enregistrer les tarifs recyclage
            </button>
          </div>
        </form>
      </section>
    </>
  )
}
