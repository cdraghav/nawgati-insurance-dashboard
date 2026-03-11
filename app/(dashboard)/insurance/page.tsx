"use client"

import * as React from "react"
import { ShieldCheckIcon, ShieldAlertIcon, ShieldOffIcon, ScanLineIcon } from "lucide-react"
import { StatCard } from "@/components/ui/stat-card"
import { insuranceRecords } from "@/lib/mock-data"
import { columns } from "./columns"
import { DataTable } from "./data-table"

function getAnalytics() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let expired = 0
  let expiringSoon = 0
  let valid = 0

  const todayStr = today.toISOString().split("T")[0]

  for (const record of insuranceRecords) {
    const expiryDate = new Date(record.insuranceExpiry)
    const diffDays = Math.ceil(
      (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (diffDays < 0) expired++
    else if (diffDays <= 30) expiringSoon++
    else valid++
  }

  const todayScans = insuranceRecords.filter((r) =>
    r.timestamp.startsWith(todayStr)
  ).length

  return { total: insuranceRecords.length, todayScans, expired, expiringSoon, valid }
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
      variant: "default" as const,
    },
    {
      title: "Valid Insurance",
      value: stats.valid,
      subheading: `${Math.round((stats.valid / stats.total) * 100)}% of scanned`,
      icon: ShieldCheckIcon,
      changePercent: Math.round((stats.valid / stats.total) * 100),
      variant: "success" as const,
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
    <div className="flex flex-col gap-6">
      {/* Analytics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {/* Table */}
      <DataTable columns={columns} data={insuranceRecords} />
    </div>
  )
}
