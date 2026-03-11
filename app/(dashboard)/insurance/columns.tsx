"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDownIcon, Loader2Icon, EyeIcon, EyeOffIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { NumberPlate } from "@/components/ui/number-plate"
import { EncryptedText } from "@/components/ui/encrypted-text"
import { toast } from "sonner"
import type { InsuranceRecord } from "@/lib/mock-data"
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

// Vehicle number cell — obfuscated or decrypting in-place
function VehicleNumberCell({ record }: { record: InsuranceRecord }) {
  const revealed = useRevealedStore((s) => s.revealed[record.id])

  return (
    <NumberPlate isCommercial={record.isCommercial}>
      {revealed ? (
        <EncryptedText
          text={revealed.vehicleNumber}
          encryptedClassName="opacity-40"
          revealDelayMs={55}
        />
      ) : (
        record.vehicleNumber
      )}
    </NumberPlate>
  )
}

// Phone number cell — obfuscated or decrypting in-place
function PhoneNumberCell({ record }: { record: InsuranceRecord }) {
  const revealed = useRevealedStore((s) => s.revealed[record.id])

  if (revealed) {
    return (
      <EncryptedText
        text={revealed.phoneNumber}
        encryptedClassName="text-muted-foreground/50"
        className="font-mono text-sm font-medium"
        revealDelayMs={40}
      />
    )
  }

  return <span className="font-mono text-sm">{record.phoneNumber}</span>
}

// Actions cell — triggers API call, updates store, can re-obfuscate
function ShowDetailsCell({ record }: { record: InsuranceRecord }) {
  const [loading, setLoading] = React.useState(false)
  const revealed = useRevealedStore((s) => s.revealed[record.id])
  const setRevealed = useRevealedStore((s) => s.setRevealed)
  const clearRevealed = useRevealedStore((s) => s.clearRevealed)

  async function handleReveal() {
    setLoading(true)
    try {
      const res = await fetch(`/api/vehicle-details?id=${record.id}`)
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setRevealed(record.id, data)
    } catch {
      toast.error("Failed to load details")
    } finally {
      setLoading(false)
    }
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
