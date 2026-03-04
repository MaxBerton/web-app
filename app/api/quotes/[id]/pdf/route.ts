import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

type RouteContext = {
  params: Promise<{ id: string }>
}

function formatMoney(amountCents: number, currency: string) {
  return `${(amountCents / 100).toFixed(2)} ${currency.toUpperCase()}`
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: quote, error } = await supabase
    .from("quotes")
    .select("id, request_id, amount_cents, currency, status, details, created_at")
    .eq("id", id)
    .maybeSingle()

  if (error || !quote) {
    return NextResponse.json({ error: "Quote not found" }, { status: 404 })
  }

  const [{ data: requestData }, { data: profile }] = await Promise.all([
    supabase
      .from("requests")
      .select("id, client_id, type, description, created_at")
      .eq("id", quote.request_id)
      .maybeSingle(),
    supabase.from("profiles").select("role").eq("id", user.id).maybeSingle(),
  ])

  if (!requestData) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 })
  }

  const isAdmin = profile?.role === "admin"
  if (!isAdmin && requestData.client_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const pdf = await PDFDocument.create()
  const page = pdf.addPage([595.28, 841.89]) // A4

  const fontRegular = await pdf.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const { height } = page.getSize()

  let y = height - 60
  const left = 52

  page.drawText("DR.TRI", {
    x: left,
    y,
    size: 24,
    font: fontBold,
    color: rgb(0.07, 0.2, 0.45),
  })
  y -= 22
  page.drawText("Devis professionnel", {
    x: left,
    y,
    size: 14,
    font: fontRegular,
    color: rgb(0.2, 0.2, 0.2),
  })

  page.drawLine({
    start: { x: left, y: y - 18 },
    end: { x: 545, y: y - 18 },
    thickness: 1,
    color: rgb(0.85, 0.85, 0.85),
  })

  y -= 58
  page.drawText(`Devis #${quote.id.slice(0, 8)}`, { x: left, y, size: 12, font: fontBold })
  y -= 18
  page.drawText(`Date: ${new Date(quote.created_at).toLocaleDateString("fr-FR")}`, {
    x: left,
    y,
    size: 11,
    font: fontRegular,
  })
  y -= 16
  page.drawText(`Demande: ${requestData.type} (#${requestData.id.slice(0, 8)})`, {
    x: left,
    y,
    size: 11,
    font: fontRegular,
  })
  y -= 16
  page.drawText(`Statut devis: ${quote.status}`, { x: left, y, size: 11, font: fontRegular })

  y -= 38
  page.drawText("Detail de la prestation", {
    x: left,
    y,
    size: 12,
    font: fontBold,
    color: rgb(0.07, 0.2, 0.45),
  })
  y -= 18

  const details = quote.details ?? requestData.description ?? "Prestations selon visite technique et validation."
  const detailLines = details.match(/.{1,90}/g) ?? [details]
  for (const line of detailLines.slice(0, 8)) {
    page.drawText(line, { x: left, y, size: 10.5, font: fontRegular })
    y -= 14
  }

  y -= 22
  page.drawLine({
    start: { x: left, y },
    end: { x: 545, y },
    thickness: 1,
    color: rgb(0.9, 0.9, 0.9),
  })
  y -= 26

  page.drawText("Montant total", { x: left, y, size: 12, font: fontBold })
  page.drawText(formatMoney(quote.amount_cents, quote.currency), {
    x: 420,
    y,
    size: 14,
    font: fontBold,
    color: rgb(0.07, 0.2, 0.45),
  })

  y -= 60
  page.drawText("Conditions", { x: left, y, size: 11, font: fontBold })
  y -= 16
  page.drawText("- Validite du devis: 30 jours.", { x: left, y, size: 10, font: fontRegular })
  y -= 14
  page.drawText("- Intervention planifiee apres acceptation.", { x: left, y, size: 10, font: fontRegular })
  y -= 14
  page.drawText("- Paiement selon conditions contractuelles.", { x: left, y, size: 10, font: fontRegular })

  y -= 52
  page.drawLine({
    start: { x: left, y },
    end: { x: 545, y },
    thickness: 1,
    color: rgb(0.9, 0.9, 0.9),
  })
  y -= 18
  page.drawText("Dr.Tri - On transporte, on installe, on debarrasse.", {
    x: left,
    y,
    size: 9,
    font: fontRegular,
    color: rgb(0.35, 0.35, 0.35),
  })

  const bytes = await pdf.save()
  const arrayBuffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer

  return new NextResponse(arrayBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="devis-${quote.id.slice(0, 8)}.pdf"`,
      "Cache-Control": "private, no-store, max-age=0",
    },
  })
}
