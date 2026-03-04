import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const first_name = formData.get("first_name")
    const last_name = formData.get("last_name")
    const email = formData.get("email")
    const phone = formData.get("phone")
    const message = formData.get("message")

    // TODO: envoyer par e-mail (ex. Resend, SendGrid) ou enregistrer en base
    // Pour l'instant on redirige avec un paramètre success
    const url = new URL("/contact", request.url)
    url.searchParams.set("success", "1")
    return NextResponse.redirect(url)
  } catch {
    const url = new URL("/contact", request.url)
    url.searchParams.set("error", "1")
    return NextResponse.redirect(url)
  }
}
