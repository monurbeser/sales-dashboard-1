import { PageShell } from "@/components/app/PageShell"

export default function OverallDashboardPage() {
  return (
    <PageShell title="Overall Dashboard">
      <div className="space-y-4">
        <div className="text-lg font-semibold">Overall Dashboard</div>
        <div className="text-sm text-slate-300">
          Next step: KPI cards, totals, and manager breakdown.
        </div>
      </div>
    </PageShell>
  )
}
