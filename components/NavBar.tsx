"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

export default function NavBar() {
    const pathname = usePathname()

    const linkStyle = (path: string) => ({
        color: "#ffdc00",
        padding: "8px 12px",
        textDecoration: "none",
        fontWeight: pathname === path ? "bold" : "normal",
        borderBottom: pathname === path ? "2px solid #ffdc00" : "none"
    })

    return (
        <>
            <nav
                style={{
                    display: "flex",
                    gap: "20px",
                    padding: "12px 24px",
                    borderBottom: "1px solid #ffdc00",
                    alignItems: "center"
                }}
            >
                <Image src="/PRL_Header.png"
                alt="Punk Racing League"
                className="margin-0"
                width={100}
                height={100}
                priority />

                <Link href="/" style={linkStyle("/")}>
                    Home
                </Link>

                <Link href="/standings" style={linkStyle("/standings")}>
                    Standings
                </Link>

                <Link href="/race" style={linkStyle("/race")}>
                    Races
                </Link>
                <input
                placeholder="Search driver..."
                style={{
                    marginLeft: "auto",
                    padding: "6px 8px"
                }}
            />
            </nav>
            
        </>
    )
}