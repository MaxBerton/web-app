import { sendMessageAction } from "@/app/(app)/app/demandes/actions"

type Message = {
  id: string
  message: string
  sender_id: string
  created_at: string
}

type MessagesThreadProps = {
  requestId: string
  messages: Message[]
  currentUserId: string
}

export function MessagesThread({ requestId, messages, currentUserId }: MessagesThreadProps) {
  return (
    <section className="card grid gap-4" aria-labelledby="messages-heading">
      <h2 id="messages-heading" className="text-lg font-semibold text-dr-tri-dark">
        Messages (support)
      </h2>

      {messages.length === 0 ? (
        <p className="text-sm text-dr-tri-muted">Aucun message. Envoyez un message pour échanger avec l&apos;équipe.</p>
      ) : (
        <ul
          className="grid gap-3 border-b border-dr-tri-border pb-4"
          style={{ listStyle: "none", margin: 0, padding: 0 }}
        >
          {messages.map((msg) => {
            const isOwn = msg.sender_id === currentUserId
            return (
              <li
                key={msg.id}
                className={`rounded-lg px-3 py-2 ${
                  isOwn ? "ml-4 bg-dr-tri-light-green" : "mr-4 bg-dr-tri-primary/10"
                }`}
              >
                <p className="text-xs text-dr-tri-muted">
                  {isOwn ? "Vous" : "Dr.Tri"} ·{" "}
                  {new Date(msg.created_at).toLocaleString("fr-FR")}
                </p>
                <p className="mt-1 whitespace-pre-wrap text-dr-tri-dark">{msg.message}</p>
              </li>
            )
          })}
        </ul>
      )}

      <form action={sendMessageAction} className="grid gap-2">
        <input type="hidden" name="request_id" value={requestId} />
        <textarea
          name="message"
          rows={3}
          placeholder="Écrivez votre message…"
          required
          className="w-full rounded border border-dr-tri-border bg-white px-3 py-2 text-dr-tri-dark placeholder-dr-tri-muted focus:border-dr-tri-primary focus:outline-none"
        />
        <button type="submit" className="btn w-fit">
          Envoyer
        </button>
      </form>
    </section>
  )
}
