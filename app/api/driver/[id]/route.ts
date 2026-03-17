import { supabase } from "@/lib/supabase"

type DriverRow = {
  finish: number
  start_pos: number
  laps_led: number
  points: number
  races: {
    race_number: number
    track: string
  }
  season_entries: {
    driver_id: number
    drivers: {
      id: number
      name: string
    }
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  const n = await params;
  const driverId = n.id
  console.log("route: " + driverId)

  const { data, error } = await supabase
    .from('race_results')
    .select(`
      finish,
      start_pos,
      laps_led,
      points,
      races!inner (
        race_number,
        track
      ),
      season_entries!inner (
        id,
        driver_id,
        drivers!inner(
        id,
        name
      )
      )
    `)
    .eq("season_entries.driver_id", driverId)

  const rows = data as unknown as DriverRow[]

  if (error) {
    console.error(error.message)
    return Response.json({ error: error.message }, { status: 500 })
  }

  if (!data || data.length === 0) {
    return Response.json({ error: "Driver not found" }, { status: 404 })
  }

  //calculate stats
  const races = rows.length

  const points = rows.reduce((sum, r) => sum + r.points, 0)
  const wins = rows.filter(r => r.finish === 1).length
  const top5 = rows.filter(r => r.finish <= 5).length
  const top10 = rows.filter(r => r.finish <= 10).length
  const lapsLed = rows.reduce((sum, r) => sum + r.laps_led, 0)
  const driverName = rows[0].season_entries?.drivers?.name

  const avgFinish =
    rows.reduce((sum, r) => sum + r.finish, 0) / races

  const results = rows.map((r: any) => ({
    raceNumber: r.races.race_number,
    track: r.races.track,
    start: r.start_pos,
    finish: r.finish
  }))

  console.log('made it to return response')
  return Response.json({
    name: driverName,
    stats: {
      points,
      wins,
      top5,
      top10,
      lapsLed,
      avgFinish: avgFinish.toFixed(2)
    },
    results
  })
}