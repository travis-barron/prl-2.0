import RaceResultsTable from "@/components/RaceResultsTable"

export default async function RacePage({
  params
}: {
  params: Promise<{ id: string }>
}) {

  const { id } = await params

  return (
    <main>
      <RaceResultsTable raceId = {id} />
    </main>
  )
}