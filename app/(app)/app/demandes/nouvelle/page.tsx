import { createRequestAction } from "../actions"

const wizardSteps = [
  "1. Choix du service",
  "2. Adresse",
  "3. Informations et inventaire",
  "4. Upload photos",
  "5. Date souhaitee",
  "6. Confirmation",
]

type NewRequestPageProps = {
  searchParams: Promise<{ error?: string }>
}

export default async function NewRequestPage({ searchParams }: NewRequestPageProps) {
  const params = await searchParams
  const errorMessage =
    params.error === "missing_required"
      ? "Merci de remplir les champs obligatoires: type, adresse, inventaire et date."
      : params.error
        ? "Erreur: la demande n'a pas pu etre creee."
        : null

  return (
    <main className="grid">
      <section className="card grid">
        <h1>Nouvelle demande (wizard V1)</h1>
        <ol className="grid" style={{ margin: 0, paddingLeft: "1.2rem" }}>
          {wizardSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="card grid">
        <h2>Creer une demande</h2>
        {errorMessage ? <p>{errorMessage}</p> : null}
        <form className="grid" action={createRequestAction}>
          <h3>1) Service</h3>
          <label className="grid" style={{ gap: "0.35rem" }}>
            Type de service *
            <select name="service_type" defaultValue="moving" required>
              <option value="moving">Demenagement</option>
              <option value="installation">Installation</option>
              <option value="clearance">Debarras</option>
              <option value="demolition">Demolition</option>
            </select>
          </label>

          <h3>2) Adresses et acces</h3>
          <label className="grid" style={{ gap: "0.35rem" }}>
            Adresse intervention *
            <input
              name="intervention_address"
              type="text"
              required
              placeholder="Ex: Avenue de la Gare 10, 1003 Lausanne"
            />
          </label>
          <label className="grid" style={{ gap: "0.35rem" }}>
            Adresse de depart (si differente)
            <input name="departure_address" type="text" placeholder="Ex: Rue du Lac 8, 1020 Renens" />
          </label>
          <label className="grid" style={{ gap: "0.35rem" }}>
            Adresse d'arrivee (si demenagement)
            <input name="destination_address" type="text" placeholder="Ex: Chemin des Fleurs 15, 1006 Lausanne" />
          </label>
          <label className="grid" style={{ gap: "0.35rem" }}>
            Type de logement
            <select name="housing_type" defaultValue="apartment">
              <option value="apartment">Appartement</option>
              <option value="house">Maison</option>
              <option value="office">Local professionnel</option>
              <option value="other">Autre</option>
            </select>
          </label>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
            <label className="grid" style={{ gap: "0.35rem" }}>
              Etage depart
              <input name="floor_from" type="number" step="1" />
            </label>
            <label className="grid" style={{ gap: "0.35rem" }}>
              Etage arrivee
              <input name="floor_to" type="number" step="1" />
            </label>
          </div>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
            <label className="grid" style={{ gap: "0.35rem" }}>
              Ascenseur au depart
              <select name="elevator_from" defaultValue="unknown">
                <option value="yes">Oui</option>
                <option value="no">Non</option>
                <option value="unknown">Je ne sais pas</option>
              </select>
            </label>
            <label className="grid" style={{ gap: "0.35rem" }}>
              Ascenseur a l'arrivee
              <select name="elevator_to" defaultValue="unknown">
                <option value="yes">Oui</option>
                <option value="no">Non</option>
                <option value="unknown">Je ne sais pas</option>
              </select>
            </label>
          </div>

          <h3>3) Besoin et estimation</h3>
          <label className="grid" style={{ gap: "0.35rem" }}>
            Inventaire / objets a transporter *
            <textarea
              name="inventory_summary"
              rows={4}
              required
              placeholder="Ex: 1 lit, 1 canape, 15 cartons, 1 machine a laver..."
            />
          </label>
          <label className="grid" style={{ gap: "0.35rem" }}>
            Description complementaire
            <textarea name="description" rows={3} placeholder="Contraintes, montage/demontage, fragile, etc." />
          </label>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
            <label className="grid" style={{ gap: "0.35rem" }}>
              Volume estime (m3)
              <input name="estimated_volume_m3" type="number" min="0" step="0.5" />
            </label>
            <label className="grid" style={{ gap: "0.35rem" }}>
              Employes souhaites
              <input name="requested_workers" type="number" min="1" step="1" />
            </label>
          </div>
          <label className="grid" style={{ gap: "0.35rem" }}>
            Contraintes d'acces
            <textarea name="access_constraints" rows={2} placeholder="Rue etroite, stationnement difficile, etc." />
          </label>

          <h3>4) Planification</h3>
          <label className="grid" style={{ gap: "0.35rem" }}>
            Date souhaitee *
            <input name="requested_date" type="date" required />
          </label>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            <label className="grid" style={{ gap: "0.35rem" }}>
              Creneau prefere
              <select name="time_window" defaultValue="morning">
                <option value="morning">Matin</option>
                <option value="afternoon">Apres-midi</option>
                <option value="full_day">Journee complete</option>
              </select>
            </label>
            <label className="grid" style={{ gap: "0.35rem" }}>
              Urgence
              <select name="urgency_level" defaultValue="normal">
                <option value="flexible">Flexible</option>
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
              </select>
            </label>
          </div>

          <h3>5) Pieces jointes et notes</h3>
          <label className="grid" style={{ gap: "0.35rem" }}>
            Photos / documents (plusieurs)
            <input name="attachments" type="file" accept="image/*,.pdf" multiple />
          </label>
          <label className="grid" style={{ gap: "0.35rem" }}>
            Notes complementaires
            <textarea name="notes" rows={3} />
          </label>

          <button className="btn" type="submit">
            Envoyer la demande
          </button>
        </form>
      </section>
    </main>
  )
}
