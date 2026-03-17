import fs from "fs"
import { load, CheerioAPI }  from "cheerio"
import { normalizeDriver } from "./normalizeDriver"

export function parseNR2003(html: string) {
  const $ = load(html)

  const race: any = {
    practice: [],
    qualifying: [],
    happyHour: [],
    race: []
  }

  // Track
  race.track = $("h3")
    .filter((_, el) => $(el).text().includes("Track:"))
    .text()
    .replace("Track:", "")
    .trim()

  // Date
  race.date = $("h3")
    .filter((_, el) => $(el).text().includes("Date:"))
    .text()
    .replace("Date:", "")
    .trim()

  // AI Strength
  race.aiStrength = parseInt(
    $("h3")
      .filter((_, el) => $(el).text().includes("AI Strength"))
      .text()
      .match(/\d+/)?.[0] ?? "0"
  )

  // Cautions
  race.cautions = parseInt(
    $("h3")
      .filter((_, el) => $(el).text().includes("Caution Flags"))
      .text()
      .match(/\d+/)?.[0] ?? "0"
  )

  // Lead Changes
  race.leadChanges = parseInt(
    $("h3")
      .filter((_, el) => $(el).text().includes("Lead Changes"))
      .text()
      .match(/\d+/)?.[0] ?? "0"
  )

  $("h3").each((_, el) => {
    const text = $(el).text()

    if (!text.includes("Session:")) return

    const session = text.replace("Session:", "").trim()

    const table = $(el).nextAll("table").first()

    table.find("tr").each((i, row) => {
      if (i === 0) return

      const cols = $(row).find("td")
      if (cols.length === 0) return

      if (session === "Race") {
        const lapsLedRaw = $(cols[6]).text().trim()

        race.race.push({
          finish: Number($(cols[0]).text()),
          start: Number($(cols[1]).text()),
          carNumber: Number($(cols[2]).text()),
          driver: normalizeDriver($(cols[3]).text().trim()),
          interval: $(cols[4]).text().trim(),
          lapsCompleted: Number($(cols[5]).text()),
          lapsLed: Number(lapsLedRaw.replace("*", "")),
          mostLapsLed: lapsLedRaw.includes("*"),
          points: Number($(cols[7]).text()),
          status: $(cols[8]).text().trim()
        })
      } else {
        const result = {
          position: Number($(cols[0]).text()),
          carNumber: Number($(cols[1]).text()),
          driver: normalizeDriver($(cols[2]).text().trim()),
          time: Number($(cols[3]).text())
        }

        if (session === "Practice") race.practice.push(result)
        if (session === "Qualifying") race.qualifying.push(result)
        if (session === "Happy Hour") race.happyHour.push(result)
      }
    })
  })

  return race
}