import { PageShell } from "@/components/app/PageShell"

export default function CommissionPage() {
  return (
    <PageShell title="Commission">
      <div className="space-y-4">
        <div className="text-lg font-semibold">Commission</div>
        <div className="text-sm text-slate-300">
          Next step: create, edit, delete, and export commission records.
        </div>
      </div>
    </PageShell>
  )
}
