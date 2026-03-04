import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { computeDrivingDistanceKm, estimateQuoteAmountCents, getPricingConfig } from "@/lib/pricing"
import { getRequestStatusLabel } from "@/lib/dashboard"
import { REQUEST_STATUSES } from "@/lib/types"
import { updateRequestStatusAction } from "../actions"
import { createInvoiceAction, createQuoteAction, sendAdminMessageAction } from "./actions"

type AdminRequestDetailPageProps = {
  params: Promise<{ id: string }>
}

export default async function AdminRequestDetailPage({ params }: AdminRequestDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const pricingConfig = await getPricingConfig()

  const { data: request } = await supabase
    .from("requests")
    .select("id, client_id, type, status, description, payload, created_at")
    .eq("id", id)
    .maybeSingle()

  if (!request) {
    notFound()
  }

  const [{ data: attachments }, { data: messages }, { data: quotes }, { data: invoices }] = await Promise.all([
    supabase
      .from("attachments")
      .select("id, file_path, created_at")
      .eq("request_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("messages")
      .select("id, sender_id, message, created_at")
      .eq("request_id", id)
      .order("created_at", { ascending: true }),
    supabase
      .from("quotes")
      .select("id, amount_cents, currency, status, details, created_at")
      .eq("request_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("invoices")
      .select("id, amount_cents, currency, status, created_at")
      .eq("request_id", id)
      .order("created_at", { ascending: false }),
  ])

  const requestPayload = (request.payload ?? {}) as Record<string, string>
  const interventionAddress = requestPayload.intervention_address ?? ""
  const defaultEmployees = 2
  const defaultHours = 4
  const distanceKm =
    interventionAddress && pricingConfig.depotAddress
      ? await computeDrivingDistanceKm(pricingConfig.depotAddress, interventionAddress)
      : null
  const safeDistance = distanceKm ?? 0
  const suggestedAmountCents = estimateQuoteAmountCents({
    employees: defaultEmployees,
    hours: defaultHours,
    employeeHourlyRate: pricingConfig.employeeHourlyRate,
    distanceKm: safeDistance,
    kilometerRate: pricingConfig.kilometerRate,
  })
  const suggestedAmountChf = (suggestedAmountCents / 100).toFixed(2)
  const latestQuoteAmountCents = quotes?.[0]?.amount_cents ?? suggestedAmountCents
  const suggestedInvoiceAmountChf = (latestQuoteAmountCents / 100).toFixed(2)

  const signedUrls = await Promise.all(
    (attachments ?? []).map(async (file) => {
      const signed = await supabase.storage.from("request-attachments").createSignedUrl(file.file_path, 60 * 10)

      return {
        id: file.id,
        createdAt: file.created_at,
        url: signed.data?.signedUrl ?? null,
      }
    }),
  )

  return (
    <main className="grid">
      <section className="card grid">
        <h1>Demande admin #{request.id.slice(0, 8)}</h1>
        <p>
          Client: <code>{request.client_id}</code>
        </p>
        <p>{request.description ?? "Sans description."}</p>
        <p>
          Adresse intervention: <strong>{interventionAddress || "Non renseignee"}</strong>
        </p>
        <small>Depart: {requestPayload.departure_address ?? "Non renseigne"}</small>
        <small>Arrivee: {requestPayload.destination_address ?? "Non renseignee"}</small>
        <small>Logement: {requestPayload.housing_type ?? "Non renseigne"}</small>
        <small>Inventaire: {requestPayload.inventory_summary ?? "Non renseigne"}</small>
        <small>Volume (m3): {requestPayload.estimated_volume_m3 ?? "Non renseigne"}</small>
        <small>Employes souhaites: {requestPayload.requested_workers ?? "Non renseigne"}</small>
        <small>Creneau: {requestPayload.time_window ?? "Non renseigne"}</small>
        <small>Urgence: {requestPayload.urgency_level ?? "Non renseignee"}</small>
        <small>Contraintes acces: {requestPayload.access_constraints ?? "Non renseignees"}</small>
        <form action={updateRequestStatusAction} style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <input type="hidden" name="request_id" value={request.id} />
          <select name="status" defaultValue={request.status}>
            {REQUEST_STATUSES.map((value) => (
              <option key={value} value={value}>
                {getRequestStatusLabel(value)}
              </option>
            ))}
          </select>
          <button className="btn" type="submit">
            Mettre a jour le statut
          </button>
        </form>
      </section>

      <section className="card grid">
        <h2>Photos et pieces jointes</h2>
        {signedUrls.length === 0 ? (
          <p>Aucune piece jointe.</p>
        ) : (
          <ul className="grid" style={{ margin: 0, paddingLeft: "1rem" }}>
            {signedUrls.map((file) => (
              <li key={file.id}>
                {file.url ? (
                  <a href={file.url} target="_blank" rel="noreferrer">
                    Ouvrir ({new Date(file.createdAt).toLocaleString("fr-FR")})
                  </a>
                ) : (
                  "Lien indisponible"
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card grid">
        <h2>Devis</h2>
        {quotes?.length ? (
          <ul className="grid" style={{ margin: 0, paddingLeft: "1rem" }}>
            {quotes.map((quote) => (
              <li key={quote.id}>
                <p style={{ margin: 0 }}>
                  {(quote.amount_cents / 100).toFixed(2)} {quote.currency.toUpperCase()} - {quote.status}
                </p>
                <small>{quote.details ?? "Sans details"} </small>
                <a className="btn" href={`/api/quotes/${quote.id}/pdf`} target="_blank" rel="noreferrer">
                  Telecharger PDF
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun devis cree pour cette demande.</p>
        )}

        <form className="grid" action={createQuoteAction}>
          <input type="hidden" name="request_id" value={request.id} />
          <input type="hidden" name="depot_address" value={pricingConfig.depotAddress} />
          <input type="hidden" name="intervention_address" value={interventionAddress} />
          <input type="hidden" name="distance_km" value={safeDistance} />
          <input type="hidden" name="employee_hourly_rate" value={pricingConfig.employeeHourlyRate} />
          <input type="hidden" name="kilometer_rate" value={pricingConfig.kilometerRate} />
          <label className="grid" style={{ gap: "0.35rem" }}>
            Nombre d'employes
            <input name="employees_count" type="number" min="1" step="1" defaultValue={defaultEmployees} required />
          </label>
          <label className="grid" style={{ gap: "0.35rem" }}>
            Heures estimees
            <input name="estimated_hours" type="number" min="0.5" step="0.5" defaultValue={defaultHours} required />
          </label>
          <div className="card grid" style={{ gap: "0.35rem" }}>
            <small>Depot: {pricingConfig.depotAddress}</small>
            <small>Adresse intervention: {interventionAddress || "Non renseignee"}</small>
            <small>
              Distance calculee automatiquement:{" "}
              {distanceKm === null ? "indisponible (adresse a verifier)" : `${distanceKm} km`}
            </small>
            <small>
              Taux configures: {pricingConfig.employeeHourlyRate} CHF/h/employe et {pricingConfig.kilometerRate} CHF/km
            </small>
          </div>
          <label className="grid" style={{ gap: "0.35rem" }}>
            Montant (CHF)
            <input name="amount_chf" type="number" min="1" step="0.01" defaultValue={suggestedAmountChf} required />
          </label>
          <label className="grid" style={{ gap: "0.35rem" }}>
            Details
            <textarea name="details" rows={3} placeholder="Detail de la prestation, delai, inclusions..." />
          </label>
          <button className="btn" type="submit">
            Creer et envoyer le devis
          </button>
        </form>
      </section>

      <section className="card grid">
        <h2>Factures</h2>
        {invoices?.length ? (
          <ul className="grid" style={{ margin: 0, paddingLeft: "1rem" }}>
            {invoices.map((invoice) => (
              <li key={invoice.id}>
                <p style={{ margin: 0 }}>
                  {(invoice.amount_cents / 100).toFixed(2)} {invoice.currency.toUpperCase()} - {invoice.status}
                </p>
                <small>Emise le {new Date(invoice.created_at).toLocaleString("fr-FR")}</small>
                <a className="btn" href={`/api/invoices/${invoice.id}/pdf`} target="_blank" rel="noreferrer">
                  Telecharger PDF
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucune facture creee pour cette demande.</p>
        )}

        <form className="grid" action={createInvoiceAction}>
          <input type="hidden" name="request_id" value={request.id} />
          <label className="grid" style={{ gap: "0.35rem" }}>
            Montant facture (CHF)
            <input
              name="amount_chf"
              type="number"
              min="1"
              step="0.01"
              defaultValue={suggestedInvoiceAmountChf}
              required
            />
          </label>
          <label className="grid" style={{ gap: "0.35rem" }}>
            Statut facture
            <select name="invoice_status" defaultValue="pending">
              <option value="pending">pending</option>
              <option value="paid">paid</option>
              <option value="canceled">canceled</option>
            </select>
          </label>
          <button className="btn" type="submit">
            Creer la facture
          </button>
        </form>
      </section>

      <section className="card grid">
        <h2>Chat</h2>
        {messages?.length ? (
          <ul className="grid" style={{ margin: 0, paddingLeft: "1rem" }}>
            {messages.map((message) => (
              <li key={message.id}>
                <p style={{ margin: 0 }}>{message.message}</p>
                <small>
                  {message.sender_id} - {new Date(message.created_at).toLocaleString("fr-FR")}
                </small>
              </li>
            ))}
          </ul>
        ) : (
          <p>Empty state: conversation vide.</p>
        )}

        <form className="grid" action={sendAdminMessageAction}>
          <input type="hidden" name="request_id" value={request.id} />
          <textarea name="message" rows={3} required placeholder="Reponse admin..." />
          <button className="btn" type="submit">
            Envoyer
          </button>
        </form>
      </section>
    </main>
  )
}
