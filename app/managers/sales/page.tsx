"use client"

import { PageShell } from "@/components/app/PageShell"
import { ManagersTable } from "@/components/managers/ManagersTable"

export default function SalesManagersPage() {
  return (
    <PageShell title="Sales Managers">
      <ManagersTable type="sales" title="Satış Yöneticileri" />
    </PageShell>
  )
}
