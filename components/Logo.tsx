import Image from "next/image"
import Link from "next/link"

type LogoProps = {
  href?: string
  className?: string
  size?: "sm" | "md" | "lg"
  showText?: boolean
  direction?: "column" | "row"
}

const sizes = {
  sm: { wrapper: 80 },
  md: { wrapper: 120 },
  lg: { wrapper: 160 },
}

export function Logo({ href = "/", className = "", size = "md", showText = true, direction = "column" }: LogoProps) {
  const w = sizes[size].wrapper
  const isRow = direction === "row"
  const content = (
    <span
      className={`inline-flex gap-1.5 ${isRow ? "flex-row items-end" : "flex-col items-center"} ${className}`}
      style={isRow ? undefined : { width: w }}
    >
      <Image
        src="/images/logo-axel.webp"
        alt=""
        width={w}
        height={w}
        className={`shrink-0 object-contain ${isRow ? "h-14 w-14 sm:h-16 sm:w-16" : "h-auto w-full"}`}
        aria-hidden
      />
      <Image
        src="/images/logo-drtri.webp"
        alt=""
        width={isRow ? 80 : w}
        height={20}
        className={`shrink-0 object-contain mb-2.5 ${isRow ? "h-[20px] w-auto" : "h-[20px] w-full"}`}
        aria-hidden
      />
      {showText && (
        <span className="text-lg font-bold text-dr-tri-primary md:text-xl">Dr.Tri</span>
      )}
    </span>
  )

  if (href) {
    return (
      <Link
        href={href}
        className="rounded-dr-tri focus:outline-none"
        aria-label="Dr.Tri - Accueil"
      >
        {content}
      </Link>
    )
  }
  return content
}
