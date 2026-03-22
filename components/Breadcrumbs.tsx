"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Breadcrumbs({ items }: { items: { label: string, href: string } }) {
  const pathname = usePathname()
  const labelMap: Record<string, string> = {
    driver: "Standings",
    race: "Races",
    standings: "Standings"
  }

  const segments = pathname.split("/").filter(Boolean)

  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/").replace('driver', 'standings')

    return {
      label: labelMap[segment] ?? decodeURIComponent(segment),// decodeURIComponent(segment) == 'driver' ? 'standings' : decodeURIComponent(segment),
      href
    }
  })

  return (
    <div className={"pl-2"}>
      <nav style={{ marginBottom: "16px", fontSize: "14px" }}>
        <Link href="/">Dashboard</Link>

        {breadcrumbs.map((crumb, index) => (
          <span key={crumb.href}>
            {" > "}
            {index === breadcrumbs.length - 1 ? (
              <span>{items != null ? items.label : crumb.label}</span>
            ) : (
              <Link href={crumb.href}>{crumb.label}</Link>
            )}
          </span>
        ))}
      </nav>
    </div>
  )
}