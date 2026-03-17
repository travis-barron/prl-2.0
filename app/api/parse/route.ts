import { parseNR2003 } from "@/lib/parseNR2003"
import { ingestRace } from "@/lib/ingestRace"

export async function POST(req: Request) {

  const formData = await req.formData()
  const file = formData.get("file") as File

  const html = await file.text()

  const parsed = parseNR2003(html)

  const seasonId = 1

  const race = await ingestRace(parsed, seasonId)

  return Response.json({
    success: true,
    raceId: race.id,
    parsedRace: parsed
  })
}