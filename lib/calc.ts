export function safeNumber(v: unknown, fallback = 0) {
  const n = typeof v === "number" ? v : Number(v)
  return Number.isFinite(n) ? n : fallback
}

export function calculatePercentage(actual: number, target: number) {
  if (!target) return 0
  return (actual / target) * 100
}

export function sumMonthMap(map: Record<number, number> | undefined) {
  if (!map) return 0
  let total = 0
  for (const k of Object.keys(map)) {
    total += safeNumber(map[Number(k)])
  }
  return total
}

export function monthIndexList() {
  return [1,2,3,4,5,6,7,8,9,10,11,12] as const
}

export function getQuarter(month: number) {
  if (month <= 3) return 1
  if (month <= 6) return 2
  if (month <= 9) return 3
  return 4
}
