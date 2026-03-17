import { driverRegistry } from "./driverRegistry"

export function normalizeDriver(name: string): string {
  const trimmed = name.trim()

  if (!driverRegistry[trimmed]) {
    console.warn("Unknown driver:", trimmed)
    return trimmed
  }

  return driverRegistry[trimmed]
}