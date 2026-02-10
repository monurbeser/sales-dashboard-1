export type ManagerType = "sales" | "product"

export type Manager = {
  id: string
  name: string
}

export type MonthMap = Record<number, number>
export type TargetsActuals = Record<string, MonthMap>

export type Coefficients = Record<string, number>

export type Commission = {
  id: string
  month: number
  managerId: string
  managerName: string
  type: ManagerType
  actual: number
  coefficient: number
  base: number
  multiplier: number
  multiplied: number
  extra: number
  total: number
  date: string
}
