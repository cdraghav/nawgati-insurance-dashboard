"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDownIcon, Loader2Icon, EyeIcon, EyeOffIcon, CarIcon, TruckIcon, BusIcon, Motorbike } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { NumberPlate } from "@/components/ui/number-plate"
import { EncryptedText } from "@/components/ui/encrypted-text"
import { CopyIcon, type CopyIconHandle } from "@/components/ui/copy"
import { cn } from "@/lib/utils"
import type { Visit } from "@/lib/types"
import { useRevealedStore } from "@/lib/revealed-store"
import { useRevealMutation } from "@/hooks/use-reveal"
import { getUserColor, getVehicleTypeColor, getVehicleTypeIconName } from "@/lib/user-colors"

const VEHICLE_ICON_MAP = {
  car: CarIcon,
  truck: TruckIcon,
  bike: Motorbike,
  bus: BusIcon,
  auto: Motorbike
} as const

function CopyableText({
  children,
  copyText,
  className,
}: {
  children: React.ReactNode
  copyText: string
  className?: string
}) {
  const copyRef = React.useRef<CopyIconHandle>(null)
  const [copied, setCopied] = React.useState(false)

  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation()
    navigator.clipboard.writeText(copyText)
    copyRef.current?.startAnimation()
    setCopied(true)
    setTimeout(() => {
      copyRef.current?.stopAnimation()
      setCopied(false)
    }, 1500)
  }

  return (
    <button
      onClick={handleCopy}
      className={cn("group flex cursor-copy items-center gap-1.5", className)}
    >
      {children}
      <CopyIcon
        ref={copyRef}
        size={13}
        className={cn(
          "shrink-0 opacity-0 transition-all group-hover:opacity-100",
          copied ? "text-primary" : "text-muted-foreground/50"
        )}
      />
    </button>
  )
}

