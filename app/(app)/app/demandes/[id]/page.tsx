import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getPayloadDetailEntries } from "@/lib/request-details-labels"
import { respondToQuoteAction } from "../../documents/actions"
import { RequestHeader } from "@/components/request-detail/RequestHeader"
import { RequestDetailsCard } from "@/components/request-detail/RequestDetailsCard"
import { AttachmentsGallery } from "@/components/request-detail/AttachmentsGallery"
import { MessagesThread } from "@/components/request-detail/MessagesThread"
import { AppointmentCard } from "@/components/request-detail/AppointmentCard"

type RequestDetailPageProps = {
  params: Promise<{ id: string }>
}

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif)$/i

export default async function RequestDetailPage({ params }: RequestDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    notFound()
  }

  const { data: request } = await supabase
    .from("requests")
    .select("id, type, status, description, payload, created_at, address_id, addresses(street, postal_code, city)")
    .eq("id", id)
    .maybeSingle()

  if (!request) {
    notFound()
  }

  const [
    { data: messages },
    { data: attachments },
    { data: appointments },
    { data: quotes },
    { data: invoices },
  ] = await Promise.all([
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
      .from("appointments")
      .select("id, scheduled_at, status, notes")
      .eq("request_id", id)
      .gte("scheduled_at", new Date().toISOString())
      .in("status", ["scheduled", "in_progress"])
      .order("scheduled_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
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

  const signedUrls = await Promise.all(
    (attachments ?? []).map(async (file) => {
      const signed = await supabase.storage
        .from("request-attachments")
        .createSignedUrl(file.file_path, 60 * 10)
      const isImage = IMAGE_EXT.test(file.file_path)
      return {
        id: file.id,
        createdAt: file.created_at,
        url: signed.data?.signedUrl ?? null,
        isImage,
      }
    }),
  )

  const payload = (request.payload ?? {}) as Record<string, unknown>
  const detailEntries = getPayloadDetailEntries(payload)
  const requestedDatesRaw = payload.requested_dates ?? payload.requested_date
  const requestedDates: string[] | null = Array.isArray(requestedDatesRaw)
    ? requestedDatesRaw.filter((d): d is string => typeof d === "string")
    : typeof requestedDatesRaw === "string" && requestedDatesRaw.trim()
      ? [requestedDatesRaw]
      : null
  const addrRow = Array.isArray(request.addresses)
    ? request.addresses[0]
    : request.addresses
  const address = addrRow
    ? {
        street: (addrRow as { street: string | null }).street ?? null,
        postal_code: (addrRow as { postal_code: string | null }).postal_code ?? null,
        city: (addrRow as { city: string | null }).city ?? null,
      }
    : null
  const nextAppointment = appointments
    ? {
        id: (appointments as { id: string }).id,
        scheduled_at: (appointments as { scheduled_at: string }).scheduled_at,
        status: (appointments as { status: string }).status,
        notes: (appointments as { notes: string | null }).notes ?? null,
      }
    : null

  return (
    <main className="grid gap-4">
      <RequestHeader
        id={request.id}
        type={request.type}
        status={request.status}
        createdAt={request.created_at}
      />

      <RequestDetailsCard
        description={request.description}
        address={address}
        requestedDates={requestedDates}
        accessConstraints={(payload.access_constraints as string) ?? null}
        detailEntries={detailEntries}
      />

      <AttachmentsGallery items={signedUrls} />

      <MessagesThread
        requestId={id}
        messages={messages ?? []}
        currentUserId={user.id}
      />

      <AppointmentCard appointment={nextAppointment} />

      {(quotes?.length ?? 0) > 0 && (
        <section className="card" aria-labelledby="quotes-heading">
          <h2 id="quotes-heading" className="mb-3 text-lg font-semibold text-dr-tri-dark">
            Devis
          </h2>
          <div className="grid gap-3">
            {quotes!.map((quote) => {
              const canRespond = quote.status === "sent"
              return (
                <article
                  key={quote.id}
                  className="rounded-lg border border-dr-tri-border bg-white p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <strong className="text-dr-tri-dark">
                      {(quote.amount_cents / 100).toFixed(2)} {quote.currency.toUpperCase()}
                    </strong>
                    <span className="text-sm text-dr-tri-muted">{quote.status}</span>
                  </div>
                  {quote.details && (
                    <p className="mt-2 text-sm text-dr-tri-muted">{quote.details}</p>
                  )}
                  <p className="mt-1 text-xs text-[#64748b]">
                    {new Date(quote.created_at).toLocaleString("fr-FR")}
                  </p>
                  <a
                    className="btn mt-2 inline-block text-sm"
                    href={`/api/quotes/${quote.id}/pdf`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Télécharger le devis PDF
                  </a>
                  {canRespond && (
                    <div className="mt-2 flex gap-2">
                      <form action={respondToQuoteAction}>
                        <input type="hidden" name="quote_id" value={quote.id} />
                        <input type="hidden" name="request_id" value={id} />
                        <input type="hidden" name="decision" value="accepted" />
                        <button className="btn text-sm" type="submit">
                          Accepter
                        </button>
                      </form>
                      <form action={respondToQuoteAction}>
                        <input type="hidden" name="quote_id" value={quote.id} />
                        <input type="hidden" name="request_id" value={id} />
                        <input type="hidden" name="decision" value="refused" />
                        <button className="btn text-sm" type="submit">
                          Refuser
                        </button>
                      </form>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        </section>
      )}

      {(invoices?.length ?? 0) > 0 && (
        <section className="card" aria-labelledby="invoices-heading">
          <h2 id="invoices-heading" className="mb-3 text-lg font-semibold text-dr-tri-dark">
            Factures
          </h2>
          <ul className="grid gap-2" style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {invoices!.map((inv) => (
              <li
                key={inv.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-dr-tri-border p-3"
              >
                <span className="text-dr-tri-dark">
                  {(inv.amount_cents / 100).toFixed(2)} {inv.currency.toUpperCase()} · {inv.status}
                </span>
                <a
                  href={`/api/invoices/${inv.id}/pdf`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn text-sm"
                >
                  Télécharger PDF
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="text-sm text-dr-tri-muted">
        <Link href="/app/demandes" className="hover:text-dr-tri-primary">
          ← Retour à mes demandes
        </Link>
      </p>
    </main>
  )
}
