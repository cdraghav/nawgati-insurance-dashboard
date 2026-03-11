"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDownIcon, Loader2Icon, EyeIcon, EyeOffIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { NumberPlate } from "@/components/ui/number-plate"
import { EncryptedText } from "@/components/ui/encrypted-text"
import type { InsuranceRecord } from "@/lib/mock-data"
import { realVehicleData } from "@/lib/real-data"
import { useRevealedStore } from "@/lib/revealed-store"

export function getExpiryStatus(expiry: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiryDate = new Date(expiry)
  const diffDays = Math.ceil(
    (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (diffDays < 0)
    return {
      label: "Expired",
      variant: "destructive" as const,
      status: "expired" as const,
    }
  if (diffDays <= 30)
    return {
      label: `Exp. in ${diffDays}d`,
      variant: "secondary" as const,
      warn: true,
      status: "expiring" as const,
    }
  return { label: "Valid", variant: "outline" as const, status: "valid" as const }
}

// Vehicle number cell — animates once on first reveal; skips animation on re-renders
function VehicleNumberCell({ record }: { record: InsuranceRecord }) {
  const revealed = useRevealedStore((s) => s.revealed[record.id])
  const revealPhone = useRevealedStore((s) => s.revealPhone)
  const realPhone = realVehicleData[record.id]?.phoneNumber

  if (!revealed) return <NumberPlate isCommercial={record.isCommercial}>{record.vehicleNumber}</NumberPlate>

  // phoneNumber being set means vehicle animation already completed — skip re-animating
  if (revealed.phoneNumber !== null) {
    return (
      <NumberPlate isCommercial={record.isCommercial}>
        {revealed.vehicleNumber}
      </NumberPlate>
    )
  }

  return (
    <NumberPlate isCommercial={record.isCommercial}>
      <EncryptedText
        text={revealed.vehicleNumber}
        encryptedClassName="opacity-40"
        revealDelayMs={55}
        onComplete={() => {
          if (realPhone) revealPhone(record.id, realPhone)
        }}
      />
    </NumberPlate>
  )
}

// Phone number cell — animates once on first reveal; skips animation on re-renders
function PhoneNumberCell({ record }: { record: InsuranceRecord }) {
  const revealed = useRevealedStore((s) => s.revealed[record.id])
  const markPhoneAnimDone = useRevealedStore((s) => s.markPhoneAnimDone)

  if (!revealed?.phoneNumber) return <span className="font-mono text-sm">{record.phoneNumber}</span>

  // Animation already played — render instantly
  if (revealed.phoneAnimDone) {
    return <span className="font-mono text-sm font-medium">{revealed.phoneNumber}</span>
  }

  return (
    <EncryptedText
      text={revealed.phoneNumber}
      encryptedClassName="text-muted-foreground/50"
      className="font-mono text-sm font-medium"
      revealDelayMs={40}
      onComplete={() => markPhoneAnimDone(record.id)}
    />
  )
}

// Actions cell — triggers API call, updates store, can re-obfuscate
function ShowDetailsCell({ record }: { record: InsuranceRecord }) {
  const [loading, setLoading] = React.useState(false)
  const revealed = useRevealedStore((s) => s.revealed[record.id])
  const setRevealed = useRevealedStore((s) => s.setRevealed)
  const clearRevealed = useRevealedStore((s) => s.clearRevealed)

  async function handleReveal() {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    const data = realVehicleData[record.id]
    if (data) setRevealed(record.id, { vehicleNumber: data.vehicleNumber, phoneNumber: null, phoneAnimDone: false })
    setLoading(false)
  }

  if (revealed) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => clearRevealed(record.id)}
        className="gap-1.5 text-muted-foreground hover:text-foreground"
      >
        <EyeOffIcon className="size-3.5" />
        Hide
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleReveal}
      disabled={loading}
      className="gap-1.5"
    >
      {loading ? (
        <Loader2Icon className="size-3.5 animate-spin" />
      ) : (
        <EyeIcon className="size-3.5" />
      )}
      {loading ? "Decrypting..." : "Show Details"}
    </Button>
  )
}

export const columns: ColumnDef<InsuranceRecord>[] = [
  {
    accessorKey: "timestamp",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 gap-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Timestamp
        <ArrowUpDownIcon className="size-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-sm tabular-nums text-muted-foreground">
        {row.getValue("timestamp")}
      </span>
    ),
  },
  {
    accessorKey: "vehicleNumber",
    header: "Vehicle Number",
    cell: ({ row }) => <VehicleNumberCell record={row.original} />,
  },
  {
    accessorKey: "area",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 gap-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Area
        <ArrowUpDownIcon className="size-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-sm">{row.getValue("area")}</span>
    ),
  },
  {
    accessorKey: "insuranceExpiry",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 gap-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Insurance Expiry
        <ArrowUpDownIcon className="size-3.5" />
      </Button>
    ),
    cell: ({ row }) => {
      const expiry: string = row.getValue("insuranceExpiry")
      const status = getExpiryStatus(expiry)
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm tabular-nums">{expiry}</span>
          <Badge
            variant={status.variant}
            className={
              status.warn
                ? "border-warning-2 bg-warning-1/20 text-warning-2 dark:text-warning-1 "
                : undefined
            }
          >
            {status.label}
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
    cell: ({ row }) => <PhoneNumberCell record={row.original} />,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <ShowDetailsCell record={row.original} />,
    enableSorting: false,
    enableHiding: false,
  },
]
