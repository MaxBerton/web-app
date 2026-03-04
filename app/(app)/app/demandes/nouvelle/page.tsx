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
        {params.error ? <p>Erreur: la demande n'a pas pu etre creee.</p> : null}
        <form className="grid" action={createRequestAction}>
          <label className="grid" style={{ gap: "0.35rem" }}>
            Type de service
            <select name="service_type" defaultValue="moving">
              <option value="moving">Demenagement</option>
              <option value="installation">Installation</option>
              <option value="clearance">Debarras</option>
              <option value="demolition">Demolition</option>
            </select>
          </label>

          <label className="grid" style={{ gap: "0.35rem" }}>
            Description
            <textarea name="description" rows={4} placeholder="Inventaire, volume estime, contraintes..." />
          </label>

          <label className="grid" style={{ gap: "0.35rem" }}>
            Date souhaitee
            <input name="requested_date" type="date" />
          </label>

          <label className="grid" style={{ gap: "0.35rem" }}>
            Notes complementaires
            <textarea name="notes" rows={3} />
          </label>

          <label className="grid" style={{ gap: "0.35rem" }}>
            Piece jointe (photo)
            <input name="attachment" type="file" accept="image/*" />
          </label>

          <button className="btn" type="submit">
            Envoyer la demande
          </button>
        </form>
      </section>
    </main>
  )
}
