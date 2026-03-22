import Link from "next/link"
import { supabase } from "@/lib/supabase"
import Breadcrumbs from "./Breadcrumbs"

export default async function RaceResultsTable({ raceId }: { raceId: string }) {
    const query = supabase
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
    
    const { data, error } = await query;

    if (!data || data.length === 0) {
        return (
            <div>
                <h3>Race not found</h3>
            </div>
        )
    }

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

    const raceInfo = data.map((row: any) => ({
        track: row.races.track,
        race_number: row.races.race_number,
        date: row.races.date
    }))

    const sorted = [...results].sort((a, b) => a.finish - b.finish)

    return (
        <div>
            <Breadcrumbs items={{ label: raceInfo[0].track, href: "" }} />
            <div className="px-6">
                <div className="rounded-xl border overflow-x-auto">
                    <h1 className="pb-6 text-xl font-bold bg-yellow-400 p-4 text-black">
                        Race {raceInfo[0].race_number} — {raceInfo[0].track} — {raceInfo[0].date}
                    </h1>
                    <br />
                    <div className="px-4">
                    <table className="min-w-full" 
                        style={{
                            width: "100%",
                            borderCollapse: "collapse"
                        }}
                    >
                        <thead>
                            <tr>
                                <th align="left">Pos</th>
                                <th align="left">Driver</th>
                                <th align="left">#</th>
                                <th align="left">Start</th>
                                <th align="left">Diff</th>
                                <th align="left">Laps</th>
                                <th align="left">Led</th>
                                <th align="left">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {sorted.map((r, i) => (
                                <tr key={r.finish} style={{fontWeight: r.finish === 1 ? "bold" : "normal"}} className={i % 2 == 1 ? "bg-grey-100" : "bg-black"}>
                                    <td>{r.finish}</td>
                                    <td>
                                        <Link href={`/driver/${encodeURIComponent(r.id)}`}>
                                            {r.driver}
                                        </Link>
                                    </td>
                                    <td>{r.carNumber}</td>
                                    <td>{r.start}</td>
                                    <td>{r.start - r.finish}</td>
                                    <td>{r.lapsCompleted}</td>
                                    <td>{r.lapsLed}</td>
                                    <td>{r.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
        </div>
    )
}