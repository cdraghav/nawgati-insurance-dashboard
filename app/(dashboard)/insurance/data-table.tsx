"use client"

import * as React from "react"
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  CarIcon,
  TruckIcon,
  BikeIcon,
  BusIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Loader2Icon,
  RefreshCwIcon,
  SearchIcon,
  TimerIcon,
  XIcon,
  type LucideIcon,
} from "lucide-react"
import type { Agent, Visit } from "@/lib/types"
import { useRevealedStore } from "@/lib/revealed-store"
import { usePreferencesStore } from "@/lib/preferences-store"
import { cn } from "@/lib/utils"
import { getUserColor, getVehicleTypeColor, getVehicleTypeIconName } from "@/lib/user-colors"

type TimeRange = "all" | "today" | "week"
type RegType = "all" | "commercial" | "private"

type ColFilters = {
  areas: string[]
}

const DEFAULT_COL_FILTERS: ColFilters = { areas: [] }

const TIME_CHIPS: { id: TimeRange; label: string }[] = [
  { id: "all", label: "All Time" },
  { id: "today", label: "Today" },
  { id: "week", label: "This Week" },
]

const VEHICLE_ICON_MAP: Record<"car" | "truck" | "bike" | "bus", LucideIcon> = {
  car: CarIcon,
  truck: TruckIcon,
  bike: BikeIcon,
  bus: BusIcon,
}

function getVehicleIcon(type: string): LucideIcon | null {
  const name = getVehicleTypeIconName(type)
  return name ? VEHICLE_ICON_MAP[name] : null
}

// Pages shown: 1..current (with ellipsis when current > 5)
function getPageNumbers(current: number): (number | "ellipsis")[] {
  if (current <= 5) return Array.from({ length: current }, (_, i) => i + 1)
  return [1, "ellipsis", current - 2, current - 1, current]
}

// ─── FilterTrigger ────────────────────────────────────────────────────────────

const FilterTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button> & {
    open: boolean
    active: boolean
    loading?: boolean
    count?: number
  }
>(({ open, active, loading, count, ...props }, ref) => (
  <Button
    ref={ref}
    variant="outline"
    size="sm"
    className={cn(
      "relative ml-1 h-6 w-6 p-0 shrink-0",
      active && "border-primary text-primary bg-primary/5"
    )}
    {...props}
  >
    {loading ? (
      <Loader2Icon className="size-3 animate-spin" />
    ) : open ? (
      <ChevronUpIcon className="size-3" />
    ) : (
      <ChevronDownIcon className="size-3" />
    )}
    {!!count && (
      <span className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground">
        {count > 9 ? "9+" : count}
      </span>
    )}
  </Button>
))
FilterTrigger.displayName = "FilterTrigger"

// ─── IntervalPicker ───────────────────────────────────────────────────────────

const INTERVAL_OPTIONS = [
  { label: "30s", value: 30_000 },
  { label: "1 min", value: 60_000 },
  { label: "2 min", value: 120_000 },
  { label: "3 min", value: 180_000 },
  { label: "5 min", value: 300_000 },
  { label: "10 min", value: 600_000 },
  { label: "Off", value: 0 },
]

function IntervalPicker() {
  const refreshInterval = usePreferencesStore((s) => s.refreshInterval)
  const setRefreshInterval = usePreferencesStore((s) => s.setRefreshInterval)
  const [open, setOpen] = React.useState(false)
  const [customMinutes, setCustomMinutes] = React.useState("")
  const currentLabel = INTERVAL_OPTIONS.find((o) => o.value === refreshInterval)?.label ?? "Custom"

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
          <TimerIcon className="size-3.5" />
          {currentLabel}
          {open ? <ChevronUpIcon className="size-3" /> : <ChevronDownIcon className="size-3" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-44 p-2" align="end">
        <p className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Auto-refresh
        </p>
        <div className="flex flex-col gap-0.5">
          {INTERVAL_OPTIONS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => { setRefreshInterval(value); setOpen(false) }}
              className={cn(
                "flex items-center rounded px-2 py-1.5 text-xs transition-colors",
                refreshInterval === value ? "bg-primary text-primary-foreground" : "hover:bg-accent text-foreground"
              )}
            >
              {label}
            </button>
          ))}
          <div className="my-1 border-t" />
          <div className="flex gap-1 px-1">
            <Input
              type="number"
              min={1}
              placeholder="min"
              value={customMinutes}
              onChange={(e) => setCustomMinutes(e.target.value)}
              className="h-7 text-xs"
            />
            <Button
              size="sm"
              variant="outline"
              className="h-7 shrink-0 px-2 text-xs"
              onClick={() => { setRefreshInterval(Math.max(1, Number(customMinutes)) * 60_000); setOpen(false) }}
              disabled={!customMinutes}
            >
              Set
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// ─── Column filters ───────────────────────────────────────────────────────────

