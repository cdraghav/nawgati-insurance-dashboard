"use client"

import * as React from "react"
import { ShieldAlertIcon, ShieldOffIcon, TruckIcon, ScanLineIcon } from "lucide-react"
import { StatCard } from "@/components/ui/stat-card"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { useVisits } from "@/hooks/use-visits"
import { useAgents } from "@/hooks/use-agents"
import { InsurancePageSkeleton } from "./skeleton"
import type { Visit } from "@/lib/types"

function getAnalytics(visits: Visit[]) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString().split("T")[0]

  let expired = 0
  let expiringSoon = 0
  let commercial = 0

  for (const visit of visits) {
    if (visit.insuranceExpiry) {
      const expiryDate = new Date(visit.insuranceExpiry)
      const diffDays = Math.ceil(
        (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      )
      if (diffDays < 0) expired++
      else if (diffDays <= 30) expiringSoon++
    }
    if (visit.isCommercial) commercial++
  }

  const todayScans = visits.filter((v) => v.timestamp.startsWith(todayStr)).length

  return { todayScans, commercial, expired, expiringSoon }
}

export default function InsurancePage() {
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(25)
  const [assignedToId, setAssignedToId] = React.useState("all")
  const [timeRange, setTimeRange] = React.useState<"all" | "today" | "week">("all")
  const [regType, setRegType] = React.useState<"all" | "commercial" | "private">("all")
  const [vehicleType, setVehicleType] = React.useState("")
  const [expiryFrom, setExpiryFrom] = React.useState("")
  const [expiryTo, setExpiryTo] = React.useState("")

  const serverAssignedToId =
    assignedToId !== "all" && assignedToId !== "nobody"
      ? Number(assignedToId)
      : undefined

  const serverTimeRange =
    timeRange === "today" ? "today" : timeRange === "week" ? "thisWeek" : undefined

  const { data, isLoading, refetch, isFetching } = useVisits({
    page,
    limit: pageSize,
    assignedToId: serverAssignedToId,
    timeRange: serverTimeRange,
    regType: regType !== "all" ? regType : undefined,
    vehicleType: vehicleType || undefined,
    insuranceExpiryFrom: expiryFrom || undefined,
    insuranceExpiryTo: expiryTo || undefined,
  })
  const { data: agents = [] } = useAgents()
  const visits = data?.visits ?? []
  const hasNextPage = visits.length >= pageSize
  const stats = React.useMemo(() => getAnalytics(visits), [visits])

  if (isLoading) return <InsurancePageSkeleton />

  const CARDS = [
    {
      title: "Scanned Today",
      value: stats.todayScans,
      subheading: `${visits.length} on this page`,
      icon: ScanLineIcon,
      changePercent: 0,
      variant: "success" as const,
    },
    {
      title: "Commercial Vehicles",
      value: stats.commercial,
      subheading: `${visits.length ? Math.round((stats.commercial / visits.length) * 100) : 0}% of page`,
      icon: TruckIcon,
      changePercent: visits.length ? Math.round((stats.commercial / visits.length) * 100) : 0,
      variant: "default" as const,
    },
    {
      title: "Expiring Soon",
      value: stats.expiringSoon,
      subheading: "Within next 30 days",
      icon: ShieldAlertIcon,
      changePercent: visits.length ? Math.round((stats.expiringSoon / visits.length) * 100) : 0,
      variant: "warning" as const,
    },
    {
      title: "Expired",
      value: stats.expired,
      subheading: `${visits.length ? Math.round((stats.expired / visits.length) * 100) : 0}% of page`,
      icon: ShieldOffIcon,
      changePercent: visits.length ? -Math.round((stats.expired / visits.length) * 100) : 0,
      variant: "danger" as const,
    },
  ]

  const colorMap = {
    default: "text-primary bg-primary/10",
    success: "text-success-4 bg-success-0",
    warning: "text-warning-3 bg-warning-0",
    danger: "text-error-3 bg-error-0",
  } as const

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex gap-2 overflow-x-auto pb-0.5 md:hidden">
        {CARDS.map((card) => {
          const Icon = card.icon
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

      <div className="hidden gap-4 md:grid md:grid-cols-4">
        {CARDS.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      <DataTable
        columns={columns}
        data={visits}
        agents={agents}
        hasNextPage={hasNextPage}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(size) => { setPageSize(size); setPage(1) }}
        assignedToId={assignedToId}
        onAssignedToChange={(v) => { setAssignedToId(v); setPage(1) }}
        timeRange={timeRange}
        onTimeRangeChange={(v) => { setTimeRange(v); setPage(1) }}
        regType={regType}
        onRegTypeChange={(v) => { setRegType(v); setPage(1) }}
        vehicleType={vehicleType}
        onVehicleTypeChange={(v) => { setVehicleType(v); setPage(1) }}
        expiryFrom={expiryFrom}
        onExpiryFromChange={(v) => { setExpiryFrom(v); setPage(1) }}
        expiryTo={expiryTo}
        onExpiryToChange={(v) => { setExpiryTo(v); setPage(1) }}
        onRefresh={refetch}
        isRefetching={isFetching}
      />
    </div>
  )
}
