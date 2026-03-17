"use client"

import { useState } from "react"
import StandingsTable from "@/components/StandingsTable"
import RaceHistory from "@/components/RaceHistory"

export default function Home() {
  const [race, setRace] = useState<any>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)

    const res = await fetch("/api/parse", {
      method: "POST",
      body: formData
    })

    const data = await res.json()

    setRace(data.parsedRace)
  }

  return (
    <main style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>NR2003 Race Parser</h1>

      <form onSubmit={handleSubmit}>
        <input type="file" name="file" accept=".html" required />
        <button type="submit">Upload</button>
      </form>

      {race && <RacePanel race={race} />}
    </main>
  )
}

function RacePanel({ race }: { race: any }) {

  const results = race?.race ?? []
  const winner = results[0]

  if (!winner) {
    return <p>No race results found.</p>
  }

  return (
    <div style={{ marginTop: 40 }}>

      <h2>{race.track}</h2>
      <p>{race.date}</p>

      <h3>Winner</h3>
      <p>{winner.driver} (#{winner.carNumber})</p>

      <ul>
        <li>Cautions: {race.cautions}</li>
        <li>Lead Changes: {race.leadChanges}</li>
        <li>AI Strength: {race.aiStrength}%</li>
      </ul>

    </div>
  )
}