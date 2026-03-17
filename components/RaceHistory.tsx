"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type Race = {
    id: number
    raceNumber: number
    track: string
    date: string
    winner: string
}

export default function RaceHistory() {

    const [races, setRaces] = useState<Race[]>([])

    useEffect(() => {
        fetch("/api/races")
            .then(res => res.json())
            .then(data => setRaces(data))
    }, [])

    return (
        <div style={{ marginTop: 40 }}>
            <h2>Season Races</h2>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th align="left">Race</th>
                        <th align="left">Track</th>
                        <th align="left">Date</th>
                        <th align="left">Winner</th>
                    </tr>
                </thead>

                <tbody>
                    {races.map(r => (
                        <tr key={r.id}>
                            <td>
                                <Link href={`/race/${r.id}`}>
                                    Race {r.raceNumber}
                                </Link>
                            </td>
                            <td>{r.track}</td>
                            <td>{r.date}</td>
                            <td>{r.winner}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    )
}