import { PageShell } from "@/components/app/PageShell"

export default function Home() {
  return (
    <PageShell title="Home">
      <div className="space-y-8">
        <div className="rounded-2xl bg-gradient-to-br from-blue-900/40 via-slate-900/40 to-cyan-900/40 p-6 shadow-lg">
          <div className="text-xl font-semibold">
            Sales Dashboard is ready
          </div>
          <p className="mt-2 max-w-xl text-sm text-slate-300">
            Modular sales performance and commission system built with Next.js.
            Sidebar navigation and analytics dashboards will follow.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white/5 p-5 shadow-lg transition hover:bg-white/10">
            <div className="text-sm font-semibold text-cyan-300">
              Managers
            </div>
            <div className="mt-1 text-xs text-slate-400">
              Sales and product managers
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 p-5 shadow-lg transition hover:bg-white/10">
            <div className="text-sm font-semibold text-blue-300">
              Dashboards
            </div>
            <div className="mt-1 text-xs text-slate-400">
              Overall and personal performance
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 p-5 shadow-lg transition hover:bg-white/10">
            <div className="text-sm font-semibold text-indigo-300">
              Commission
            </div>
            <div className="mt-1 text-xs text-slate-400">
              Calculation and export
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
