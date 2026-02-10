"use client"

import { useMemo, useState } from "react"
import { useSalesStore } from "@/store/useSalesStore"

type EditState = { id: string; name: string } | null

export function SalesManagersTable() {
  const salesManagers = useSalesStore((s) => s.salesManagers)
  const addManager = useSalesStore((s) => s.addManager)
  const updateManager = useSalesStore((s) => s.updateManager)
  const deleteManager = useSalesStore((s) => s.deleteManager)

  const [newName, setNewName] = useState("")
  const [edit, setEdit] = useState<EditState>(null)

  const rows = useMemo(() => salesManagers, [salesManagers])

  function onAdd() {
    const name = newName.trim()
    if (!name) return
    addManager("sales", name)
    setNewName("")
  }

  function onOpenEdit(id: string, name: string) {
    setEdit({ id, name })
  }

  function onSaveEdit() {
    if (!edit) return
    const name = edit.name.trim()
    if (!name) return
    updateManager("sales", edit.id, name)
    setEdit(null)
  }

  function onDelete(id: string, name: string) {
    const ok = window.confirm(`Delete "${name}" ? This will remove related targets actuals and commissions.`)
    if (!ok) return
    deleteManager("sales", id)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white/5 p-5 shadow-lg">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-lg font-semibold">Sales Managers</div>
            <div className="mt-1 text-sm text-slate-300">
              Total: <span className="font-semibold text-cyan-300">{rows.length}</span>
            </div>
          </div>

          <div className="flex w-full gap-2 md:w-auto">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Add a manager name"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-400/50"
            />
            <button
              onClick={onAdd}
              className="rounded-xl bg-gradient-to-br from-cyan-400/30 via-blue-500/30 to-indigo-500/30 px-4 py-2 text-sm font-semibold text-slate-100 hover:from-cyan-400/40 hover:via-blue-500/40 hover:to-indigo-500/40"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl shadow-black/30">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Id</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-slate-400" colSpan={3}>
                    No sales managers yet. Add one above.
                  </td>
                </tr>
              ) : (
                rows.map((m) => (
                  <tr key={m.id} className="border-t border-white/10">
                    <td className="px-4 py-3 font-medium text-slate-100">{m.name}</td>
                    <td className="px-4 py-3 text-slate-400">{m.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => onOpenEdit(m.id, m.name)}
                          className="rounded-xl bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(m.id, m.name)}
                          className="rounded-xl bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-200 hover:bg-red-500/20"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {edit ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-2xl backdrop-blur">
            <div className="text-base font-semibold">Edit manager</div>
            <div className="mt-3">
              <input
                value={edit.name}
                onChange={(e) => setEdit({ ...edit, name: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400/50"
              />
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setEdit(null)}
                className="rounded-xl bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={onSaveEdit}
                className="rounded-xl bg-gradient-to-br from-cyan-400/30 via-blue-500/30 to-indigo-500/30 px-4 py-2 text-sm font-semibold text-slate-100 hover:from-cyan-400/40 hover:via-blue-500/40 hover:to-indigo-500/40"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
