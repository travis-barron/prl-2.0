import RaceResultsTable from "@/components/RaceResultsTable"
import Breadcrumbs from "@/components/Breadcrumbs"

async function getRace(id: string) {
  const res = await fetch(`http://localhost:3000/api/race/${id}`, {
    cache: "no-store"
  })

  return res.json()
}

export default async function RacePage({
  params
}: {
  params: Promise<{ id: string }>
}) {

  const { id } = await params

  const data = await getRace(id)

  if (!data?.race) {
    return <p>Race not found</p>
  }

  return (
    <main style={{ padding: 40 }}>
      <Breadcrumbs items={{label: data.race.track, href: ""}}/>
      <h1>
        Race {data.race.race_number} — {data.race.track}
      </h1>

      <p>{data.race.date}</p>

      <RaceResultsTable results={data.results} />
    </main>
  )
}