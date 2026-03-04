import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Dr.Tri Platform",
  description: "Plateforme client et backoffice Dr.Tri",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
