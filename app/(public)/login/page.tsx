import { redirect } from "next/navigation"

type LoginPageProps = {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function LoginRedirectPage({ searchParams }: LoginPageProps) {
  const params = await searchParams
  const next = params.next
  const query = new URLSearchParams()
  if (next) query.set("next", next)
  redirect("/auth/login" + (query.toString() ? "?" + query.toString() : ""))
}
