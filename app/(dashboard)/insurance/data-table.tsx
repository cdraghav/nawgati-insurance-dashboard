"use client"

import * as React from "react"
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
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
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { FilterIcon, SearchIcon, XIcon } from "lucide-react"
import type { InsuranceRecord } from "@/lib/mock-data"
import { realVehicleData } from "@/lib/real-data"
import { useRevealedStore } from "@/lib/revealed-store"
import { cn } from "@/lib/utils"

// ─── Types ───────────────────────────────────────────────────────────────────

type TimeChip = "all" | "today" | "week"

type ColFilters = {
  timestampFrom: string
  timestampTo: string
  vehicleType: "all" | "commercial" | "private"
  areas: string[]
  expiryFrom: string
  expiryTo: string
}

const DEFAULT_COL_FILTERS: ColFilters = {
  timestampFrom: "",
  timestampTo: "",
  vehicleType: "all",
  areas: [],
  expiryFrom: "",
  expiryTo: "",
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const TIME_CHIPS: { id: TimeChip; label: string }[] = [
  { id: "all", label: "All Time" },
  { id: "today", label: "Today" },
  { id: "week", label: "This Week" },
]


function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | "ellipsis")[] = [1]
  if (current > 3) pages.push("ellipsis")
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i)
  }
  if (current < total - 2) pages.push("ellipsis")
  if (total > 1) pages.push(total)
  return pages
}

function hasAnyColFilter(f: ColFilters) {
  return (
    f.timestampFrom !== "" ||
    f.timestampTo !== "" ||
    f.vehicleType !== "all" ||
    f.areas.length > 0 ||
    f.expiryFrom !== "" ||
    f.expiryTo !== ""
  )
}

// ─── Column filter popovers ───────────────────────────────────────────────────

