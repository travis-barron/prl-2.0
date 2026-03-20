'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabaseBrowserClient'

export default function UploadPage() {
      const [user, setUser] = useState<any>(null);
      const [race, setRace] = useState<any>(null)
      const supabase = createClient()
  
      useEffect(() => {
          supabase.auth.getUser().then(({ data }) => {
              setUser(data.user);
          })
      })

  if (!user) {
    return <p>Unauthorized</p>
  }

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