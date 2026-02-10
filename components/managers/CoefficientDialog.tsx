"use client"

import { useState } from "react"

type Props = {
  value: number
  onSave: (v: number) => void
  onClose: () => void
}

export function CoefficientDialog({ value, onSave, onClose }: Props) {
  const [v, setV] = useState<number>(value)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 text-slate-900 shadow-2xl">
        <div className="text-xl font-semibold">Prim Katsayısı</div>

        <div className="mt-6">
          <div className="text-sm font-medium text-slate-700">Katsayı</div>
          <input
            type="number"
            step="0.0001"
            value={Number.isFinite(v) ? v : 0}
            onChange={(e) => setV(Number(e.target.value))}
            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600"
          />
          <div className="mt-2 text-xs text-slate-500">
            Örnek: 1, 1.2, 0.85
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            İptal
          </button>
          <button
            onClick={() => {
              onSave(Number.isFinite(v) ? v : 0)
              onClose()
            }}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  )
}