function DateRangeFilter({
  label,
  from,
  to,
  onFromChange,
  onToChange,
  active,
}: {
  label: string
  from: string
  to: string
  onFromChange: (v: string) => void
  onToChange: (v: string) => void
  active: boolean
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "ml-0.5 rounded p-0.5 transition-colors hover:bg-accent",
            active ? "text-primary" : "text-muted-foreground/50 hover:text-muted-foreground"
          )}
        >
          <FilterIcon className="size-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3" align="start">
        <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">From</label>
            <Input
              type="date"
              value={from}
              onChange={(e) => onFromChange(e.target.value)}
              className="h-7 text-xs"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">To</label>
            <Input
              type="date"
              value={to}
              onChange={(e) => onToChange(e.target.value)}
              className="h-7 text-xs"
            />
          </div>
          {(from || to) && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => {
                onFromChange("")
                onToChange("")
              }}
            >
              Clear
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function VehicleTypeFilter({
  value,
  onChange,
  active,
}: {
  value: ColFilters["vehicleType"]
  onChange: (v: ColFilters["vehicleType"]) => void
  active: boolean
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "ml-0.5 rounded p-0.5 transition-colors hover:bg-accent",
            active ? "text-primary" : "text-muted-foreground/50 hover:text-muted-foreground"
          )}
        >
          <FilterIcon className="size-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-44 p-3" align="start">
        <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Vehicle Type
        </p>
        <div className="flex flex-col gap-0.5">
          {(
            [
              { id: "all", label: "All Types" },
              { id: "commercial", label: "Commercial" },
              { id: "private", label: "Private" },
            ] as const
          ).map(({ id, label }) => (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={cn(
                "flex items-center rounded px-2 py-1.5 text-xs transition-colors",
                value === id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function AreaFilter({
  options,
  selected,
  onChange,
  active,
}: {
  options: string[]
  selected: string[]
  onChange: (v: string[]) => void
  active: boolean
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "ml-0.5 rounded p-0.5 transition-colors hover:bg-accent",
            active ? "text-primary" : "text-muted-foreground/50 hover:text-muted-foreground"
          )}
        >
          <FilterIcon className="size-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-3" align="start">
        <div className="mb-2.5 flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Filter by Area
          </p>
          {selected.length > 0 && (
            <button
              onClick={() => onChange([])}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex max-h-52 flex-col gap-0.5 overflow-y-auto">
          {options.map((area) => (
            <label
              key={area}
              className="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1.5 hover:bg-accent"
            >
              <Checkbox
                checked={selected.includes(area)}
                onCheckedChange={(checked) =>
                  onChange(
                    checked
                      ? [...selected, area]
                      : selected.filter((a) => a !== area)
                  )
                }
                className="size-3.5"
              />
              <span className="text-xs">{area}</span>
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: InsuranceRecord[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "timestamp", desc: true },
  ])
  const [timeChip, setTimeChip] = React.useState<TimeChip>("all")
  const [search, setSearch] = React.useState("")
  const [colFilters, setColFilters] = React.useState<ColFilters>(DEFAULT_COL_FILTERS)
  const [pageSize, setPageSize] = React.useState(10)

  const revealed = useRevealedStore((s) => s.revealed)
  // Defer search so the input stays responsive; filtering runs in a low-priority render
  const deferredSearch = React.useDeferredValue(search)

  // Dynamic area options derived from the full dataset
  const areaOptions = React.useMemo(
    () => Array.from(new Set(data.map((r) => r.area))).sort(),
    [data]
  )

  // All filtering happens here — TanStack only handles sort + pagination
  const filteredData = React.useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStr = today.toISOString().split("T")[0]
    const weekAgo = new Date(today)
    weekAgo.setDate(today.getDate() - 6)
    const weekAgoStr = weekAgo.toISOString().split("T")[0]

    return data.filter((record) => {
      // Time chip (instant)
      if (timeChip === "today") {
        if (!record.timestamp.startsWith(todayStr)) return false
      } else if (timeChip === "week") {
        const d = record.timestamp.split(" ")[0]
        if (d < weekAgoStr || d > todayStr) return false
      }

      // Global search — comma-separated terms, searches real numbers for revealed rows
      if (deferredSearch) {
        const terms = deferredSearch.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean)
        if (terms.length > 0) {
          const real = revealed[record.id]
          // Normalize plate: remove hyphens/spaces for flexible matching
          const plateRaw = (real?.vehicleNumber ?? record.vehicleNumber).toLowerCase()
          const plateNorm = plateRaw.replace(/[-\s]/g, "")
          const area = record.area.toLowerCase()
          const phone = real?.phoneNumber?.toLowerCase() ?? record.phoneNumber.toLowerCase()
          const matches = terms.some((term) => {
            const termNorm = term.replace(/[-\s]/g, "")
            return (
              plateRaw.includes(term) ||
              plateNorm.includes(termNorm) ||
              area.includes(term) ||
              phone.includes(term)
            )
          })
          if (!matches) return false
        }
      }

      // Column: timestamp date range
      const recDate = record.timestamp.split(" ")[0]
      if (colFilters.timestampFrom && recDate < colFilters.timestampFrom) return false
      if (colFilters.timestampTo && recDate > colFilters.timestampTo) return false

      // Column: vehicle type
      if (colFilters.vehicleType !== "all") {
        if (colFilters.vehicleType === "commercial" && !record.isCommercial) return false
        if (colFilters.vehicleType === "private" && record.isCommercial) return false
      }

      // Column: area
      if (colFilters.areas.length > 0 && !colFilters.areas.includes(record.area))
        return false

      // Column: insurance expiry date range
      if (colFilters.expiryFrom && record.insuranceExpiry < colFilters.expiryFrom) return false
      if (colFilters.expiryTo && record.insuranceExpiry > colFilters.expiryTo) return false

      return true
    })
  }, [data, timeChip, deferredSearch, colFilters, revealed])

  const table = useReactTable({
    data: filteredData as TData[],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
    initialState: { pagination: { pageSize: 10 } },
  })

  // Sync page size and reset to page 0 when filtered results change
  React.useEffect(() => {
    table.setPageSize(pageSize)
  }, [pageSize]) // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    table.setPageIndex(0)
  }, [filteredData]) // eslint-disable-line react-hooks/exhaustive-deps

  const pageCount = table.getPageCount()
  const currentPage = table.getState().pagination.pageIndex + 1
  const pageNumbers = getPageNumbers(currentPage, pageCount)

  const hasFilters =
    timeChip !== "all" || search !== "" || hasAnyColFilter(colFilters)

  function updateColFilter<K extends keyof ColFilters>(key: K, value: ColFilters[K]) {
    setColFilters((prev) => ({ ...prev, [key]: value }))
  }

  function clearAll() {
    setTimeChip("all")
    setSearch("")
    setColFilters(DEFAULT_COL_FILTERS)
  }

  return (
    <div className="min-w-0 overflow-hidden rounded-xl border bg-card">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 border-b bg-background px-4 py-3">
        {/* Quick time chips */}
        <div className="flex flex-1 flex-wrap items-center gap-1.5">
          {TIME_CHIPS.map((chip) => (
            <button
              key={chip.id}
              onClick={() => setTimeChip(chip.id)}
              className={cn(
                "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                timeChip === chip.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground"
              )}
            >
              {chip.label}
            </button>
          ))}
          {hasFilters && (
            <button
              onClick={clearAll}
              className="inline-flex items-center gap-1 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive transition-colors hover:bg-destructive/20"
            >
              <XIcon className="size-3" />
              Clear all
            </button>
          )}
        </div>

        {/* Global search */}
        <div className="relative w-full sm:w-52">
          <SearchIcon className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search vehicle, area..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-full bg-card pl-8 text-xs"
          />
        </div>
      </div>

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
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}

                        {/* Per-column filter buttons */}
                        {id === "timestamp" && (
                          <DateRangeFilter
                            label="Scan Date Range"
                            from={colFilters.timestampFrom}
                            to={colFilters.timestampTo}
                            onFromChange={(v) => updateColFilter("timestampFrom", v)}
                            onToChange={(v) => updateColFilter("timestampTo", v)}
                            active={
                              colFilters.timestampFrom !== "" ||
                              colFilters.timestampTo !== ""
                            }
                          />
                        )}

                        {id === "vehicleNumber" && (
                          <VehicleTypeFilter
                            value={colFilters.vehicleType}
                            onChange={(v) => updateColFilter("vehicleType", v)}
                            active={colFilters.vehicleType !== "all"}
                          />
                        )}

                        {id === "area" && (
                          <AreaFilter
                            options={areaOptions}
                            selected={colFilters.areas}
                            onChange={(v) => updateColFilter("areas", v)}
                            active={colFilters.areas.length > 0}
                          />
                        )}

                        {id === "insuranceExpiry" && (
                          <DateRangeFilter
                            label="Expiry Date Range"
                            from={colFilters.expiryFrom}
                            to={colFilters.expiryTo}
                            onFromChange={(v) => updateColFilter("expiryFrom", v)}
                            onToChange={(v) => updateColFilter("expiryTo", v)}
                            active={
                              colFilters.expiryFrom !== "" ||
                              colFilters.expiryTo !== ""
                            }
                          />
                        )}
                      </div>
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination footer */}
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t px-4 py-3">
        {/* Record count */}
        <span className="shrink-0 text-xs text-muted-foreground">
          {filteredData.length} record{filteredData.length !== 1 ? "s" : ""}
          {hasFilters && ` of ${data.length}`}
        </span>

        {/* Rows per page + pagination on the right */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Rows per page</span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => setPageSize(Number(v))}
            >
              <SelectTrigger className="h-8 w-16 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {pageCount > 1 && (
            <Pagination className="w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      table.getCanPreviousPage() && table.previousPage()
                    }
                    className={cn(
                      "select-none",
                      !table.getCanPreviousPage()
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    )}
                  />
                </PaginationItem>

                {pageNumbers.map((page, idx) =>
                  page === "ellipsis" ? (
                    <PaginationItem key={`ellipsis-${idx}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => table.setPageIndex(page - 1)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => table.getCanNextPage() && table.nextPage()}
                    className={cn(
                      "select-none",
                      !table.getCanNextPage()
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  )
}
