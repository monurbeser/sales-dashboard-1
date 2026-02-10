"use client"

import { monthIndexList } from "@/lib/calc"

type Props = {
  title: string
  values: Record<number, number>
  onChange: (month: number, value: number) => void
  onClose: () => void
}

export function MonthValuesDialog({ title, values, onChange, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-3xl rounded-3xl bg-white p-6 text-slate-900 shadow-2xl">
        <div className="text-xl font-semibold">{title}</div>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
          {monthIndexList().map((m) => (
            <div key={m}>
              <div className="text-xs font-medium text-slate-600">
                Ay {m}
              </div>
              <input
                type="number"
                value={values[m] ?? 0}
                onChange={(e) => onChange(m, Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  )
}
