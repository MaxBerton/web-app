import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isAppArea = pathname.startsWith("/app")
  const isAdminArea = pathname.startsWith("/admin")

  if ((isAppArea || isAdminArea) && !user) {
    const nextUrl = request.nextUrl.clone()
    nextUrl.pathname = "/auth/login"
    nextUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(nextUrl)
  }

  if (isAdminArea && user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role !== "admin") {
      const nextUrl = request.nextUrl.clone()
      nextUrl.pathname = "/app"
      return NextResponse.redirect(nextUrl)
    }
  }

  return response
}

export const config = {
  matcher: ["/app/:path*", "/admin/:path*"],
}
