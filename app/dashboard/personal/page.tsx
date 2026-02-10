import { PageShell } from "@/components/app/PageShell"

export default function PersonalDashboardPage() {
  return (
    <PageShell title="Personal Dashboard">
      <div className="space-y-4">
        <div className="text-lg font-semibold">Personal Dashboard</div>
        <div className="text-sm text-slate-300">
          Next step: manager selector, quarterly performance, gauge, and monthly chart.
        </div>
      </div>
    </PageShell>
  )
}
