"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type {
  Coefficients,
  Commission,
  Manager,
  ManagerType,
  TargetsActuals,
  MonthMap,
} from "@/store/schema"
import { monthIndexList } from "@/lib/calc"

type State = {
  hasSeeded: boolean

  salesManagers: Manager[]
  productManagers: Manager[]

  targets: {
    sales: TargetsActuals
    product: TargetsActuals
  }

  actuals: {
    sales: TargetsActuals
    product: TargetsActuals
  }

  coefficients: Coefficients
  commissions: Commission[]

  initSeed: () => void

  addManager: (type: ManagerType, name: string) => void
  updateManager: (type: ManagerType, id: string, name: string) => void
  deleteManager: (type: ManagerType, id: string) => void

  setMonthValue: (kind: "targets" | "actuals", type: ManagerType, managerId: string, month: number, value: number) => void
  setYearValues: (kind: "targets" | "actuals", type: ManagerType, managerId: string, values: MonthMap) => void

  setCoefficient: (type: ManagerType, managerId: string, value: number) => void

  upsertCommission: (c: Commission) => void
  deleteCommission: (id: string) => void
}

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`
}

function ensureYearMap(existing: MonthMap | undefined) {
  const next: MonthMap = { ...(existing || {}) }
  for (const m of monthIndexList()) {
    if (typeof next[m] !== "number") next[m] = 0
  }
  return next
}

export const useSalesStore = create<State>()(
  persist(
    (set, get) => ({
      hasSeeded: false,

      salesManagers: [],
      productManagers: [],

      targets: { sales: {}, product: {} },
      actuals: { sales: {}, product: {} },

      coefficients: {},
      commissions: [],

      initSeed: () => {
        const s = get()
        if (s.hasSeeded) return

        set((prev) => {
          if (prev.salesManagers.length || prev.productManagers.length) {
            return { hasSeeded: true }
          }

          const salesManagers: Manager[] = [
            { id: "s1", name: "Sales Manager 1" },
            { id: "s2", name: "Sales Manager 2" },
          ]

          const productManagers: Manager[] = [
            { id: "p1", name: "Product Manager 1" },
          ]

          const targetsSales: TargetsActuals = {}
          const actualsSales: TargetsActuals = {}
          for (const m of salesManagers) {
            targetsSales[m.id] = ensureYearMap()
            actualsSales[m.id] = ensureYearMap()
          }

          const targetsProduct: TargetsActuals = {}
          const actualsProduct: TargetsActuals = {}
          for (const m of productManagers) {
            targetsProduct[m.id] = ensureYearMap()
            actualsProduct[m.id] = ensureYearMap()
          }

          const coefficients: Coefficients = {
            "s1-sales": 1,
            "s2-sales": 1,
            "p1-product": 1,
          }

          return {
            hasSeeded: true,
            salesManagers,
            productManagers,
            targets: { sales: targetsSales, product: targetsProduct },
            actuals: { sales: actualsSales, product: actualsProduct },
            coefficients,
          }
        })
      },

      addManager: (type, name) => {
        const id = uid(type === "sales" ? "s" : "p")
        set((prev) => {
          const mgr: Manager = { id, name: name.trim() || "Unnamed" }

          const isSales = type === "sales"
          const listKey = isSales ? "salesManagers" : "productManagers"

          const targets = { ...prev.targets }
          const actuals = { ...prev.actuals }

          if (isSales) {
            targets.sales = { ...targets.sales, [id]: ensureYearMap() }
            actuals.sales = { ...actuals.sales, [id]: ensureYearMap() }
          } else {
            targets.product = { ...targets.product, [id]: ensureYearMap() }
            actuals.product = { ...actuals.product, [id]: ensureYearMap() }
          }

          return {
            ...prev,
            [listKey]: [...prev[listKey], mgr],
            targets,
            actuals,
            coefficients: { ...prev.coefficients, [`${id}-${type}`]: 1 },
          } as State
        })
      },

      updateManager: (type, id, name) => {
        set((prev) => {
          const isSales = type === "sales"
          const listKey = isSales ? "salesManagers" : "productManagers"
          const nextList = prev[listKey].map((m) => (m.id === id ? { ...m, name: name.trim() || m.name } : m))
          const nextCommissions = prev.commissions.map((c) =>
            c.managerId === id ? { ...c, managerName: name.trim() || c.managerName } : c
          )
          return { ...prev, [listKey]: nextList, commissions: nextCommissions } as State
        })
      },

      deleteManager: (type, id) => {
        set((prev) => {
          const isSales = type === "sales"
          const listKey = isSales ? "salesManagers" : "productManagers"
          const nextList = prev[listKey].filter((m) => m.id !== id)

          const targets = { ...prev.targets }
          const actuals = { ...prev.actuals }

          if (isSales) {
            const { [id]: _, ...rest } = targets.sales
            targets.sales = rest
            const { [id]: __, ...restA } = actuals.sales
            actuals.sales = restA
          } else {
            const { [id]: _, ...rest } = targets.product
            targets.product = rest
            const { [id]: __, ...restA } = actuals.product
            actuals.product = restA
          }

          const coeffKey = `${id}-${type}`
          const { [coeffKey]: ___, ...restCoeff } = prev.coefficients

          const nextCommissions = prev.commissions.filter((c) => c.managerId !== id)

          return {
            ...prev,
            [listKey]: nextList,
            targets,
            actuals,
            coefficients: restCoeff,
            commissions: nextCommissions,
          } as State
        })
      },

      setMonthValue: (kind, type, managerId, month, value) => {
        set((prev) => {
          const group = kind === "targets" ? { ...prev.targets } : { ...prev.actuals }
          const isSales = type === "sales"
          const bucket = isSales ? { ...(group.sales || {}) } : { ...(group.product || {}) }
          const existing = ensureYearMap(bucket[managerId])
          bucket[managerId] = { ...existing, [month]: value }

          if (isSales) group.sales = bucket
          else group.product = bucket

          return kind === "targets"
            ? ({ ...prev, targets: group } as State)
            : ({ ...prev, actuals: group } as State)
        })
      },

      setYearValues: (kind, type, managerId, values) => {
        set((prev) => {
          const fixed = ensureYearMap(values)
          const group = kind === "targets" ? { ...prev.targets } : { ...prev.actuals }
          const isSales = type === "sales"
          const bucket = isSales ? { ...(group.sales || {}) } : { ...(group.product || {}) }
          bucket[managerId] = fixed

          if (isSales) group.sales = bucket
          else group.product = bucket

          return kind === "targets"
            ? ({ ...prev, targets: group } as State)
            : ({ ...prev, actuals: group } as State)
        })
      },

      setCoefficient: (type, managerId, value) => {
        set((prev) => ({
          ...prev,
          coefficients: { ...prev.coefficients, [`${managerId}-${type}`]: value },
        }))
      },

      upsertCommission: (c) => {
        set((prev) => {
          const exists = prev.commissions.some((x) => x.id === c.id)
          const next = exists
            ? prev.commissions.map((x) => (x.id === c.id ? c : x))
            : [c, ...prev.commissions]
          return { ...prev, commissions: next }
        })
      },

      deleteCommission: (id) => {
        set((prev) => ({
          ...prev,
          commissions: prev.commissions.filter((c) => c.id !== id),
        }))
      },
    }),
    {
      name: "salesDashboardStoreV1",
      version: 1,
    }
  )
)
