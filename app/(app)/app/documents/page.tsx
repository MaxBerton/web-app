import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { respondToQuoteAction } from "./actions"

type QuoteRow = {
  id: string
  request_id: string
  amount_cents: number
  currency: string
  status: string
  details: string | null
  created_at: string
}

type RequestRow = {
  id: string
  type: string
  status: string
}

export default async function DocumentsPage() {
  const supabase = await createClient()
  const { data: quotesData } = await supabase
    .from("quotes")
    .select("id, request_id, amount_cents, currency, status, details, created_at")
    .order("created_at", { ascending: false })

  const quotes = (quotesData ?? []) as QuoteRow[]
  const requestIds = [...new Set(quotes.map((quote) => quote.request_id))]

  const { data: requestsData } =
    requestIds.length > 0
      ? await supabase.from("requests").select("id, type, status").in("id", requestIds)
      : { data: [] as RequestRow[] }

  const requestById = new Map((requestsData ?? []).map((request) => [request.id, request]))

  return (
    <main className="card grid">
      <h1>Documents - Devis</h1>
      {quotes.length === 0 ? (
        <p>Empty state: aucun devis disponible pour le moment.</p>
      ) : (
        <div className="grid">
          {quotes.map((quote) => {
            const request = requestById.get(quote.request_id)
            const canRespond = quote.status === "sent"
            return (
              <article key={quote.id} className="card grid">
                <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem" }}>
                  <strong>
                    {(quote.amount_cents / 100).toFixed(2)} {quote.currency.toUpperCase()}
                  </strong>
                  <span>Statut devis: {quote.status}</span>
                </div>

                <p style={{ margin: 0 }}>{quote.details ?? "Sans details."}</p>
                <small>
                  Demande: {request?.type ?? "inconnue"} - statut: {request?.status ?? "inconnu"}
                </small>
                <small>Emis le {new Date(quote.created_at).toLocaleString("fr-FR")}</small>

                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <Link className="btn" href={`/app/demandes/${quote.request_id}`}>
                    Ouvrir la demande
                  </Link>
                  <a className="btn" href={`/api/quotes/${quote.id}/pdf`} target="_blank" rel="noreferrer">
                    Telecharger PDF
                  </a>
                  {canRespond ? (
                    <>
                      <form action={respondToQuoteAction}>
                        <input type="hidden" name="quote_id" value={quote.id} />
                        <input type="hidden" name="request_id" value={quote.request_id} />
                        <input type="hidden" name="decision" value="accepted" />
                        <button className="btn" type="submit">
                          Accepter
                        </button>
                      </form>
                      <form action={respondToQuoteAction}>
                        <input type="hidden" name="quote_id" value={quote.id} />
                        <input type="hidden" name="request_id" value={quote.request_id} />
                        <input type="hidden" name="decision" value="refused" />
                        <button className="btn" type="submit">
                          Refuser
                        </button>
                      </form>
                    </>
                  ) : null}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </main>
  )
}
