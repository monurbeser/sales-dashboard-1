"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  User,
  BadgeDollarSign,
  Receipt,
} from "lucide-react"

const nav = [
  { href: "/dashboard/overall", label: "Overall Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/personal", label: "Personal Dashboard", icon: User },
  { href: "/managers/sales", label: "Sales Managers", icon: Users },
  { href: "/managers/product", label: "Product Managers", icon: Users },
  { href: "/commission", label: "Commission", icon: BadgeDollarSign },
  { href: "/invoices", label: "Invoices", icon: Receipt },

]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-72 shrink-0 md:block">
      <div className="sticky top-[72px] h-[calc(100vh-72px)] pr-4">
        <div className="h-full rounded-3xl bg-white/5 p-4 shadow-2xl shadow-black/30 backdrop-blur">
          <div className="mb-4 rounded-2xl bg-gradient-to-br from-cyan-400/10 via-blue-500/10 to-indigo-500/10 p-4">
            <div className="text-sm font-semibold text-slate-100">Navigation</div>
            <div className="mt-1 text-xs text-slate-400">
              Quick access to modules
            </div>
          </div>

          <nav className="space-y-1">
            {nav.map((item) => {
              const active =
                pathname === item.href || pathname?.startsWith(item.href + "/")
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "group flex items-center gap-3 rounded-2xl px-3 py-2 text-sm transition",
                    active
                      ? "bg-white/10 text-white"
                      : "text-slate-300 hover:bg-white/5 hover:text-white",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex h-9 w-9 items-center justify-center rounded-xl transition",
                      active
                        ? "bg-gradient-to-br from-cyan-400/30 via-blue-500/30 to-indigo-500/30"
                        : "bg-white/5 group-hover:bg-white/10",
                    ].join(" ")}
                  >
                    <Icon size={18} />
                  </span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs font-semibold text-slate-200">
              Tip
            </div>
            <div className="mt-1 text-xs text-slate-400">
              We will persist data locally with Zustand and add exports later.
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
