import { PageShell } from "@/components/app/PageShell"

export default function ProductManagersPage() {
  return (
    <PageShell title="Product Managers">
      <div className="space-y-4">
        <div className="text-lg font-semibold">Product Managers</div>
        <div className="text-sm text-slate-300">
          Next step: CRUD, targets and actuals modals, coefficient settings.
        </div>
      </div>
    </PageShell>
  )
}
