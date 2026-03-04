import { notFound } from "next/navigation"
import { sendMessageAction } from "../actions"
import { createClient } from "@/lib/supabase/server"
import { respondToQuoteAction } from "../../documents/actions"

type RequestDetailPageProps = {
  params: Promise<{ id: string }>
}

export default async function RequestDetailPage({ params }: RequestDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: request } = await supabase
    .from("requests")
    .select("id, type, status, description, created_at")
    .eq("id", id)
    .maybeSingle()

  if (!request) {
    notFound()
  }

  const [{ data: messages }, { data: attachments }, { data: quotes }] = await Promise.all([
    supabase
      .from("messages")
      .select("id, message, sender_id, created_at")
      .eq("request_id", id)
      .order("created_at", { ascending: true }),
    supabase
      .from("attachments")
      .select("id, file_path, created_at")
      .eq("request_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("quotes")
      .select("id, amount_cents, currency, status, details, created_at")
      .eq("request_id", id)
      .order("created_at", { ascending: false }),
  ])

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

  const timeline = [
    `Demande creee (${new Date(request.created_at).toLocaleString("fr-FR")})`,
    `Statut actuel: ${request.status}`,
    "Prochaines etapes: devis, planification, intervention.",
  ]

  return (
    <main className="grid">
      <section className="card grid">
        <h1>Demande #{request.id.slice(0, 8)}</h1>
        <p>
          <strong>{request.type}</strong> - {request.status}
        </p>
        <p>{request.description ?? "Aucune description."}</p>
      </section>

      <section className="card grid">
        <h2>Timeline</h2>
        <ul className="grid" style={{ margin: 0, paddingLeft: "1rem" }}>
          {timeline.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="card grid">
        <h2>Pieces jointes</h2>
        {signedUrls.length === 0 ? (
          <p>Aucune piece jointe.</p>
        ) : (
          <ul className="grid" style={{ margin: 0, paddingLeft: "1rem" }}>
            {signedUrls.map((file) => (
              <li key={file.id}>
                {file.url ? (
                  <a href={file.url} target="_blank" rel="noreferrer">
                    Voir la piece jointe ({new Date(file.createdAt).toLocaleString("fr-FR")})
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
        <h2>Devis associes</h2>
        {!quotes?.length ? (
          <p>Aucun devis pour cette demande actuellement.</p>
        ) : (
          <div className="grid">
            {quotes.map((quote) => {
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
                  <small>Emis le {new Date(quote.created_at).toLocaleString("fr-FR")}</small>
                  {canRespond ? (
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      <form action={respondToQuoteAction}>
                        <input type="hidden" name="quote_id" value={quote.id} />
                        <input type="hidden" name="request_id" value={id} />
                        <input type="hidden" name="decision" value="accepted" />
                        <button className="btn" type="submit">
                          Accepter
                        </button>
                      </form>
                      <form action={respondToQuoteAction}>
                        <input type="hidden" name="quote_id" value={quote.id} />
                        <input type="hidden" name="request_id" value={id} />
                        <input type="hidden" name="decision" value="refused" />
                        <button className="btn" type="submit">
                          Refuser
                        </button>
                      </form>
                    </div>
                  ) : null}
                </article>
              )
            })}
          </div>
        )}
      </section>

      <section className="card grid">
        <h2>Messages</h2>
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
          <p>Empty state: aucun message sur cette demande.</p>
        )}

        <form className="grid" action={sendMessageAction}>
          <input type="hidden" name="request_id" value={id} />
          <textarea name="message" rows={3} placeholder="Envoyer un message a Dr.Tri..." required />
          <button className="btn" type="submit">
            Envoyer
          </button>
        </form>
      </section>
    </main>
  )
}
