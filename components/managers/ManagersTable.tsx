"use client"

import { useMemo, useState } from "react"
import { useSalesStore } from "@/store/useSalesStore"
import { MonthValuesDialog } from "@/components/managers/MonthValuesDialog"
import { CoefficientDialog } from "@/components/managers/CoefficientDialog"
import { calculatePercentage, sumMonthMap } from "@/lib/calc"
import { formatCurrency, formatPercent } from "@/lib/format"
import type { ManagerType } from "@/store/schema"

type EditState = { id: string; name: string } | null

function percentClass(p: number) {
  if (p >= 90) return "text-emerald-300"
  if (p >= 60) return "text-amber-300"
  return "text-red-300"
}

type Props = {
  type: ManagerType
  title: string
}

export function ManagersTable({ type, title }: Props) {
  const salesManagers = useSalesStore((s) => s.salesManagers)
  const productManagers = useSalesStore((s) => s.productManagers)

  const targets = useSalesStore((s) => (type === "sales" ? s.targets.sales : s.targets.product))
  const actuals = useSalesStore((s) => (type === "sales" ? s.actuals.sales : s.actuals.product))
  const coefficients = useSalesStore((s) => s.coefficients)

  const addManager = useSalesStore((s) => s.addManager)
  const updateManager = useSalesStore((s) => s.updateManager)
  const deleteManager = useSalesStore((s) => s.deleteManager)
  const setMonthValue = useSalesStore((s) => s.setMonthValue)
  const setCoefficient = useSalesStore((s) => s.setCoefficient)

  const list = type === "sales" ? salesManagers : productManagers

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [addName, setAddName] = useState("")
  const [edit, setEdit] = useState<EditState>(null)
  const [targetsOpenId, setTargetsOpenId] = useState<string | null>(null)
  const [actualsOpenId, setActualsOpenId] = useState<string | null>(null)
  const [coeffOpenId, setCoeffOpenId] = useState<string | null>(null)

  const rows = useMemo(() => list, [list])

  function saveAdd() {
    const name = addName.trim()
    if (!name) return
    addManager(type, name)
    setIsAddOpen(false)
    setAddName("")
  }

  function saveEdit() {
    if (!edit) return
    updateManager(type, edit.id, edit.name.trim())
    setEdit(null)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white/5 p-5 shadow-lg flex justify-between items-center">
        <div>
          <div className="text-lg font-semibold">{title}</div>
          <div className="text-sm text-slate-300">Toplam: {rows.length}</div>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="rounded-xl bg-gradient-to-br from-cyan-400/30 via-blue-500/30 to-indigo-500/30 px-4 py-2 text-sm font-semibold text-slate-100"
        >
          Yeni Ekle
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5 text-slate-300">
            <tr>
              <th className="px-4 py-3">Ad Soyad</th>
              <th className="px-4 py-3">Hedef</th>
              <th className="px-4 py-3">Gerçekleşme</th>
              <th className="px-4 py-3">%</th>
              <th className="px-4 py-3">Katsayı</th>
              <th className="px-4 py-3">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => {
              const t = targets[m.id]
              const a = actuals[m.id]
              const tt = sumMonthMap(t)
              const at = sumMonthMap(a)
              const p = calculatePercentage(at, tt)
              const ck = `${m.id}-${type}`
              const coeff = coefficients[ck] ?? 1

              return (
                <tr key={m.id} className="border-t border-white/10">
                  <td className="px-4 py-3">{m.name}</td>
                  <td className="px-4 py-3">{formatCurrency(tt)}</td>
                  <td className="px-4 py-3">{formatCurrency(at)}</td>
                  <td className={`px-4 py-3 font-semibold ${percentClass(p)}`}>{formatPercent(p)}</td>
                  <td className="px-4 py-3">{coeff}</td>
                  <td className="px-4 py-3 flex gap-2 flex-wrap">
                    <button onClick={() => setTargetsOpenId(m.id)}>Hedef</button>
                    <button onClick={() => setActualsOpenId(m.id)}>Gerçekleşme</button>
                    <button onClick={() => setCoeffOpenId(m.id)}>Katsayı</button>
                    <button onClick={() => setEdit({ id: m.id, name: m.name })}>Düzenle</button>
                    <button onClick={() => deleteManager(type, m.id)}>Sil</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {isAddOpen && (
        <MonthValuesDialog
          title={`${title} Ekle`}
          values={{}}
          onChange={() => {}}
          onClose={() => setIsAddOpen(false)}
        />
      )}

      {edit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white p-6 rounded-xl">
            <input
              value={edit.name}
              onChange={(e) => setEdit({ ...edit, name: e.target.value })}
            />
            <button onClick={saveEdit}>Kaydet</button>
          </div>
        </div>
      )}

      {targetsOpenId && (
        <MonthValuesDialog
          title="Hedef"
          values={targets[targetsOpenId] || {}}
          onChange={(m, v) => setMonthValue("targets", type, targetsOpenId, m, v)}
          onClose={() => setTargetsOpenId(null)}
        />
      )}

      {actualsOpenId && (
        <MonthValuesDialog
          title="Gerçekleşme"
          values={actuals[actualsOpenId] || {}}
          onChange={(m, v) => setMonthValue("actuals", type, actualsOpenId, m, v)}
          onClose={() => setActualsOpenId(null)}
        />
      )}

      {coeffOpenId && (
        <CoefficientDialog
          value={coefficients[`${coeffOpenId}-${type}`] ?? 1}
          onSave={(v) => setCoefficient(type, coeffOpenId, v)}
          onClose={() => setCoeffOpenId(null)}
        />
      )}
    </div>
  )
}
