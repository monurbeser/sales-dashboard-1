"use client"

import { PageShell } from "@/components/app/PageShell"
import { SalesManagersTable } from "@/components/managers/SalesManagersTable"

export default function SalesManagersPage() {
  return (
    <PageShell title="Sales Managers">
      <SalesManagersTable />
    </PageShell>
  )
}
