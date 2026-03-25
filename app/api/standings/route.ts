import { supabase } from "@/lib/supabase"

async function GetPointsSystem() {

    const {data: seasonData, error } = await supabase
        .from('seasons')
        .select(`points_system_id`)
        .eq('active', true)

    if (!seasonData || seasonData.length == 0)
    {
        console.error('Invalid season entered. No points system to retrieve')
        return null;
    }

    const systemIds = seasonData[0].points_system_id

    const { data: positions } = await supabase
        .from("points_positions")
        .select("position, points")
        .eq("system_id", systemIds)

    const { data: bonuses } = await supabase
        .from("points_bonus")
        .select("type, points")
        .eq("system_id", systemIds)

    if (!positions || !bonuses) {
        console.error('Invalid system ID. No points system loaded.')
        return null;
    }

    const system = {
        positions: Object.fromEntries(
            positions.map(p => [p.position, p.points])
        ),
        bonus: Object.fromEntries(
            bonuses.map(b => [b.type, b.points])
        )
    }

    console.log(system)
    return system;
}

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