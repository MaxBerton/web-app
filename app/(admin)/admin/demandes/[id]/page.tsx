import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { REQUEST_STATUSES } from "@/lib/types"
import { updateRequestStatusAction } from "../actions"
import { sendAdminMessageAction } from "./actions"

type AdminRequestDetailPageProps = {
  params: Promise<{ id: string }>
}

export default async function AdminRequestDetailPage({ params }: AdminRequestDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: request } = await supabase
    .from("requests")
    .select("id, client_id, type, status, description, created_at")
    .eq("id", id)
    .maybeSingle()

  if (!request) {
    notFound()
  }

  const [{ data: attachments }, { data: messages }] = await Promise.all([
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

  return (
    <main className="grid">
      <section className="card grid">
        <h1>Demande admin #{request.id.slice(0, 8)}</h1>
        <p>
          Client: <code>{request.client_id}</code>
        </p>
        <p>{request.description ?? "Sans description."}</p>
        <form action={updateRequestStatusAction} style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <input type="hidden" name="request_id" value={request.id} />
          <select name="status" defaultValue={request.status}>
            {REQUEST_STATUSES.map((value) => (
              <option key={value} value={value}>
                {value}
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
