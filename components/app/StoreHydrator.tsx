"use client"

import { useEffect } from "react"
import { useSalesStore } from "@/store/useSalesStore"

export function StoreHydrator() {
  const initSeed = useSalesStore((s) => s.initSeed)
  useEffect(() => {
    initSeed()
  }, [initSeed])

  return null
}
