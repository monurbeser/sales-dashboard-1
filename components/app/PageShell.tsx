import type { ReactNode } from "react"
import { Sidebar } from "@/components/app/Sidebar"
import { StoreHydrator } from "@/components/app/StoreHydrator"

type Props = {
  title?: string
  children: ReactNode
}

export function PageShell({ title, children }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 text-slate-100">
      <StoreHydrator />

      <header className="sticky top-0 z-10 border-b border-white/10 bg-gradient-to-r from-blue-950/80 via-slate-900/80 to-cyan-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 shadow-lg shadow-cyan-500/20" />
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide">Sales Dashboard</div>
              <div className="text-xs text-slate-300">Performance and commission management</div>
            </div>
          </div>

          {title ? (
            <div className="rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 backdrop-blur">
              {title}
            </div>
          ) : null}
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-6 py-8">
        <Sidebar />

        <main className="min-w-0 flex-1">
          <div className="relative z-10 rounded-3xl bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
