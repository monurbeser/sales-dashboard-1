"use client"

import { PageShell } from "@/components/app/PageShell"
import { useSalesStore } from "@/store/useSalesStore"
import { monthIndexList } from "@/lib/calc"
import { formatCurrency } from "@/lib/format"

const MONTH_NAMES_TR = [
  "Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık",
]

function sum(values: number[]) {
  return values.reduce((a, b) => a + b, 0)
}

export default function CommissionPage() {
  const salesManagers = useSalesStore((s) => s.salesManagers)
  const actuals = useSalesStore((s) => s.actuals.sales)
  const coefficients = useSalesStore((s) => s.coefficients)

  const rows = salesManagers.map((m) => {
    const ck = `${m.id}-sales`
    const coeff = typeof coefficients[ck] === "number" ? coefficients[ck] : 1

    const monthly = monthIndexList().map((mo) => {
      const actual = actuals[m.id]?.[mo] ?? 0
      const commission = actual * coeff
      return { mo, actual, commission }
    })

    const yearlyActual = sum(monthly.map((x) => x.actual))
    const yearlyCommission = sum(monthly.map((x) => x.commission))

    return { id: m.id, name: m.name, coeff, monthly, yearlyActual, yearlyCommission }
  })

  const teamCommission = sum(rows.map((r) => r.yearlyCommission))

  return (
    <PageShell title="Commission">
      <div className="space-y-6">
        <div className="rounded-2xl bg-white/5 p-5 shadow-lg">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-lg font-semibold">Prim Hesaplama</div>
              <div className="mt-1 text-sm text-slate-300">
                Formül: Prim = Gerçekleşme × Katsayı
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold text-slate-300">Takım Toplam Prim</div>
              <div className="mt-1 text-2xl font-extrabold text-cyan-200">
                {formatCurrency(teamCommission)}
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl shadow-black/30">
          <div className="overflow-x-auto">
            <table className="min-w-[1100px] w-full text-left text-sm">
              <thead className="bg-white/5 text-slate-300">
                <tr>
                  <th className="px-4 py-3 font-semibold">Ad Soyad</th>
                  <th className="px-4 py-3 font-semibold">Katsayı</th>
                  <th className="px-4 py-3 font-semibold">Yıllık Gerçekleşme</th>
                  <th className="px-4 py-3 font-semibold">Yıllık Prim</th>
                  {MONTH_NAMES_TR.map((mn) => (
                    <th key={mn} className="px-4 py-3 font-semibold">{mn}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-slate-400" colSpan={4 + 12}>
                      Henüz satış yöneticisi yok
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.id} className="border-t border-white/10">
                      <td className="px-4 py-3 font-medium text-slate-100">{r.name}</td>
                      <td className="px-4 py-3 text-slate-200">{r.coeff}</td>
                      <td className="px-4 py-3 text-slate-200">{formatCurrency(r.yearlyActual)}</td>
                      <td className="px-4 py-3 font-semibold text-emerald-200">{formatCurrency(r.yearlyCommission)}</td>
                      {r.monthly.map((m) => (
                        <td key={m.mo} className="px-4 py-3 text-slate-200">
                          {formatCurrency(m.commission)}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 text-xs text-slate-400">
            Not: Şu an prim, gerçekleşmenin katsayı ile çarpımıdır. Kademeli prim ve eşik mantığı sonraki adım.
          </div>
        </div>
      </div>
    </PageShell>
  )
}
