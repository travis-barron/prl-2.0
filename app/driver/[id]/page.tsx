import DriverFinishChart from "@/components/DriverFinishChart"
import Breadcrumbs from "@/components/Breadcrumbs"

async function getDriver(id: number) {
  const res = await fetch(
    `http://localhost:3000/api/driver/${id}`,
    { cache: "no-store" }
  )

  return res.json()
}

export default async function DriverPage({
  params
}: {
  params: Promise<{ id: string }>
}) {

  const { id } = await params
  const driverId = Number(id)

  if (Number.isNaN(driverId)) {
    return <p>Driver not found</p>
  }

  const data = await getDriver(driverId)

  if (!data?.stats) {
    return <p>Driver not found</p>
  }

  const stats = data.stats

  return (
    <main style={{ padding: 40 }}>
      <Breadcrumbs items = {{ label: data.name, href: ""}}/>

      <h1>{data.name}</h1>

      <h2>Season Stats</h2>

      <ul>
        <li>Points: {stats.points}</li>
        <li>Wins: {stats.wins}</li>
        <li>Top 5: {stats.top5}</li>
        <li>Top 10: {stats.top10}</li>
        <li>Laps Led: {stats.lapsLed}</li>
        <li>Avg Finish: {stats.avgFinish}</li>
      </ul>

      <h2>Race Results</h2>

      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>Race</th>
            <th>Track</th>
            <th>Start</th>
            <th>Finish</th>
          </tr>
        </thead>

        <tbody>
          {data.results.sort((a: any, b: any) => a.raceNumber - b.raceNumber).map((r: any, i: number) => (
            <tr key={i}>
              <td>{r.raceNumber}</td>
              <td>{r.track}</td>
              <td>{r.start}</td>
              <td>{r.finish}</td>
            </tr>
          ))}
        </tbody>

      </table>

      <DriverFinishChart results={data.results.sort((a: any, b:any) => a.raceNumber - b.raceNumber)} />

    </main>
  )
}