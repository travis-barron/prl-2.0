import { supabase } from "@/lib/supabase"
import Breadcrumbs from "./Breadcrumbs"
import DriverFinishChart from "./DriverFinishChart"
import RaceResultsTable from "./RaceResultsTable"

type DriverRow = {
    finish: number
    start_pos: number
    laps_completed: number
    laps_led: number
    points: number
    races: {
        race_number: number
        track: string
    }
    season_entries: {
        driver_id: number
        team_name: string
        car_number: string
        drivers: {
            id: number
            name: string
        }
    }
}

export default async function DriverStats({ driverId }: { driverId: string }) {
    const { data, error } = await supabase
        .from('race_results')
        .select(`
      finish,
      start_pos,
      laps_completed,
      laps_led,
      points,
      status,
      races!inner (
        race_number,
        track
      ),
      season_entries!inner (
        id,
        driver_id,
        car_number,
        team_name,
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
        return (<h1>An error occurred</h1>)
    }

    if (!data || data.length === 0) {
        return (<h1>Driver not found</h1>)
    }

    //calculate stats
    const races = rows.length

    const points = rows.reduce((sum, r) => sum + r.points, 0)
    const wins = rows.filter(r => r.finish === 1).length
    const top5 = rows.filter(r => r.finish <= 5).length
    const top10 = rows.filter(r => r.finish <= 10).length
    const lapsLed = rows.reduce((sum, r) => sum + r.laps_led, 0)
    const driverName = rows[0].season_entries?.drivers?.name
    const teamName = rows[0].season_entries?.team_name
    const car_number = rows[0].season_entries?.car_number

    const avgFinish =
        rows.reduce((sum, r) => sum + r.finish, 0) / races

    const results = rows.map((r: any) => ({
        raceNumber: r.races.race_number,
        track: r.races.track,
        start: r.start_pos,
        finish: r.finish,
        laps_completed: r.laps_completed,
        laps_led: r.laps_led,
        status: r.status
    }))

    return (
        <div>
            <Breadcrumbs items={{ label: driverName, href: "" }} />
            <div className="px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="rounded-xl border overflow-x-auto">
                        <h1 className="pb-6 text-xl font-bold bg-yellow-400 p-4 text-black">Driver Info</h1>
                        <h1 className="px-6 pt-6">Name: {driverName}</h1>
                        <h1 className="px-6 pt-6">Car Number: {car_number}</h1>
                        <h1 className="px-6 pt-6">Team: {teamName}</h1>
                    </div>
                    <div className="rounded-xl border overflow-x-auto">
                        <h1 className="pb-6 text-xl font-bold bg-yellow-400 p-4 text-black">Season Stats</h1>
                        <div className="px-4 pt-6">
                        <table className="min-w-full" style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    <th align="left">Points</th>
                                    <th align="left">Wins</th>
                                    <th align="left">Top 5</th>
                                    <th align="left">Top 10</th>
                                    <th align="left">Laps Led</th>
                                    <th align="left">Avg Finish</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{points}</td>
                                    <td>{wins}</td>
                                    <td>{top5}</td>
                                    <td>{top10}</td>
                                    <td>{lapsLed}</td>
                                    <td>{avgFinish}</td>
                                </tr>
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border overflow-x-auto mt-6">
                <h2 className="pb-6 text-xl font-bold bg-yellow-400 p-4 text-black">Race Results</h2>
                <br />
                <div className="px-4">
                <table className="min-w-full" style={{ borderCollapse: "collapse", width: "100%" }}>
                    <thead>
                        <tr>
                            <th align="left">Race</th>
                            <th align="left">Track</th>
                            <th align="left">Start</th>
                            <th align="left">Finish</th>
                            <th align="left">Diff</th>
                            <th align="left">Laps</th>
                            <th align="left">Led</th>
                            <th align="left">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {results.sort((a: any, b: any) => a.raceNumber - b.raceNumber).map((r: any, i: number) => (
                            <tr key={i}>
                                <td>{r.raceNumber}</td>
                                <td>{r.track}</td>
                                <td>{r.start}</td>
                                <td>{r.finish}</td>
                                <td>{r.start - r.finish}</td>
                                <td>{r.laps_completed}</td>
                                <td>{r.laps_led}</td>
                                <td>{r.status}</td>
                            </tr>
                        ))}
                    </tbody>

                </table>
                </div>
                </div>

                <DriverFinishChart results={results.sort((a: any, b: any) => a.raceNumber - b.raceNumber)} />

            </div>
        </div>
    )
}