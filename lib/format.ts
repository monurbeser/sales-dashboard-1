export function formatCurrency(amount: number, currency = "TRY") {
  try {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    return `${Math.round(amount)} ₺`
  }
}

export function formatPercent(p: number) {
  return `%${Math.round(p)}`
}
