import { supabase } from "@/lib/supabase"

export async function GET() {

  const seasonId = 1

  const { data, error } = await supabase
    .from("races")
    .select(`
      id,
      race_number,
      track,
      date,
      cautions,
      lead_changes,
      race_results (
        finish,
        season_entries (
          drivers (
            name
          )
        )
      )
    `)
    .eq("season_id", seasonId)
    .order("race_number")

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  // determine winner
  const races = data.map((race: any) => {

    const winner = race.race_results.find((r: any) => r.finish === 1)

    return {
      id: race.id,
      raceNumber: race.race_number,
      track: race.track,
      date: race.date,
      cautions: race.cautions,
      lead_changes: race.lead_changes,
      winner: winner?.season_entries?.drivers?.name ?? "Unknown"
    }
  })

  return Response.json(races)
}