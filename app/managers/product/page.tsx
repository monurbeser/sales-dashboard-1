"use client"

import { PageShell } from "@/components/app/PageShell"
import { ManagersTable } from "@/components/managers/ManagersTable"

export default function ProductManagersPage() {
  return (
    <PageShell title="Product Managers">
      <ManagersTable type="product" title="Ürün Yöneticileri" />
    </PageShell>
  )
}
