import { supabase } from "@/lib/supabase"

export async function GET() {

  const { data, error } = await supabase
    .from("standings")
    .select(`
      points,
      wins,
      top5,
      top10,
      laps_led,
      dnfs,
      season_entries (
        drivers (
          name,
          id
        )
      )
    `)
    .order("points", { ascending: false })

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  const standings = data.map((row: any) => ({
    name: row.season_entries.drivers.name,
    points: row.points,
    wins: row.wins,
    top5: row.top5,
    top10: row.top10,
    lapsLed: row.laps_led,
    dnfs: row.dnfs,
    id: row.season_entries.drivers.id
  }))

  return Response.json(standings)
}