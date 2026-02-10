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
  const rows = useMemo(() => list, [list])

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [addName, setAddName] = useState("")
  const [edit, setEdit] = useState<EditState>(null)

  const [targetsOpenId, setTargetsOpenId] = useState<string | null>(null)
  const [actualsOpenId, setActualsOpenId] = useState<string | null>(null)
  const [coeffOpenId, setCoeffOpenId] = useState<string | null>(null)

  function openAdd() {
    setAddName("")
    setIsAddOpen(true)
  }

  function saveAdd() {
    const name = addName.trim()
    if (!name) return
    addManager(type, name)
    setIsAddOpen(false)
    setAddName("")
  }

  function openEdit(id: string, name: string) {
    setEdit({ id, name })
  }

  function saveEdit() {
    if (!edit) return
    const name = edit.name.trim()
    if (!name) return
    updateManager(type, edit.id, name)
    setEdit(null)
  }

  function onDelete(id: string, name: string) {
    const ok = window.confirm(`"${name}" silinsin mi`)
    if (!ok) return
    deleteManager(type, id)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white/5 p-5 shadow-lg">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-lg font-semibold">{title}</div>
            <div className="mt-1 text-sm text-slate-300">
              Toplam: <span className="font-semibold text-cyan-300">{rows.length}</span>
            </div>
          </div>

          <div className="flex w-full justify-end md:w-auto">
            <button
              onClick={openAdd}
              className="rounded-xl bg-gradient-to-br from-cyan-400/30 via-blue-500/30 to-indigo-500/30 px-4 py-2 text-sm font-semibold text-slate-100 hover:from-cyan-400/40 hover:via-blue-500/40 hover:to-indigo-500/40"
            >
              Yeni Ekle
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl shadow-black/30">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Ad Soyad</th>
                <th className="px-4 py-3 font-semibold">Hedef</th>
                <th className="px-4 py-3 font-semibold">Gerçekleşme</th>
                <th className="px-4 py-3 font-semibold">%</th>
                <th className="px-4 py-3 font-semibold">Katsayı</th>
                <th className="px-4 py-3 font-semibold">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-slate-400" colSpan={6}>
                    Henüz kayıt yok
                  </td>
                </tr>
              ) : (
                rows.map((m) => {
                  const t = targets[m.id]
                  const a = actuals[m.id]
                  const targetTotal = sumMonthMap(t)
                  const actualTotal = sumMonthMap(a)
                  const p = calculatePercentage(actualTotal, targetTotal)

                  const coeffKey = `${m.id}-${type}`
                  const coeff = typeof coefficients[coeffKey] === "number" ? coefficients[coeffKey] : 1

                  return (
                    <tr key={m.id} className="border-t border-white/10">
                      <td className="px-4 py-3 font-medium text-slate-100">{m.name}</td>
                      <td className="px-4 py-3 text-slate-200">{formatCurrency(targetTotal)}</td>
                      <td className="px-4 py-3 text-slate-200">{formatCurrency(actualTotal)}</td>
                      <td className={"px-4 py-3 font-semibold " + percentClass(p)}>{formatPercent(p)}</td>
                      <td className="px-4 py-3 text-slate-200">{coeff}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setTargetsOpenId(m.id)}
                            className="rounded-xl bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10"
                          >
                            Hedef
                          </button>
                          <button
                            onClick={() => setActualsOpenId(m.id)}
                            className="rounded-xl bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10"
                          >
                            Gerçekleşme
                          </button>
                          <button
                            onClick={() => setCoeffOpenId(m.id)}
                            className="rounded-xl bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10"
                          >
                            Katsayı
                          </button>
                          <button
                            onClick={() => openEdit(m.id, m.name)}
                            className="rounded-xl bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10"
                          >
                            Düzenle
                          </button>
                          <button
                            onClick={() => onDelete(m.id, m.name)}
                            className="rounded-xl bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-200 hover:bg-red-500/20"
                          >
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAddOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 text-slate-900 shadow-2xl">
            <div className="text-xl font-semibold">
              {type === "sales" ? "Satış Yöneticisi Ekle" : "Ürün Yöneticisi Ekle"}
            </div>

            <div className="mt-6">
              <div className="text-sm font-medium text-slate-700">Ad Soyad</div>
              <input
                autoFocus
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                placeholder="Örn: Ahmet Yılmaz"
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600"
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveAdd()
                }}
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsAddOpen(false)}
                className="rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                İptal
              </button>
              <button
                onClick={saveAdd}
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {edit ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 text-slate-900 shadow-2xl">
            <div className="text-xl font-semibold">Yönetici Düzenle</div>

            <div className="mt-6">
              <div className="text-sm font-medium text-slate-700">Ad Soyad</div>
              <input
                autoFocus
                value={edit.name}
                onChange={(e) => setEdit({ ...edit, name: e.target.value })}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600"
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEdit()
                }}
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setEdit(null)}
                className="rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                İptal
              </button>
              <button
                onClick={saveEdit}
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {targetsOpenId ? (
        <MonthValuesDialog
          title="Hedef Tanımlama"
          values={targets[targetsOpenId] || {}}
          onChange={(month, value) => setMonthValue("targets", type, targetsOpenId, month, value)}
          onClose={() => setTargetsOpenId(null)}
        />
      ) : null}

      {actualsOpenId ? (
        <MonthValuesDialog
          title="Gerçekleşme Tanımlama"
          values={actuals[actualsOpenId] || {}}
          onChange={(month, value) => setMonthValue("actuals", type, actualsOpenId, month, value)}
          onClose={() => setActualsOpenId(null)}
        />
      ) : null}

      {coeffOpenId ? (
        <CoefficientDialog
          value={typeof coefficients[`${coeffOpenId}-${type}`] === "number" ? coefficients[`${coeffOpenId}-${type}`] : 1}
          onSave={(v) => setCoefficient(type, coeffOpenId, v)}
          onClose={() => setCoeffOpenId(null)}
        />
      ) : null}
    </div>
  )
}
