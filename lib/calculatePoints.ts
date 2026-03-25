type PointsSystem = {
  positions: Record<number, number>
  bonus: {
    lap_led?: number
    most_laps_led?: number
  }
}

export function calculatePoints(
  result: any,
  system: PointsSystem
) {
  const finishPoints = system.positions[result.finish] ?? 0

  let bonus = 0

  if (result.laps_led > 0) {
    bonus += system.bonus.lap_led ?? 0
  }

  if (result.most_laps_led) {
    bonus += system.bonus.most_laps_led ?? 0
  }

  return finishPoints + bonus
}