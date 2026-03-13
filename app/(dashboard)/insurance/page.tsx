"use client"

import * as React from "react"
import { ShieldAlertIcon, ShieldOffIcon, TruckIcon, ScanLineIcon } from "lucide-react"
import { StatCard } from "@/components/ui/stat-card"
import { insuranceRecords } from "@/lib/mock-data"
import { columns } from "./columns"
import { DataTable } from "./data-table"

function getAnalytics() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let expired = 0
  let expiringSoon = 0
  let commercial = 0

  const todayStr = today.toISOString().split("T")[0]

  for (const record of insuranceRecords) {
    const expiryDate = new Date(record.insuranceExpiry)
    const diffDays = Math.ceil(
      (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (diffDays < 0) expired++
    else if (diffDays <= 30) expiringSoon++

    if (record.isCommercial) commercial++
  }

  const todayScans = insuranceRecords.filter((r) =>
    r.timestamp.startsWith(todayStr)
  ).length

  return { total: insuranceRecords.length, todayScans, commercial, expired, expiringSoon }
}

export default function InsurancePage() {
  const stats = React.useMemo(() => getAnalytics(), [])

  const CARDS = [
    {
      title: "Scanned Today",
      value: stats.todayScans,
      subheading: `${stats.total} total records`,
      icon: ScanLineIcon,
      changePercent: 0,
      variant: "success" as const,
    },
    {
      title: "Commercial Vehicles",
      value: stats.commercial,
      subheading: `${Math.round((stats.commercial / stats.total) * 100)}% of total`,
      icon: TruckIcon,
      changePercent: Math.round((stats.commercial / stats.total) * 100),
      variant: "default" as const,
    },
    {
      title: "Expiring Soon",
      value: stats.expiringSoon,
      subheading: "Within next 30 days",
      icon: ShieldAlertIcon,
      changePercent: Math.round((stats.expiringSoon / stats.total) * 100),
      variant: "warning" as const,
    },
    {
      title: "Expired",
      value: stats.expired,
      subheading: `${Math.round((stats.expired / stats.total) * 100)}% of scanned`,
      icon: ShieldOffIcon,
      changePercent: -Math.round((stats.expired / stats.total) * 100),
      variant: "danger" as const,
    },
  ]

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex gap-2 overflow-x-auto pb-0.5 lg:hidden">
        {CARDS.map((card) => {
          const Icon = card.icon
          const colorMap = {
            default: "text-primary bg-primary/10",
            success: "text-success-4 bg-success-0",
            warning: "text-warning-3 bg-warning-0",
            danger: "text-error-3 bg-error-0",
          } as const
          return (
            <div
              key={card.title}
              className="flex flex-1 items-center gap-2 rounded-xl border bg-card px-3 py-2"
            >
              <div className={`flex items-center justify-center rounded-md p-1.5 ${colorMap[card.variant]}`}>
                <Icon className="size-3.5" />
              </div>
              <div className="leading-none">
                <p className="text-base font-bold tabular-nums">{card.value}</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">{card.title}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="hidden gap-4 lg:grid lg:grid-cols-4">
        {CARDS.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      <DataTable columns={columns} data={insuranceRecords} />
    </div>
  )
}