function DateRangeFilter({ label, from, to, onFromChange, onToChange, active, loading }: {
  label: string; from: string; to: string
  onFromChange: (v: string) => void; onToChange: (v: string) => void
  active: boolean; loading?: boolean
}) {
  const [open, setOpen] = React.useState(false)
  const count = (from ? 1 : 0) + (to ? 1 : 0)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FilterTrigger open={open} active={active} loading={loading} count={count || undefined} />
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3" align="start">
        <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">From</label>
            <Input type="date" value={from} onChange={(e) => onFromChange(e.target.value)} className="h-7 text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">To</label>
            <Input type="date" value={to} onChange={(e) => onToChange(e.target.value)} className="h-7 text-xs" />
          </div>
          {(from || to) && (
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => { onFromChange(""); onToChange("") }}>
              Clear
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function RegTypeFilter({ value, onChange, active, loading }: {
  value: RegType; onChange: (v: RegType) => void; active: boolean; loading?: boolean
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FilterTrigger open={open} active={active} loading={loading} count={active ? 1 : undefined} />
      </PopoverTrigger>
      <PopoverContent className="w-44 p-3" align="start">
        <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Reg Type</p>
        <div className="flex flex-col gap-0.5">
          {([{ id: "all", label: "All Types" }, { id: "commercial", label: "Commercial" }, { id: "private", label: "Private" }] as const).map(({ id, label }) => (
            <button key={id} onClick={() => { onChange(id); setOpen(false) }}
              className={cn("flex items-center rounded px-2 py-1.5 text-xs transition-colors", value === id ? "bg-primary text-primary-foreground" : "hover:bg-accent text-foreground")}>
              {label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function VehicleTypeFilter({ value, onChange, options, active, loading }: {
  value: string; onChange: (v: string) => void; options: string[]; active: boolean; loading?: boolean
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FilterTrigger open={open} active={active} loading={loading} count={active ? 1 : undefined} />
      </PopoverTrigger>
      <PopoverContent className="w-44 p-3" align="start">
        <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Vehicle Type</p>
        <div className="flex flex-col gap-0.5">
          <button onClick={() => { onChange(""); setOpen(false) }}
            className={cn("flex items-center rounded px-2 py-1.5 text-xs transition-colors", !value ? "bg-primary text-primary-foreground" : "hover:bg-accent text-foreground")}>
            All Types
          </button>
          {options.map((type) => {
            const color = getVehicleTypeColor(type)
            const Icon = getVehicleIcon(type)
            const isSelected = value === type
            return (
              <button key={type} onClick={() => { onChange(type); setOpen(false) }}
                className={cn("flex items-center gap-2 rounded px-2 py-1.5 text-xs transition-colors", isSelected ? "bg-primary text-primary-foreground" : "hover:bg-accent text-foreground")}>
                <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                  style={isSelected ? { background: "rgba(255,255,255,0.2)", color: "inherit" } : { background: color.bg, color: color.text }}>
                  {Icon && <Icon className="size-2.5" />}
                  {type}
                </span>
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function AreaFilter({ options, selected, onChange, active }: {
  options: string[]; selected: string[]; onChange: (v: string[]) => void; active: boolean
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FilterTrigger open={open} active={active} count={selected.length || undefined} />
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search areas..." className="text-xs" />
          <CommandList className="max-h-52">
            <CommandEmpty className="py-4 text-xs">No areas found.</CommandEmpty>
            <CommandGroup>
              {options.map((area) => (
                <CommandItem key={area} value={area}
                  data-checked={selected.includes(area) ? "true" : "false"}
                  onSelect={() => onChange(selected.includes(area) ? selected.filter((a) => a !== area) : [...selected, area])}
                  className="gap-2 text-xs">
                  <Checkbox checked={selected.includes(area)} className="size-3.5" />
                  <span className="truncate" title={area}>{area}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          {selected.length > 0 && (
            <div className="border-t p-1">
              <Button variant="ghost" size="sm" className="h-7 w-full text-xs" onClick={() => onChange([])}>
                Clear ({selected.length})
              </Button>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function AssignedToFilter({ value, onChange, agents, active, loading }: {
  value: string; onChange: (v: string) => void; agents: Agent[]; active: boolean; loading?: boolean
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FilterTrigger open={open} active={active} loading={loading} count={active ? 1 : undefined} />
      </PopoverTrigger>
      <PopoverContent className="w-52 p-3" align="start">
        <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Claimed by</p>
        <div className="flex flex-col gap-0.5">
          {([ { id: "nobody", label: "Nobody" }] as const).map(({ id, label }) => (
            <button key={id} onClick={() => { onChange(id); setOpen(false) }}
              className={cn("flex items-center rounded px-2 py-1.5 text-xs transition-colors", value === id ? "bg-primary text-primary-foreground" : "hover:bg-accent text-foreground")}>
              {label}
            </button>
          ))}
          {agents.length > 0 && (
            <>
              <div className="my-1 border-t" />
              {agents.map((agent) => {
                const fullName = `${agent.firstName} ${agent.lastName}`
                const color = getUserColor(fullName)
                const isSelected = value === String(agent.id)
                return (
                  <button key={agent.id} onClick={() => { onChange(String(agent.id)); setOpen(false) }}
                    className={cn("flex items-center gap-2 rounded px-2 py-1.5 text-xs transition-colors", isSelected ? "bg-primary text-primary-foreground" : "hover:bg-accent text-foreground")}>
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold"
                      style={isSelected ? { background: "rgba(255,255,255,0.2)", color: "inherit" } : { background: color.bg, color: color.text }}>
                      {`${agent.firstName[0]}${agent.lastName[0]}`.toUpperCase()}
                    </div>
                    {fullName}
                  </button>
                )
              })}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

// ─── DataTable ────────────────────────────────────────────────────────────────

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: Visit[]
  agents?: Agent[]
  hasNextPage: boolean
  page: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  assignedToId: string
  onAssignedToChange: (v: string) => void
  timeRange: TimeRange
  onTimeRangeChange: (v: TimeRange) => void
  regType: RegType
  onRegTypeChange: (v: RegType) => void
  vehicleType: string
  onVehicleTypeChange: (v: string) => void
  expiryFrom: string
  onExpiryFromChange: (v: string) => void
  expiryTo: string
  onExpiryToChange: (v: string) => void
  isLoading?: boolean
  onRefresh?: () => void
  isRefetching?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  agents = [],
  hasNextPage,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  assignedToId,
  onAssignedToChange,
  timeRange,
  onTimeRangeChange,
  regType,
  onRegTypeChange,
  vehicleType,
  onVehicleTypeChange,
  expiryFrom,
  onExpiryFromChange,
  expiryTo,
  onExpiryToChange,
  isLoading = false,
  onRefresh,
  isRefetching = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "timestamp", desc: true }])
  const [search, setSearch] = React.useState("")
  const [colFilters, setColFilters] = React.useState<ColFilters>(DEFAULT_COL_FILTERS)

  // Freeze vehicle type options so they don't vanish when a type is selected
  const [vehicleTypeOptions, setVehicleTypeOptions] = React.useState<string[]>([])
  React.useEffect(() => {
    if (!vehicleType) {
      const types = Array.from(new Set(data.map((r) => r.vehicleType).filter(Boolean))).sort()
      if (types.length > 0) setVehicleTypeOptions(types)
    }
  }, [data, vehicleType])

  const revealed = useRevealedStore((s) => s.revealed)
  const deferredSearch = React.useDeferredValue(search)

  const areaOptions = React.useMemo(
    () => Array.from(new Set(data.map((r) => r.area).filter(Boolean))).sort(),
    [data]
  )

  const filteredData = React.useMemo(() => {
    return data.filter((record) => {
      if (deferredSearch) {
        const terms = deferredSearch.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean)
        if (terms.length > 0) {
          const real = revealed[record.id]
          const plateRaw = (real?.vehicleNumber ?? record.vehicleNumber).toLowerCase()
          const plateNorm = plateRaw.replace(/[-\s]/g, "")
          const area = record.area.toLowerCase()
          const phone = (real?.phoneNumber ?? record.phoneNumber ?? "").toLowerCase()
          const matches = terms.some((term) => {
            const termNorm = term.replace(/[-\s]/g, "")
            return plateRaw.includes(term) || plateNorm.includes(termNorm) || area.includes(term) || phone.includes(term)
          })
          if (!matches) return false
        }
      }
      if (colFilters.areas.length > 0 && !colFilters.areas.includes(record.area)) return false
      if (assignedToId === "nobody" && record.assignedTo !== null) return false
      return true
    })
  }, [data, assignedToId, deferredSearch, colFilters, revealed])

  const table = useReactTable({
    data: filteredData as TData[],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  })

  const pageNumbers = getPageNumbers(page)

  // Track which page triggered the current fetch so we can show the right spinner
  const [pendingPage, setPendingPage] = React.useState<number | null>(null)
  React.useEffect(() => {
    if (!isRefetching) setPendingPage(null)
  }, [isRefetching])

  function handlePageChange(p: number) {
    setPendingPage(p)
    onPageChange(p)
  }

  const isPaginationFetching = isRefetching && pendingPage !== null

  const hasFilters =
    timeRange !== "all" || search !== "" || colFilters.areas.length > 0 ||
    regType !== "all" || !!vehicleType || expiryFrom !== "" || expiryTo !== "" || assignedToId !== "all"

  function clearAll() {
    setSearch("")
    setColFilters(DEFAULT_COL_FILTERS)
    onAssignedToChange("all")
    onTimeRangeChange("all")
    onRegTypeChange("all")
    onVehicleTypeChange("")
    onExpiryFromChange("")
    onExpiryToChange("")
    onPageChange(1)
  }

  // Build dismissible filter badges
  const filterBadges: Array<{ key: string; label: string; Icon?: LucideIcon; onRemove: () => void }> = []
  if (timeRange === "today") filterBadges.push({ key: "timeRange", label: "Today", onRemove: () => { onTimeRangeChange("all"); onPageChange(1) } })
  if (timeRange === "week") filterBadges.push({ key: "timeRange", label: "This Week", onRemove: () => { onTimeRangeChange("all"); onPageChange(1) } })
  if (regType !== "all") filterBadges.push({ key: "regType", label: regType === "commercial" ? "Commercial" : "Private", onRemove: () => { onRegTypeChange("all"); onPageChange(1) } })
  if (vehicleType) {
    const iconName = getVehicleTypeIconName(vehicleType)
    filterBadges.push({ key: "vehicleType", label: vehicleType.toUpperCase(), Icon: iconName ? VEHICLE_ICON_MAP[iconName] : undefined, onRemove: () => { onVehicleTypeChange(""); onPageChange(1) } })
  }
  if (expiryFrom) filterBadges.push({ key: "expiryFrom", label: `Exp ≥ ${expiryFrom}`, onRemove: () => { onExpiryFromChange(""); onPageChange(1) } })
  if (expiryTo) filterBadges.push({ key: "expiryTo", label: `Exp ≤ ${expiryTo}`, onRemove: () => { onExpiryToChange(""); onPageChange(1) } })
  if (assignedToId === "nobody") {
    filterBadges.push({ key: "assignedTo", label: "Unassigned", onRemove: () => { onAssignedToChange("all"); onPageChange(1) } })
  } else if (assignedToId !== "all") {
    const agent = agents.find((a) => String(a.id) === assignedToId)
    filterBadges.push({ key: "assignedTo", label: agent ? `${agent.firstName} ${agent.lastName}` : "Agent", onRemove: () => { onAssignedToChange("all"); onPageChange(1) } })
  }
  for (const area of colFilters.areas) {
    filterBadges.push({ key: `area:${area}`, label: area.length > 28 ? area.slice(0, 28) + "…" : area, onRemove: () => setColFilters((prev) => ({ ...prev, areas: prev.areas.filter((a) => a !== area) })) })
  }

  return (
    <div className="min-w-0 overflow-hidden rounded-xl border bg-card">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 border-b bg-background px-4 py-3">
        <div className="flex flex-1 flex-wrap items-center gap-1.5">
          {TIME_CHIPS.map((chip) => (
            <button key={chip.id} onClick={() => { onTimeRangeChange(chip.id); onPageChange(1) }}
              className={cn(
                "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                timeRange === chip.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground"
              )}>
              {chip.id === timeRange && isRefetching && <Loader2Icon className="mr-1.5 size-3 animate-spin" />}
              {chip.label}
            </button>
          ))}
          {hasFilters && (
            <button onClick={clearAll}
              className="inline-flex items-center gap-1 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive transition-colors hover:bg-destructive/20">
              <XIcon className="size-3" />
              Clear all
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-52">
            <SearchIcon className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search vehicle, area..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 w-full bg-card pl-8 text-xs" />
          </div>
          <IntervalPicker />
          {onRefresh && (
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={onRefresh} disabled={isRefetching} title="Refresh">
              <RefreshCwIcon className={cn("size-3.5", isRefetching && "animate-spin")} />
            </Button>
          )}
        </div>
      </div>

      {/* Active filter badges */}
      {filterBadges.length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-b bg-background/50 px-4 py-2">
          {filterBadges.map(({ key, label, Icon, onRemove }) => (
            <button key={key} onClick={onRemove}
              className="group inline-flex items-center gap-1 rounded-full border bg-primary/5 px-2 py-0.5 text-xs font-medium text-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive">
              {Icon && <Icon className="size-3 shrink-0" />}
              {label}
              <XIcon className="size-2.5 shrink-0 opacity-50 group-hover:opacity-100" />
            </button>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const id = header.id
                  return (
                    <TableHead key={id}>
                      <div className="flex items-center">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        {id === "vehicleNumber" && (
                          <RegTypeFilter value={regType} onChange={(v) => { onRegTypeChange(v); onPageChange(1) }} active={regType !== "all"} loading={isRefetching && regType !== "all"} />
                        )}
                        {id === "vehicleType" && (
                          <VehicleTypeFilter value={vehicleType} onChange={(v) => { onVehicleTypeChange(v); onPageChange(1) }} options={vehicleTypeOptions} active={!!vehicleType} loading={isRefetching && !!vehicleType} />
                        )}
                        {id === "area" && (
                          <AreaFilter options={areaOptions} selected={colFilters.areas} onChange={(v) => setColFilters((prev) => ({ ...prev, areas: v }))} active={colFilters.areas.length > 0} />
                        )}
                        {id === "insuranceExpiry" && (
                          <DateRangeFilter label="Expiry Date Range" from={expiryFrom} to={expiryTo}
                            onFromChange={(v) => { onExpiryFromChange(v); onPageChange(1) }}
                            onToChange={(v) => { onExpiryToChange(v); onPageChange(1) }}
                            active={expiryFrom !== "" || expiryTo !== ""}
                            loading={isRefetching && (expiryFrom !== "" || expiryTo !== "")} />
                        )}
                        {id === "assignedTo" && (
                          <AssignedToFilter value={assignedToId} onChange={(v) => { onAssignedToChange(v); onPageChange(1) }} agents={agents} active={assignedToId !== "all"} loading={isRefetching && assignedToId !== "all"} />
                        )}
                      </div>
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, j) => (
                    <TableCell key={j}><div className="h-4 w-full animate-pulse rounded bg-muted" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  No records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t px-4 py-3">
        <span className="shrink-0 text-xs text-muted-foreground">
          Showing {filteredData.length} record{filteredData.length !== 1 ? "s" : ""}
          {filteredData.length < data.length && ` (${data.length - filteredData.length} filtered)`}
        </span>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Rows per page</span>
            <Select value={String(pageSize)} onValueChange={(v) => { onPageSizeChange(Number(v)); onPageChange(1) }}>
              <SelectTrigger className="h-8 w-16 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {[25, 50, 75, 100].map((n) => (
                  <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Pagination className="w-auto">
            <PaginationContent>
              {/* Previous */}
              <PaginationItem>
                <PaginationLink
                  size="default"
                  onClick={() => !isPaginationFetching && page > 1 && handlePageChange(page - 1)}
                  className={cn("select-none gap-1 pl-2", page <= 1 || isPaginationFetching ? "pointer-events-none opacity-50" : "cursor-pointer")}
                >
                  {pendingPage === page - 1
                    ? <Loader2Icon className="size-4 animate-spin" />
                    : <ChevronLeftIcon className="size-4" />}
                  <span className="hidden sm:block">Previous</span>
                </PaginationLink>
              </PaginationItem>

              {/* Page numbers */}
              {pageNumbers.map((p, idx) =>
                p === "ellipsis" ? (
                  <PaginationItem key={`e-${idx}`}><PaginationEllipsis /></PaginationItem>
                ) : (
                  <PaginationItem key={p}>
                    <PaginationLink
                      onClick={() => !isPaginationFetching && page !== p && handlePageChange(p)}
                      isActive={page === p}
                      className={cn(isPaginationFetching && page !== p ? "pointer-events-none opacity-50" : page !== p ? "cursor-pointer" : "")}
                    >
                      {pendingPage === p && isRefetching
                        ? <Loader2Icon className="size-3.5 animate-spin" />
                        : p}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              {/* Next */}
              <PaginationItem>
                <PaginationLink
                  size="default"
                  onClick={() => !isPaginationFetching && hasNextPage && handlePageChange(page + 1)}
                  className={cn("select-none gap-1 pr-2", !hasNextPage || isPaginationFetching ? "pointer-events-none opacity-50" : "cursor-pointer")}
                >
                  <span className="hidden sm:block">Next</span>
                  {pendingPage === page + 1
                    ? <Loader2Icon className="size-4 animate-spin" />
                    : <ChevronRightIcon className="size-4" />}
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}
