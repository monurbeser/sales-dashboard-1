"use client"

import { PageShell } from "@/components/app/PageShell"
import { useSalesStore } from "@/store/useSalesStore"
import { calculatePercentage, sumMonthMap } from "@/lib/calc"
import { formatCurrency, formatPercent } from "@/lib/format"

function coeffKey(managerId: string, type: "sales" | "product") {
  return managerId + String.fromCharCode(45) + type
}

function cardStyle() {
  return {
    borderRadius: 18,
    background: "rgba(255,255,255,0.06)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
    padding: 18,
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
  } as const
}

function subtleText() {
  return { color: "rgba(226,232,240,0.75)", fontSize: 13 } as const
}

function strongText() {
  return { color: "rgba(255,255,255,0.95)" } as const
}

function percentColor(p: number) {
  if (p >= 90) return "rgba(110,231,183,0.95)"
  if (p >= 60) return "rgba(252,211,77,0.95)"
  return "rgba(252,165,165,0.95)"
}

export default function OverallDashboardPage() {
  const salesManagers = useSalesStore((s) => s.salesManagers)
  const targets = useSalesStore((s) => s.targets.sales)
  const actuals = useSalesStore((s) => s.actuals.sales)
  const coefficients = useSalesStore((s) => s.coefficients)

  const rows = salesManagers.map((m) => {
    const t = targets[m.id]
    const a = actuals[m.id]
    const targetTotal = sumMonthMap(t)
    const actualTotal = sumMonthMap(a)
    const p = calculatePercentage(actualTotal, targetTotal)
    const ck = coeffKey(m.id, "sales")
    const coeff = typeof coefficients[ck] === "number" ? coefficients[ck] : 1
    return { id: m.id, name: m.name, targetTotal, actualTotal, p, coeff }
  })

  const teamTarget = rows.reduce((acc, r) => acc + r.targetTotal, 0)
  const teamActual = rows.reduce((acc, r) => acc + r.actualTotal, 0)
  const teamP = calculatePercentage(teamActual, teamTarget)

  return (
    <PageShell title="Overall Dashboard">
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={cardStyle()}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div>
              <div style={{ ...strongText(), fontSize: 18, fontWeight: 700 }}>Takım Özeti</div>
              <div style={{ marginTop: 6, ...subtleText() }}>
                Bu ekran sadece satış yöneticilerini toplar
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ ...subtleText() }}>Yönetici sayısı</div>
              <div style={{ ...strongText(), fontWeight: 700 }}>{rows.length}</div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 14,
          }}
        >
          <div style={cardStyle()}>
            <div style={subtleText()}>Toplam Hedef</div>
            <div style={{ ...strongText(), fontSize: 22, fontWeight: 800, marginTop: 6 }}>
              {formatCurrency(teamTarget)}
            </div>
          </div>

          <div style={cardStyle()}>
            <div style={subtleText()}>Toplam Gerçekleşme</div>
            <div style={{ ...strongText(), fontSize: 22, fontWeight: 800, marginTop: 6 }}>
              {formatCurrency(teamActual)}
            </div>
          </div>

          <div style={cardStyle()}>
            <div style={subtleText()}>Genel Başarı</div>
            <div style={{ fontSize: 22, fontWeight: 900, marginTop: 6, color: percentColor(teamP) }}>
              {formatPercent(teamP)}
            </div>
          </div>
        </div>

        <div style={cardStyle()}>
          <div style={{ ...strongText(), fontSize: 16, fontWeight: 700 }}>Satış Yöneticileri Kırılımı</div>
          <div style={{ marginTop: 10, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: 10, color: "rgba(226,232,240,0.8)" }}>Ad Soyad</th>
                  <th style={{ textAlign: "left", padding: 10, color: "rgba(226,232,240,0.8)" }}>Hedef</th>
                  <th style={{ textAlign: "left", padding: 10, color: "rgba(226,232,240,0.8)" }}>Gerçekleşme</th>
                  <th style={{ textAlign: "left", padding: 10, color: "rgba(226,232,240,0.8)" }}>Başarı</th>
                  <th style={{ textAlign: "left", padding: 10, color: "rgba(226,232,240,0.8)" }}>Katsayı</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td style={{ padding: 12, color: "rgba(226,232,240,0.7)" }} colSpan={5}>
                      Henüz satış yöneticisi yok
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.id} style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                      <td style={{ padding: 10, color: "rgba(255,255,255,0.92)", fontWeight: 600 }}>{r.name}</td>
                      <td style={{ padding: 10, color: "rgba(226,232,240,0.9)" }}>{formatCurrency(r.targetTotal)}</td>
                      <td style={{ padding: 10, color: "rgba(226,232,240,0.9)" }}>{formatCurrency(r.actualTotal)}</td>
                      <td style={{ padding: 10, fontWeight: 800, color: percentColor(r.p) }}>{formatPercent(r.p)}</td>
                      <td style={{ padding: 10, color: "rgba(226,232,240,0.9)" }}>{r.coeff}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