export function getExpiryStatus(expiry: string | null) {
  if (!expiry) return { label: "Unknown", variant: "outline" as const, status: "valid" as const }
  const today = new Date()
  today.setHours(0, 0, 0, 0)
const expiryDate = new Date(expiry + 'T00:00:00')
  const diffDays = Math.ceil(
    (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (diffDays <= 0)
    return { label: "Expired", variant: "destructive" as const, status: "expired" as const }
  if (diffDays <= 60)
    return { label: `Exp. in ${diffDays}d`, variant: "secondary" as const, warn: true, status: "expiring" as const }
  return { label: "Valid", variant: "outline" as const, status: "valid" as const }
}

function VehicleNumberCell({ visit }: { visit: Visit }) {
  const revealed = useRevealedStore((s) => s.revealed[visit.id])
  const revealPhone = useRevealedStore((s) => s.revealPhone)

  if (!revealed)
    return <NumberPlate isCommercial={visit.isCommercial}>{visit.vehicleNumber}</NumberPlate>

  if (revealed.phoneNumber !== null) {
    return (
      <CopyableText copyText={revealed.vehicleNumber.replace(/-/g, "")}>
        <NumberPlate isCommercial={visit.isCommercial}>{revealed.vehicleNumber}</NumberPlate>
      </CopyableText>
    )
  }

  return (
    <CopyableText copyText={revealed.vehicleNumber.replace(/-/g, "")}>
      <NumberPlate isCommercial={visit.isCommercial}>
        <EncryptedText
          text={revealed.vehicleNumber}
          encryptedClassName="opacity-40"
          onComplete={() => revealPhone(visit.id, revealed.vehiclePhone)}
        />
      </NumberPlate>
    </CopyableText>
  )
}

function PhoneNumberCell({ visit }: { visit: Visit }) {
  const revealed = useRevealedStore((s) => s.revealed[visit.id])
  const markPhoneAnimDone = useRevealedStore((s) => s.markPhoneAnimDone)

  if (!revealed?.phoneNumber)
    return <span className="font-mono text-sm text-muted-foreground">••••••••••</span>

  const digits = revealed.phoneNumber.replace(/\D/g, "")
  const strippedPhone = digits.startsWith("91") && digits.length === 12 ? digits.slice(2) : digits

  if (revealed.phoneAnimDone) {
    return (
      <CopyableText copyText={strippedPhone}>
        <span className="font-mono text-sm font-medium">{revealed.phoneNumber}</span>
      </CopyableText>
    )
  }

  return (
    <CopyableText copyText={strippedPhone}>
      <EncryptedText
        text={revealed.phoneNumber}
        encryptedClassName="text-muted-foreground/50"
        className="font-mono text-sm font-medium"
        onComplete={() => markPhoneAnimDone(visit.id)}
      />
    </CopyableText>
  )
}

function ShowDetailsCell({ visit }: { visit: Visit }) {
  const [loading, setLoading] = React.useState(false)
  const revealed = useRevealedStore((s) => s.revealed[visit.id])
  const setRevealed = useRevealedStore((s) => s.setRevealed)
  const clearRevealed = useRevealedStore((s) => s.clearRevealed)
  const revealMutation = useRevealMutation()

  async function handleReveal() {
    setLoading(true)
    try {
      const lead = await revealMutation.mutateAsync(visit.id)
      setRevealed(visit.id, {
        vehicleNumber: lead.vehicleNumber,
        vehiclePhone: lead.vehiclePhone,
        phoneNumber: null,
        phoneAnimDone: false,
      })
    } catch (err) {
      toast.error((err as Error).message ?? "Failed to reveal details")
    } finally {
      setLoading(false)
    }
  }

  if (!visit.isClaimable) {
    return (
      <Button variant="ghost" size="sm" disabled className="gap-1.5 text-muted-foreground">
        <EyeOffIcon className="size-3.5" />
        Claimed
      </Button>
    )
  }

  if (revealed) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => clearRevealed(visit.id)}
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

export const columns: ColumnDef<Visit>[] = [
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
    cell: ({ row }) => <VehicleNumberCell visit={row.original} />,
  },
  {
    accessorKey: "vehicleType",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("vehicleType") as string
      if (!type) return <span className="text-xs text-muted-foreground">—</span>
      const color = getVehicleTypeColor(type)
      const iconName = getVehicleTypeIconName(type)
      const Icon = iconName ? VEHICLE_ICON_MAP[iconName] : null
      return (
        <span
          className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
          style={{ background: color.bg, color: color.text }}
        >
          {Icon && <Icon className="size-2.5" />}
          {type}
        </span>
      )
    },
    enableSorting: false,
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
    cell: ({ row }) => {
      const area = row.getValue("area") as string
      return (
        <span className="block max-w-[180px] truncate text-sm" title={area}>
          {area}
        </span>
      )
    },
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
      const expiry: string | null = row.getValue("insuranceExpiry")
      const status = getExpiryStatus(expiry)
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm tabular-nums">{expiry ?? "—"}</span>
          <Badge
            variant={status.variant}
            className={
              status.warn
                ? "border-warning-2 bg-warning-1/20 text-warning-2 dark:text-warning-1"
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
    cell: ({ row }) => <PhoneNumberCell visit={row.original} />,
  },
  {
    id: "assignedTo",
    header: "Claimed By",
    cell: ({ row }) => {
      const a = row.original.assignedTo
      if (!a)
        return <span className="text-xs text-muted-foreground">Nobody</span>
      const fullName = `${a.firstName} ${a.lastName}`
      const initials = `${a.firstName[0]}${a.lastName[0]}`.toUpperCase()
      const color = getUserColor(fullName)
      return (
        <div className="flex items-center gap-1.5">
          <div
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold"
            style={{ background: color.bg, color: color.text }}
          >
            {initials}
          </div>
          <span className="text-xs">{fullName}</span>
        </div>
      )
    },
    enableSorting: false,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <ShowDetailsCell visit={row.original} />,
    enableSorting: false,
    enableHiding: false,
  },
]
