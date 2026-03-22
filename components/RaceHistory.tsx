"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type Race = {
    id: number
    raceNumber: number
    track: string
    date: string
    winner: string
    cautions: number
    lead_changes: number
}

export default function RaceHistory() {

    const [races, setRaces] = useState<Race[]>([])

    useEffect(() => {
        fetch("/api/races")
            .then(res => res.json())
            .then(data => setRaces(data))
    }, [])

    return (
        <div className="rounded-xl border overflow-x-auto" style={{ marginTop: 40 }}>
            <h2 className="pb-6 text-xl font-bold bg-yellow-400 p-4 text-black">Schedule</h2>
            <div className="px-4 pt-6">
                <table className="min-w-full" style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th align="left">Race</th>
                            <th align="left">Track</th>
                            <th align="left">Date</th>
                            <th align="left">Cautions</th>
                            <th align="left">Lead Changes</th>
                            <th align="left">Winner</th>
                        </tr>
                    </thead>

                    <tbody>
                        {races.map((r, i) => (
                            <tr key={r.id} className={i % 2 == 1 ? "bg-grey-100" : "bg-black"}>
                                <td><Link href={`/race/${r.id}`}>{r.raceNumber}</Link></td>
                                <td><Link href={`/race/${r.id}`}>{r.track}</Link></td>
                                <td><Link href={`/race/${r.id}`}>{r.date}</Link></td>
                                <td><Link href={`/race/${r.id}`}>{r.cautions}</Link></td>
                                <td><Link href={`/race/${r.id}`}>{r.lead_changes}</Link></td>
                                <td><Link href={`/race/${r.id}`}>{r.winner}</Link></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}