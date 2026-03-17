import { supabase } from "@/lib/supabase"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const raceId = await Number(id)

  const { data, error } = await supabase
    .from("race_results")
    .select(`
      finish,
      start_pos,
      laps_completed,
      laps_led,
      status,
      points,
      season_entries (
        car_number,
        drivers (
          name,
          id
        )
      ),
      races (
        track,
        date,
        race_number
      )
    `)
    .eq("race_id", raceId)
    .order("finish")

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  if (!data || data.length === 0) {
    return Response.json({ error: "Race not found" }, { status: 404 })
  }

  const raceInfo = data[0].races

  const results = data.map((row: any) => ({
    finish: row.finish,
    start: row.start_pos,
    driver: row.season_entries.drivers.name,
    carNumber: row.season_entries.car_number,
    lapsCompleted: row.laps_completed,
    lapsLed: row.laps_led,
    status: row.status,
    points: row.points,
    id: row.season_entries.drivers.id
  }))

  return Response.json({
    race: raceInfo,
    results
  })
}