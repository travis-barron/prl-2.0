"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type Standing = {
  name: string
  points: number
  top5: number
  top10: number
  lapsLed: number
  dnfs: number
  id: number
}

export default function StandingsTable() {

  const [standings, setStandings] = useState<Standing[]>([])

  useEffect(() => {
    fetch("/api/standings")
      .then(res => res.json())
      .then(data => setStandings(data))
  }, [])

  console.log(standings)

  return (
    <div className="rounded-xl border overflow-x-auto">
      <h1 className="text-xl font-bold bg-yellow-400 p-4 text-black">Championship Standings</h1>
      <br />
      <div className="pl-4 pr-4">
      <table className="min-w-full" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th align="left">Pos</th>
            <th align="left">Driver</th>
            <th align="left">Points</th>
            <th align="left">Top Fives</th>
            <th align="left">Top Tens</th>
            <th align="left">Laps Led</th>
            <th align="left">DNFs</th>
          </tr>
        </thead>

        <tbody>
          {standings.map((s, i) => (
            <tr key={s.name} className={i % 2 == 1 ? "bg-grey-100" : "bg-black"}>
              <td>{i + 1}</td>
              <td><Link href={"driver/" + s.id}>{s.name}</Link></td>
              <td>{s.points}</td>
              <td>{s.top5}</td>
              <td>{s.top10}</td>
              <td>{s.lapsLed}</td>
              <td>{s.dnfs}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}