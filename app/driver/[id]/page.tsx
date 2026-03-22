import DriverStats from "@/components/DriverStats"

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

  return (
    <main>
      <DriverStats driverId={id} />
    </main>
  )
}